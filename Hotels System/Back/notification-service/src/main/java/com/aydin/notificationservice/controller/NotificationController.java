package com.aydin.notificationservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final List<String> messages = new ArrayList<>();

    public void addMessage(String message) {
        messages.add(message);
        if (messages.size() > 50) {
            messages.remove(0);
        }
    }

    @GetMapping
    public List<String> getMessages() {
        return messages;
    }
}