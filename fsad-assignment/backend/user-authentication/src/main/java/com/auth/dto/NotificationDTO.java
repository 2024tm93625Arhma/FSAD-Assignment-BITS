package com.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;
@Data
@AllArgsConstructor
public class NotificationDTO {
  private Long id;
  private String message;
  private LocalDateTime createdAt;
}
