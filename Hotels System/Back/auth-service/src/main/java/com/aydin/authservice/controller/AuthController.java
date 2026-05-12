package com.aydin.authservice.controller;

import com.aydin.authservice.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    
    private final List<User> users = List.of(
            new User("user1", "password", "USER"),
            new User("admin", "adminpass", "ADMIN")
    );

    private static final String SECRET = "a-string-secret-at-least-256-bits-long-123456";
    private static final SecretKey SECRET_KEY = new SecretKeySpec(SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256");

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestParam String username, @RequestParam String password) {
        Optional<User> matched = users.stream()
                .filter(u -> u.getUsername().equals(username) && u.getPassword().equals(password))
                .findFirst();

        if (matched.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        User user = matched.get();
        
        String token = Jwts.builder()
                .setSubject(user.getUsername())
                .claim("role", user.getRole())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();

        return ResponseEntity.ok(Map.of("token", token));
    }
}
