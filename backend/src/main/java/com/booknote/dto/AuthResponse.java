package com.booknote.dto;

import com.booknote.domain.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private UserProfile user;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserProfile {
        private Long id;
        private String email;
        private String nickname;
        private String profileImageUrl;
        private Boolean onboardingCompleted;
        
        public static UserProfile from(User user) {
            return UserProfile.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .nickname(user.getNickname())
                    .profileImageUrl(user.getProfileImageUrl())
                    .onboardingCompleted(user.getOnboardingCompleted())
                    .build();
        }
    }

    public static AuthResponse of(String accessToken, String refreshToken, User user) {
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(UserProfile.from(user))
                .build();
    }
}