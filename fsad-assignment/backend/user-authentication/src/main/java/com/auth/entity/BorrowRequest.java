package com.auth.entity;


import java.time.Instant;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "borrow_request")
public class BorrowRequest {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // link to your User entity id (not mapping here to keep simple)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_id")
    private Equipment equipment;

    private Integer quantityRequested;
    private LocalDate startDate;
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    private BorrowStatus status = BorrowStatus.PENDING;

    private Instant createdAt = Instant.now();
    private Instant updatedAt;

    private String adminComment;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Equipment getEquipment() {
		return equipment;
	}

	public void setEquipment(Equipment equipment) {
		this.equipment = equipment;
	}

	public Integer getQuantityRequested() {
		return quantityRequested;
	}

	public void setQuantityRequested(Integer quantityRequested) {
		this.quantityRequested = quantityRequested;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}

	public LocalDate getEndDate() {
		return endDate;
	}

	public void setEndDate(LocalDate endDate) {
		this.endDate = endDate;
	}

	public BorrowStatus getStatus() {
		return status;
	}

	public void setStatus(BorrowStatus status) {
		this.status = status;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Instant createdAt) {
		this.createdAt = createdAt;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(Instant updatedAt) {
		this.updatedAt = updatedAt;
	}

	public String getAdminComment() {
		return adminComment;
	}

	public void setAdminComment(String adminComment) {
		this.adminComment = adminComment;
	}



}
