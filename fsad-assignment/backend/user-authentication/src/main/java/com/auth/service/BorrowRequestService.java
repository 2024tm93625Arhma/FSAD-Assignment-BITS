package com.auth.service;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.auth.entity.BorrowRequest;
import com.auth.entity.BorrowStatus;
import com.auth.entity.Equipment;
import com.auth.repository.BorrowRequestRepository;
import com.auth.repository.EquipmentRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class BorrowRequestService {
    @Autowired private BorrowRequestRepository brRepo;
    @Autowired private EquipmentRepository equipmentRepo;

    // create request
    public BorrowRequest createRequest(Long userId, Long equipmentId, Integer qty, LocalDate start, LocalDate end) {
        if (start.isAfter(end)) throw new IllegalArgumentException("Invalid dates");
        Equipment eq = equipmentRepo.findById(equipmentId).orElseThrow(() -> new EntityNotFoundException("Equipment not found"));

        BorrowRequest br = new BorrowRequest();
        br.setUserId(userId);
        br.setEquipment(eq);
        br.setQuantityRequested(qty);
        br.setStartDate(start);
        br.setEndDate(end);
        br.setStatus(BorrowStatus.PENDING);
        return brRepo.save(br);
    }

    // approve request (check availability across overlapping approved/issued)
    @Transactional
    public BorrowRequest approveRequest(Long requestId, Long approverId, String adminComment) {
        BorrowRequest br = brRepo.findById(requestId).orElseThrow(() -> new EntityNotFoundException("Request not found"));
        if (br.getStatus() != BorrowStatus.PENDING) throw new IllegalStateException("Only pending requests can be approved");

        Equipment eq = br.getEquipment();
        // sum existing overlapping approved/issued quantities
        Integer already = brRepo.sumOverlappingQuantities(eq.getId(), br.getStartDate(), br.getEndDate());
        int willUse = (already == null ? 0 : already) + br.getQuantityRequested();
        if (willUse > eq.getTotalQuantity()) {
            throw new IllegalStateException("Not enough items available for the requested date range");
        }

        br.setStatus(BorrowStatus.APPROVED);
        br.setAdminComment(adminComment);
        br.setUpdatedAt(Instant.now());
        return brRepo.save(br);
    }

 // issue: mark issued and decrement availableQuantity (for immediate issuance)
    @Transactional
    public BorrowRequest issue(Long requestId, Long issuerId) {
        BorrowRequest br = brRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Borrow request not found with id: " + requestId));

        // Only approved requests can be issued
        if (br.getStatus() != BorrowStatus.APPROVED) {
            throw new IllegalStateException("Only approved requests can be issued");
        }

        Equipment eq = br.getEquipment();

        // Check availability
        if (eq.getAvailableQuantity() < br.getQuantityRequested()) {
            throw new IllegalStateException("Not enough available items to issue now");
        }

        // Decrease available quantity
        eq.setAvailableQuantity(eq.getAvailableQuantity() - br.getQuantityRequested());
        equipmentRepo.save(eq);

        // Update borrow request status
        br.setStatus(BorrowStatus.ISSUED);
        br.setUpdatedAt(Instant.now());
        br.setAdminComment("Issued by user ID: " + issuerId);

        return brRepo.save(br);
    }


    // return: mark returned and increment availableQuantity
    @Transactional
    public BorrowRequest markReturned(Long requestId) {
    	BorrowRequest br = brRepo.findById(requestId)
    	        .orElseThrow(() -> new RuntimeException("Borrow request not found with id: " + requestId));

        if (br.getStatus() != BorrowStatus.ISSUED) throw new IllegalStateException("Only issued requests can be returned");
        Equipment eq = br.getEquipment();
        eq.setAvailableQuantity(eq.getAvailableQuantity() + br.getQuantityRequested());
        equipmentRepo.save(eq);

        br.setStatus(BorrowStatus.RETURNED);
        br.setUpdatedAt(Instant.now());
        return brRepo.save(br);
    }
 // reject: mark request as REJECTED and add admin comment
    @Transactional
    public BorrowRequest reject(Long requestId, String comment) {
        BorrowRequest br = brRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Borrow request not found with id: " + requestId));

        // Only pending or approved requests can be rejected
        if (br.getStatus() != BorrowStatus.PENDING && br.getStatus() != BorrowStatus.APPROVED) {
            throw new IllegalStateException("Only pending or approved requests can be rejected");
        }

        // Update status and comment
        br.setStatus(BorrowStatus.REJECTED);
        br.setAdminComment(comment != null ? comment : "Rejected by admin");
        br.setUpdatedAt(Instant.now());

        return brRepo.save(br);
    }

	public List<BorrowRequest> getRequestsByUser(Long userId) {
		
		 return brRepo.findByUserId(userId);
	}
}
