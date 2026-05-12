package com.aydin.hotelservice.service;

import com.aydin.hotelservice.model.Hotel;
import com.aydin.hotelservice.repository.HotelRepository;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class HotelServiceTest {

	@Mock
    private HotelRepository hotelRepository;

    @InjectMocks
    private HotelService hotelService;

    @Test
    void testSaveHotel() {
        Hotel hotel = Hotel.builder()
                .name("Test Hotel")
                .address("Test Address")
                .starRating(4)
                .build();

        Mockito.when(hotelRepository.save(any(Hotel.class))).thenReturn(hotel);

        Hotel saved = hotelService.save(hotel);

        Assertions.assertEquals("Test Hotel", saved.getName());
        
        verify(hotelRepository, times(1)).save(hotel);
    }
}
