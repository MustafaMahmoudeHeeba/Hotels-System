package com.aydin.reservationservice.service;

import com.aydin.reservationservice.model.Reservation;
import com.aydinreservationcommon.dto.ReservationEvent;
import com.aydin.reservationservice.repository.ReservationRepository;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.kafka.core.KafkaTemplate;

import java.time.LocalDate;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ReservationServiceTest {

    private final ReservationRepository reservationRepository = mock(ReservationRepository.class);
    private final KafkaTemplate<String, ReservationEvent> kafkaTemplate = mock(KafkaTemplate.class);
    private final ReservationService reservationService = new ReservationService(reservationRepository, kafkaTemplate);

    @Test
    void testCreateReservation_Success() {
        Reservation reservation = Reservation.builder()
                .hotelId(1L)
                .roomId(1L)
                .guestName("John Doe")
                .checkInDate(LocalDate.now().plusDays(1))
                .checkOutDate(LocalDate.now().plusDays(3))
                .build();

        when(reservationRepository.findConflictingReservationsWithLock(
                anyLong(),
                any(LocalDate.class),
                any(LocalDate.class)
        )).thenReturn(Collections.emptyList());

        when(reservationRepository.save(any(Reservation.class))).thenReturn(reservation);

        Reservation saved = reservationService.createReservation(reservation);

        assertNotNull(saved);

        ArgumentCaptor<ReservationEvent> eventCaptor = ArgumentCaptor.forClass(ReservationEvent.class);
        verify(kafkaTemplate, times(1)).send(anyString(), eventCaptor.capture());

        ReservationEvent sentEvent = eventCaptor.getValue();

        assertEquals(reservation.getId(), sentEvent.getReservationId());
        assertEquals(reservation.getHotelId(), sentEvent.getHotelId());
        assertEquals(reservation.getRoomId(), sentEvent.getRoomId());
        assertEquals(reservation.getGuestName(), sentEvent.getGuestName());
        assertEquals(reservation.getCheckInDate(), sentEvent.getCheckInDate());
        assertEquals(reservation.getCheckOutDate(), sentEvent.getCheckOutDate());
    }



    @Test
    void testCreateReservation_Conflict() {
        Reservation reservation = Reservation.builder()
                .hotelId(1L)
                .roomId(1L)
                .guestName("John Doe")
                .checkInDate(LocalDate.now().plusDays(1))
                .checkOutDate(LocalDate.now().plusDays(3))
                .build();

        when(reservationRepository.findConflictingReservationsWithLock(
                anyLong(),
                any(LocalDate.class),
                any(LocalDate.class)
        )).thenReturn(Collections.singletonList(reservation));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            reservationService.createReservation(reservation);
        });

        assertEquals("Selected room is already booked for the given dates.", exception.getMessage());
    }

}
