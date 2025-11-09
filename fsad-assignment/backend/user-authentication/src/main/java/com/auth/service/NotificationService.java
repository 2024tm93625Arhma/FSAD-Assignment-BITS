package com.auth.service;

import com.auth.entity.Notification;
import com.auth.dto.NotificationDTO;
import com.auth.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
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
