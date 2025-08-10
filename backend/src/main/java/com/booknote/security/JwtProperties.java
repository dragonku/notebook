package com.booknote.security;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "jwt")
@Getter
@Setter
public class JwtProperties {
    
    private String secret;
    private int accessTokenTtlMinutes = 15;
    private int refreshTokenTtlDays = 14;
    
    // 편의 메서드
    public long getAccessTokenTtlMillis() {
        return accessTokenTtlMinutes * 60L * 1000L;
    }
    
    public long getRefreshTokenTtlMillis() {
        return refreshTokenTtlDays * 24L * 60L * 60L * 1000L;
    }
}