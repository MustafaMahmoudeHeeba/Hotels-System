package com.aydin.notificationservice.listener;

import com.aydin.notificationservice.controller.NotificationController;
import com.aydinreservationcommon.dto.ReservationEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class ReservationEventListener {

    @Autowired
    private NotificationController notificationController;

    @KafkaListener(topics = "reservation-created", groupId = "notification-group")
    public void listen(ReservationEvent event) {
        System.out.println("New reservation notification received: " + event);

        if (notificationController != null) {
            notificationController.addMessage(event.toString());
            System.out.println("Message added to notifications list");
        } else {
            System.out.println("NotificationController is NULL!");
        }
    }
}