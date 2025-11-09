package com.auth.controller;

import com.auth.dto.NotificationDTO;
import com.auth.service.NotificationService;
import com.auth.service.OverdueCheckService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
  private final NotificationService notificationService;
  public NotificationController(NotificationService notificationService) {
    this.notificationService = notificationService;
  }
  @GetMapping("/overdue")
  public ResponseEntity<List<NotificationDTO>> getOverdueNotifications() {
    return ResponseEntity.ok(notificationService.getUnreadNotifications());
  }

@Autowired
private OverdueCheckService overdueCheckService;

// This is a test endpoint to trigger notifications, for testing through Postman.
@GetMapping("/runcheck")
public ResponseEntity<String> runOverdueCheck() {
    overdueCheckService.checkOverdues();
    return ResponseEntity.ok("Overdue check triggered!");
}
}