package com.auth.repository;

import com.auth.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface NotificationRepository extends JpaRepository<Notification, Long> {
  List<Notification> findByReadFlagFalse();
}
