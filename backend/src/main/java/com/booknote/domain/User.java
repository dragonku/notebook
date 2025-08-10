package com.booknote.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    @Email(message = "유효한 이메일 형식이어야 합니다")
    @NotBlank(message = "이메일은 필수입니다")
    private String email;

    @Column(nullable = false)
    @NotBlank(message = "비밀번호는 필수입니다")
    @Size(min = 8, message = "비밀번호는 최소 8자 이상이어야 합니다")
    private String passwordHash;

    @Column(nullable = false)
    @NotBlank(message = "닉네임은 필수입니다")
    @Size(min = 2, max = 20, message = "닉네임은 2-20자 사이여야 합니다")
    private String nickname;

    @Column
    private String profileImageUrl;

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "user_favorite_genres", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "genre")
    private Set<Genre> favoriteGenres;

    @Column
    private Integer readingGoalMonthly = 5; // 월간 독서 목표 (기본값 5권)

    @Enumerated(EnumType.STRING)
    @Column
    @Builder.Default
    private PrivacyLevel privacyLevel = PrivacyLevel.PRIVATE; // 기본 공개 범위

    @Column
    private String timezone = "Asia/Seoul";

    @Column
    @Builder.Default
    private Boolean onboardingCompleted = false; // 온보딩 완료 여부

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column
    private LocalDateTime updatedAt;

    @Column
    private LocalDateTime lastLoginAt;

    public enum Genre {
        FICTION("소설"),
        NON_FICTION("비소설"),
        SELF_DEVELOPMENT("자기계발"),
        HISTORY("역사"),
        SCIENCE("과학"),
        PHILOSOPHY("철학"),
        ART("예술"),
        TRAVEL("여행"),
        COOKING("요리"),
        HEALTH("건강"),
        BUSINESS("비즈니스"),
        TECHNOLOGY("기술"),
        ROMANCE("로맨스"),
        MYSTERY("미스터리"),
        FANTASY("판타지"),
        BIOGRAPHY("전기"),
        EDUCATION("교육"),
        CHILDREN("아동"),
        COMIC("만화"),
        OTHER("기타");

        private final String displayName;

        Genre(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    public enum PrivacyLevel {
        PUBLIC("공개"),
        FRIENDS_ONLY("친구만"),
        PRIVATE("비공개");

        private final String displayName;

        PrivacyLevel(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    // 편의 메서드
    public void updateLastLoginAt() {
        this.lastLoginAt = LocalDateTime.now();
    }

    public void completeOnboarding() {
        this.onboardingCompleted = true;
    }

    public boolean isOnboardingRequired() {
        return !Boolean.TRUE.equals(this.onboardingCompleted);
    }
}