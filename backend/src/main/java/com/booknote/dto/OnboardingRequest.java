package com.booknote.dto;

import com.booknote.domain.User;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.Set;

@Data
public class OnboardingRequest {

    @NotNull(message = "선호 장르를 선택해주세요")
    @Size(min = 1, max = 5, message = "선호 장르는 1개 이상 5개 이하로 선택해주세요")
    private Set<User.Genre> favoriteGenres;

    @NotNull(message = "월간 독서 목표를 설정해주세요")
    @Min(value = 1, message = "월간 독서 목표는 최소 1권 이상이어야 합니다")
    @Max(value = 100, message = "월간 독서 목표는 최대 100권까지 설정 가능합니다")
    private Integer readingGoalMonthly;

    @NotNull(message = "공개 범위를 설정해주세요")
    private User.PrivacyLevel privacyLevel;
}