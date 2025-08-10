package com.booknote.repository;

import com.booknote.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * 이메일로 사용자 조회
     */
    Optional<User> findByEmail(String email);

    /**
     * 이메일 중복 체크
     */
    boolean existsByEmail(String email);

    /**
     * 닉네임 중복 체크
     */
    boolean existsByNickname(String nickname);

    /**
     * 닉네임으로 사용자 조회
     */
    Optional<User> findByNickname(String nickname);

    /**
     * 온보딩 미완료 사용자 수 조회 (통계용)
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.onboardingCompleted = false")
    long countByOnboardingIncomplete();

    /**
     * 활성 사용자 수 조회 (최근 30일 내 로그인)
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.lastLoginAt >= :since")
    long countActiveUsersSince(java.time.LocalDateTime since);
}