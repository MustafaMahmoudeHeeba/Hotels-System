package com.aydin.hotelservice.service;

import com.aydin.hotelservice.model.Room;
import com.aydin.hotelservice.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public Room save(Room room) {
        return roomRepository.save(room);
    }

    public List<Room> findAll() {
        return roomRepository.findAll();
    }

    public List<Room> findByHotelId(Long hotelId) {
        return roomRepository.findByHotelId(hotelId);
    }

    public Optional<Room> findById(Long id) {
        return roomRepository.findById(id);
    }

    public void deleteById(Long id) {
        roomRepository.deleteById(id);
    }
}
