package com.aydinreservationcommon.dto;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationEvent {
    private Long reservationId;
    private Long hotelId;
    private Long roomId;
    private String guestName;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    
   
    private String eventType; 
    
    @Override
    public String toString() {
        return "ReservationEvent{" +
                "reservationId=" + reservationId +
                ", hotelId=" + hotelId +
                ", roomId=" + roomId +
                ", guestName='" + guestName + '\'' +
                ", checkInDate=" + checkInDate +
                ", checkOutDate=" + checkOutDate +
                ", eventType='" + eventType + '\'' +
                '}';
    }
}