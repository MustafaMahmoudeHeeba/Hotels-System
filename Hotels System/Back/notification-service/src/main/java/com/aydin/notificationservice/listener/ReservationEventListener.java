package com.aydin.notificationservice.listener;

import com.aydinreservationcommon.dto.ReservationEvent;
import org.slf4j.*;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class ReservationEventListener {

    private static final Logger logger = LoggerFactory.getLogger(ReservationEventListener.class);

    @KafkaListener(topics = "reservation-created", groupId = "notification-group", containerFactory = "kafkaListenerContainerFactory")
    public void listen(ReservationEvent event) {
        logger.info("ReservationEventListener -> Yeni rezervasyon bildirimi alındı: {}", event);
    }
}
