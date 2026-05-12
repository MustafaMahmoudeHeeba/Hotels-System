package com.aydin.notificationservice.listener;

import com.aydin.notificationservice.controller.NotificationController;
import com.aydinreservationcommon.dto.ReservationEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class NotificationListener {

    private static final Logger logger = LoggerFactory.getLogger(NotificationListener.class);
    private final NotificationController notificationController;

    public NotificationListener(NotificationController notificationController) {
        this.notificationController = notificationController;
    }

    // استماع لأحداث إنشاء الحجز
    @KafkaListener(topics = "reservation-created", groupId = "notification-group")
    public void listenReservationCreated(ReservationEvent event) {
        String message = String.format("NEW RESERVATION: ID=%d | Guest=%s | Room=%d | Dates=%s to %s",
                event.getReservationId(),
                event.getGuestName(),
                event.getRoomId(),
                event.getCheckInDate(),
                event.getCheckOutDate());

        logger.info(message);
        notificationController.addMessage(message);
    }

    @KafkaListener(topics = "reservation-cancelled", groupId = "notification-cancelled-group")
    public void listenReservationCancelled(ReservationEvent event) {
        String message = String.format("RESERVATION CANCELLED: ID=%d | Guest=%s | Room=%d | Dates=%s to %s",
                event.getReservationId(),
                event.getGuestName(),
                event.getRoomId(),
                event.getCheckInDate(),
                event.getCheckOutDate());

        logger.info(message);
        notificationController.addMessage(message);
    }
}