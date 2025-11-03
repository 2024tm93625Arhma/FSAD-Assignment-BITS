package com.auth.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.auth.entity.BorrowRequest;

public interface BorrowRequestRepository extends JpaRepository<BorrowRequest, Long> {

    @Query("""
      SELECT COALESCE(SUM(br.quantityRequested), 0) 
      FROM BorrowRequest br 
      WHERE br.equipment.id = :equipmentId
        AND br.status IN ('APPROVED','ISSUED')
        AND NOT (br.endDate < :startDate OR br.startDate > :endDate)
      """)
    Integer sumOverlappingQuantities(@Param("equipmentId") Long equipmentId,
                                     @Param("startDate") LocalDate startDate,
                                     @Param("endDate") LocalDate endDate);

    // 🔹 Add this method
    List<BorrowRequest> findByUserId(Long userId);
}
