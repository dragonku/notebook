package com.booknote.service;

import com.booknote.domain.User;
import com.booknote.dto.OnboardingRequest;
import com.booknote.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;

    /**
     * 온보딩 프로세스를 완료하고 사용자 프로필을 설정합니다.
     */
    public User completeOnboarding(OnboardingRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));

        if (user.isOnboardingCompleted()) {
            throw new RuntimeException("이미 온보딩이 완료된 사용자입니다");
        }

        // 프로필 정보 업데이트
        user.setFavoriteGenres(new HashSet<>(request.getFavoriteGenres()));
        user.setReadingGoalMonthly(request.getReadingGoalMonthly());
        user.setPrivacyLevel(request.getPrivacyLevel());
        user.setOnboardingCompleted(true);

        return userRepository.save(user);
    }

    /**
     * 현재 인증된 사용자 정보를 조회합니다.
     */
    @Transactional(readOnly = true)
    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
    }

    /**
     * 사용자의 온보딩 완료 상태를 확인합니다.
     */
    @Transactional(readOnly = true)
    public boolean isOnboardingCompleted() {
        try {
            User user = getCurrentUser();
            return user.isOnboardingCompleted();
        } catch (Exception e) {
            return false;
        }
    }
}