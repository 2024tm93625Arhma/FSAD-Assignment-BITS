package com.auth.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Data
@Entity
@Table(name="notifications")
public class Notification {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long id;
  private Long loanId;
  private String message;
  private LocalDateTime createdAt;
  private boolean readFlag=false;
}