package com.aydin.hotelservice.service;

import com.aydin.hotelservice.model.Hotel;
import com.aydin.hotelservice.repository.HotelRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HotelService {

    private final HotelRepository hotelRepository;

    public HotelService(HotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    public Hotel save(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    public List<Hotel> findAll() {
        return hotelRepository.findAll();
    }

    public Optional<Hotel> findById(Long id) {
        return hotelRepository.findById(id);
    }

    public void deleteById(Long id) {
        hotelRepository.deleteById(id);
    }
}
