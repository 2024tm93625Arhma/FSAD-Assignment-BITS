package com.auth.service;

import com.auth.entity.BorrowRequest;
import com.auth.entity.BorrowStatus;
import com.auth.entity.Notification;
import com.auth.repository.BorrowRequestRepository;
import com.auth.repository.NotificationRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OverdueCheckService {

  private final BorrowRequestRepository brRepo;
  private final NotificationRepository notificationRepository;

  public OverdueCheckService(BorrowRequestRepository brRepo, NotificationRepository notificationRepository) {
    this.brRepo = brRepo;
    this.notificationRepository = notificationRepository;
  }

  @Scheduled(cron="0 0 */6 * * *") // every 6 hours
  public void checkOverdues() {
    LocalDate today = LocalDate.now();
    // Custom query
    List<BorrowRequest> overdueRequests = brRepo.findByStatusAndOverdueFalseAndEndDateBefore(BorrowStatus.ISSUED, today);

    for (BorrowRequest br : overdueRequests) {
      br.setOverdue(true); 
      brRepo.save(br);

      Notification n = new Notification();
      n.setLoanId(br.getId()); // Use BorrowRequest ID
      n.setMessage("Equipment '" + br.getEquipment().getName() + "' is overdue since " + br.getEndDate());
      n.setCreatedAt(LocalDateTime.now());
      notificationRepository.save(n);
    }
  }

}