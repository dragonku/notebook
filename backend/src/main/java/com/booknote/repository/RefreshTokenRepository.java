package com.booknote.repository;

import com.booknote.domain.RefreshToken;
import com.booknote.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    /**
     * 토큰 해시로 RefreshToken 조회
     */
    Optional<RefreshToken> findByTokenHash(String tokenHash);

    /**
     * 사용자의 모든 RefreshToken 조회
     */
    List<RefreshToken> findByUser(User user);

    /**
     * 사용자의 특정 RefreshToken 삭제
     */
    void deleteByTokenHash(String tokenHash);

    /**
     * 사용자의 모든 RefreshToken 삭제 (로그아웃 시)
     */
    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.user = :user")
    void deleteByUser(User user);

    /**
     * 만료된 모든 토큰 삭제 (스케줄링)
     */
    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.expiresAt < :now")
    void deleteExpiredTokens(LocalDateTime now);

    /**
     * 사용자의 유효한 토큰 개수 조회 (다중 디바이스 지원용)
     */
    @Query("SELECT COUNT(rt) FROM RefreshToken rt WHERE rt.user = :user AND rt.expiresAt > :now")
    long countValidTokensByUser(User user, LocalDateTime now);

    /**
     * 사용자의 만료된 토큰들 삭제
     */
    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.user = :user AND rt.expiresAt < :now")
    void deleteExpiredTokensByUser(User user, LocalDateTime now);
}