package com.booknote.controller;

import com.booknote.domain.User;
import com.booknote.dto.OnboardingRequest;
import com.booknote.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * 온보딩 프로세스 완료
     */
    @PostMapping("/onboarding")
    public ResponseEntity<User> completeOnboarding(@Valid @RequestBody OnboardingRequest request) {
        User user = userService.completeOnboarding(request);
        return ResponseEntity.ok(user);
    }

    /**
     * 현재 사용자 정보 조회
     */
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(user);
    }

    /**
     * 온보딩 완료 상태 확인
     */
    @GetMapping("/onboarding-status")
    public ResponseEntity<OnboardingStatusResponse> getOnboardingStatus() {
        boolean completed = userService.isOnboardingCompleted();
        return ResponseEntity.ok(new OnboardingStatusResponse(completed));
    }

    /**
     * 온보딩 상태 응답 DTO
     */
    public record OnboardingStatusResponse(boolean onboardingCompleted) {}
}