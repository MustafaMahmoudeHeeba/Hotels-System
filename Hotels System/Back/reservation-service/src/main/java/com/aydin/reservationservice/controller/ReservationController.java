package com.aydin.reservationservice.controller;

import com.aydin.reservationservice.model.Reservation;
import com.aydin.reservationservice.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    
    @GetMapping
    public ResponseEntity<List<Reservation>> getUserReservations(@AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        return ResponseEntity.ok(reservationService.findByGuestName(username));
    }

    
    @PostMapping
    public ResponseEntity<?> createReservation(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody Reservation reservation) {
        try {
            reservation.setGuestName(jwt.getSubject());
            reservation.setCreatedAt(LocalDateTime.now());
            Reservation saved = reservationService.createReservation(reservation);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    
    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getById(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        Optional<Reservation> optionalRes = Optional.ofNullable(reservationService.findById(id));

        if (optionalRes.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Reservation res = optionalRes.get();
        
        if (!res.getGuestName().equals(jwt.getSubject())) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(res);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
    	reservationService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
