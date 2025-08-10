package com.booknote.service;

import com.booknote.domain.RefreshToken;
import com.booknote.domain.User;
import com.booknote.dto.AuthResponse;
import com.booknote.dto.LoginRequest;
import com.booknote.dto.RefreshTokenRequest;
import com.booknote.dto.SignupRequest;
import com.booknote.repository.RefreshTokenRepository;
import com.booknote.repository.UserRepository;
import com.booknote.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * 회원가입
     */
    public AuthResponse signup(SignupRequest request) {
        // 이메일 중복 체크
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 가입된 이메일입니다: " + request.getEmail());
        }

        // 닉네임 중복 체크
        if (userRepository.existsByNickname(request.getNickname())) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다: " + request.getNickname());
        }

        // 사용자 생성
        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .onboardingCompleted(false) // 온보딩 미완료 상태
                .build();

        User savedUser = userRepository.save(user);
        log.info("새 사용자 회원가입: userId={}, email={}", savedUser.getId(), savedUser.getEmail());

        // JWT 토큰 생성
        String accessToken = jwtTokenProvider.generateAccessToken(savedUser);
        String refreshToken = jwtTokenProvider.generateRefreshToken(savedUser);

        // Refresh Token을 데이터베이스에 저장
        saveRefreshToken(savedUser, refreshToken);

        return AuthResponse.of(accessToken, refreshToken, savedUser);
    }

    /**
     * 로그인
     */
    public AuthResponse login(LoginRequest request) {
        // 사용자 조회
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 이메일입니다: " + request.getEmail()));

        // 비밀번호 확인
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("비밀번호가 올바르지 않습니다");
        }

        // 마지막 로그인 시간 업데이트
        user.updateLastLoginAt();
        userRepository.save(user);

        // JWT 토큰 생성
        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);

        // 기존 Refresh Token들 정리 (만료된 것들)
        refreshTokenRepository.deleteExpiredTokensByUser(user, LocalDateTime.now());

        // 새 Refresh Token 저장
        saveRefreshToken(user, refreshToken);

        log.info("사용자 로그인: userId={}, email={}", user.getId(), user.getEmail());

        return AuthResponse.of(accessToken, refreshToken, user);
    }

    /**
     * 토큰 갱신
     */
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String refreshTokenValue = request.getRefreshToken();
        
        // 토큰 유효성 검사
        if (!jwtTokenProvider.isTokenValid(refreshTokenValue)) {
            throw new IllegalArgumentException("유효하지 않은 리프레시 토큰입니다");
        }

        // 토큰 해시로 데이터베이스에서 조회
        String tokenHash = jwtTokenProvider.hashToken(refreshTokenValue);
        RefreshToken refreshToken = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 리프레시 토큰입니다"));

        // 토큰 만료 체크
        if (refreshToken.isExpired()) {
            refreshTokenRepository.delete(refreshToken);
            throw new IllegalArgumentException("만료된 리프레시 토큰입니다");
        }

        User user = refreshToken.getUser();

        // 새로운 토큰들 생성
        String newAccessToken = jwtTokenProvider.generateAccessToken(user);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user);

        // 기존 Refresh Token 삭제 및 새 토큰 저장 (Token Rotation)
        refreshTokenRepository.delete(refreshToken);
        saveRefreshToken(user, newRefreshToken);

        log.info("토큰 갱신 완료: userId={}", user.getId());

        return AuthResponse.of(newAccessToken, newRefreshToken, user);
    }

    /**
     * 로그아웃
     */
    public void logout(String refreshTokenValue) {
        try {
            String tokenHash = jwtTokenProvider.hashToken(refreshTokenValue);
            refreshTokenRepository.deleteByTokenHash(tokenHash);
            log.info("사용자 로그아웃 완료");
        } catch (Exception e) {
            log.warn("로그아웃 중 오류 발생: {}", e.getMessage());
            // 로그아웃은 실패해도 클라이언트 측에서는 성공으로 처리
        }
    }

    /**
     * 모든 디바이스에서 로그아웃 (보안용)
     */
    public void logoutAll(User user) {
        refreshTokenRepository.deleteByUser(user);
        log.info("전체 디바이스 로그아웃 완료: userId={}", user.getId());
    }

    /**
     * Refresh Token 저장 (내부 메서드)
     */
    private void saveRefreshToken(User user, String refreshTokenValue) {
        String tokenHash = jwtTokenProvider.hashToken(refreshTokenValue);
        LocalDateTime expiresAt = LocalDateTime.now().plusDays(14); // 14일 후 만료

        RefreshToken refreshToken = RefreshToken.builder()
                .tokenHash(tokenHash)
                .user(user)
                .expiresAt(expiresAt)
                .build();

        refreshTokenRepository.save(refreshToken);
    }

    /**
     * 이메일 존재 여부 확인
     */
    @Transactional(readOnly = true)
    public boolean isEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * 닉네임 존재 여부 확인
     */
    @Transactional(readOnly = true)
    public boolean isNicknameExists(String nickname) {
        return userRepository.existsByNickname(nickname);
    }
}