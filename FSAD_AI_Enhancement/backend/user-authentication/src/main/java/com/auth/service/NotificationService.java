package com.auth.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.auth.dto.NotificationDTO;
import com.auth.repository.NotificationRepository;
@Service
public class NotificationService {
  private final NotificationRepository notificationRepository;
  public NotificationService(NotificationRepository notificationRepository) {
    this.notificationRepository = notificationRepository;
  }
  public List<NotificationDTO> getUnreadNotifications() {
    return notificationRepository.findByReadFlagFalse()
            .stream()
            .map(n -> new NotificationDTO(n.getId(), n.getMessage(), n.getCreatedAt()))
            .collect(Collectors.toList());
  }
}