package com.aydin.apigateway.config;

import java.nio.charset.StandardCharsets;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    private static final String SECRET = "a-string-secret-at-least-256-bits-long-123456";

    @Bean
    public SecretKey secretKey() {
        return new SecretKeySpec(SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
    }

    @Bean
    public ReactiveJwtDecoder reactiveJwtDecoder(SecretKey secretKey) {
        return NimbusReactiveJwtDecoder.withSecretKey(secretKey).build();
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
            .csrf(ServerHttpSecurity.CsrfSpec::disable)
            .authorizeExchange(exchanges -> exchanges
                .pathMatchers("/login", "/logout").permitAll()
                .anyExchange().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwtSpec -> jwtSpec.jwtDecoder(reactiveJwtDecoder(secretKey())))
            )
            .build();
    }
}
