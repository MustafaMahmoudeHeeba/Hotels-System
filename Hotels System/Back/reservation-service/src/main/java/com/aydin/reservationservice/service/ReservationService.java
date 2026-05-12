package com.aydin.reservationservice.service;

import com.aydinreservationcommon.dto.ReservationEvent;
import com.aydin.reservationservice.model.Reservation;
import com.aydin.reservationservice.repository.ReservationRepository;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final KafkaTemplate<String, ReservationEvent> kafkaTemplate;

    private static final String TOPIC = "reservation-created";

    public ReservationService(ReservationRepository reservationRepository, KafkaTemplate<String, ReservationEvent> kafkaTemplate) {
        this.reservationRepository = reservationRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @Transactional
    public Reservation createReservation(Reservation reservation) {
        List<Reservation> conflicts = reservationRepository.findConflictingReservationsWithLock(
                reservation.getRoomId(), reservation.getCheckInDate(), reservation.getCheckOutDate());

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Selected room is already booked for the given dates.");
        }

        Reservation saved = reservationRepository.save(reservation);

        kafkaTemplate.send(TOPIC, ReservationEvent.builder()
                .reservationId(saved.getId())
                .hotelId(saved.getHotelId())
                .roomId(saved.getRoomId())
                .guestName(saved.getGuestName())
                .checkInDate(saved.getCheckInDate())
                .checkOutDate(saved.getCheckOutDate())
                .build());

        return saved;
    }

    public List<Reservation> findAll() {
        return reservationRepository.findAll();
    }

    public Reservation findById(Long id) {
        return reservationRepository.findById(id).orElse(null);
    }
    
    public List<Reservation> findByGuestName(String guestName) {
        return reservationRepository.findByGuestName(guestName);
    }
    
    public void deleteById(Long id) {
    	reservationRepository.deleteById(id);
    }
}
