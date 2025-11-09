package com.auth.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.auth.dto.ApproveRequestDto;
import com.auth.dto.BorrowRequestDto;
import com.auth.entity.BorrowRequest;
import com.auth.service.BorrowRequestService;

@RestController
@RequestMapping("/api/borrow")
public class BorrowRequestController {

    @Autowired
    private BorrowRequestService service;

    // ✅ Create a borrow request
    @PostMapping("/request")
    @PreAuthorize("hasAnyRole('STUDENT','STAFF')")
    public ResponseEntity<BorrowRequest> request(@RequestBody BorrowRequestDto dto, Authentication auth) {
        Long userId = getUserIdFromAuth(auth); // extract userId from JWT authentication
        BorrowRequest br = service.createRequest(userId, dto.getEquipmentId(), dto.getQuantity(), dto.getStartDate(), dto.getEndDate());
        return ResponseEntity.status(HttpStatus.CREATED).body(br);
    }

    // ✅ Get all borrow requests of the logged-in user
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('STUDENT','STAFF')")
    public List<BorrowRequest> myRequests(Authentication auth) {
        Long userId = getUserIdFromAuth(auth);
        return service.getRequestsByUser(userId);
    }

    // ✅ Approve request (ADMIN or STAFF)
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    public BorrowRequest approve(@PathVariable Long id, @RequestBody ApproveRequestDto dto, Authentication auth) {
        Long approverId = getUserIdFromAuth(auth);
        return service.approveRequest(id, approverId, dto.getComment());
    }

    // ✅ Issue equipment (ADMIN or STAFF)
    @PutMapping("/{id}/issue")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    public BorrowRequest issue(@PathVariable Long id, Authentication auth) {
        Long issuerId = getUserIdFromAuth(auth);
        return service.issue(id, issuerId);
    }

    // ✅ Mark as returned (ADMIN or STAFF)
    @PutMapping("/{id}/return")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    public BorrowRequest markReturn(@PathVariable Long id) {
        return service.markReturned(id);
    }

    // ✅ Reject request (ADMIN or STAFF)
    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    public BorrowRequest reject(@PathVariable Long id, @RequestBody ApproveRequestDto dto) {
        return service.reject(id, dto.getComment());
    }

    /**
     * [GET] /api/borrow/pending
     * Gets all pending requests. (Admin/Staff action)
     */
    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public List<BorrowRequest> pendingRequests() {
        return service.getPendingRequests();
    }

    /**
     * [GET] /api/borrow/issued
     * Gets all issued, non-returned requests. (Admin/Staff action)
     */
    @GetMapping("/issued")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')") 
    public List<BorrowRequest> issuedRequests() {
        return service.getIssuedRequests();
    }


    // ✅ Utility method — extract userId from Authentication
  
    private Long getUserIdFromAuth(Authentication auth) {
        Object principal = auth.getPrincipal();

        if (principal instanceof com.auth.security.CustomUserDetails userDetails) {
            return userDetails.getId();
        }

        throw new RuntimeException("Unable to extract user ID from authentication");
    }

}