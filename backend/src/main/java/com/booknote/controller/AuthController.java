package com.booknote.controller;

import com.booknote.dto.*;
import com.booknote.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    /**
     * 회원가입
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {
        try {
            AuthResponse response = authService.signup(request);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "message", "회원가입이 완료되었습니다",
                    "data", response
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "SIGNUP_FAILED",
                    "message", e.getMessage(),
                    "timestamp", LocalDateTime.now()
            ));
        } catch (Exception e) {
            log.error("회원가입 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "error", "INTERNAL_SERVER_ERROR",
                    "message", "서버 오류가 발생했습니다",
                    "timestamp", LocalDateTime.now()
            ));
        }
    }

    /**
     * 로그인
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            
            return ResponseEntity.ok(Map.of(
                    "message", "로그인이 완료되었습니다",
                    "data", response
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "error", "LOGIN_FAILED",
                    "message", e.getMessage(),
                    "timestamp", LocalDateTime.now()
            ));
        } catch (Exception e) {
            log.error("로그인 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "error", "INTERNAL_SERVER_ERROR",
                    "message", "서버 오류가 발생했습니다",
                    "timestamp", LocalDateTime.now()
            ));
        }
    }

    /**
     * 토큰 갱신
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        try {
            AuthResponse response = authService.refreshToken(request);
            
            return ResponseEntity.ok(Map.of(
                    "message", "토큰이 갱신되었습니다",
                    "data", response
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "error", "TOKEN_REFRESH_FAILED",
                    "message", e.getMessage(),
                    "timestamp", LocalDateTime.now()
            ));
        } catch (Exception e) {
            log.error("토큰 갱신 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "error", "INTERNAL_SERVER_ERROR",
                    "message", "서버 오류가 발생했습니다",
                    "timestamp", LocalDateTime.now()
            ));
        }
    }

    /**
     * 로그아웃
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@Valid @RequestBody RefreshTokenRequest request) {
        try {
            authService.logout(request.getRefreshToken());
            
            return ResponseEntity.ok(Map.of(
                    "message", "로그아웃이 완료되었습니다",
                    "timestamp", LocalDateTime.now()
            ));
        } catch (Exception e) {
            log.error("로그아웃 중 오류 발생", e);
            // 로그아웃은 실패해도 성공으로 처리 (클라이언트 측 토큰 삭제가 더 중요)
            return ResponseEntity.ok(Map.of(
                    "message", "로그아웃이 완료되었습니다",
                    "timestamp", LocalDateTime.now()
            ));
        }
    }

    /**
     * 이메일 중복 체크
     */
    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmailAvailability(@RequestParam String email) {
        try {
            boolean exists = authService.isEmailExists(email);
            
            return ResponseEntity.ok(Map.of(
                    "email", email,
                    "available", !exists,
                    "message", exists ? "이미 사용 중인 이메일입니다" : "사용 가능한 이메일입니다"
            ));
        } catch (Exception e) {
            log.error("이메일 중복 체크 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "error", "INTERNAL_SERVER_ERROR",
                    "message", "서버 오류가 발생했습니다",
                    "timestamp", LocalDateTime.now()
            ));
        }
    }

    /**
     * 닉네임 중복 체크
     */
    @GetMapping("/check-nickname")
    public ResponseEntity<?> checkNicknameAvailability(@RequestParam String nickname) {
        try {
            boolean exists = authService.isNicknameExists(nickname);
            
            return ResponseEntity.ok(Map.of(
                    "nickname", nickname,
                    "available", !exists,
                    "message", exists ? "이미 사용 중인 닉네임입니다" : "사용 가능한 닉네임입니다"
            ));
        } catch (Exception e) {
            log.error("닉네임 중복 체크 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "error", "INTERNAL_SERVER_ERROR",
                    "message", "서버 오류가 발생했습니다",
                    "timestamp", LocalDateTime.now()
            ));
        }
    }
}