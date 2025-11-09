package com.auth.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name="notifications")
public class Notification {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long id;
  private Long loanId;
  private String message;
  private LocalDateTime createdAt;
  private boolean readFlag=false;
public Long getId() {
	return id;
}
public void setId(Long id) {
	this.id = id;
}
public Long getLoanId() {
	return loanId;
}
public void setLoanId(Long loanId) {
	this.loanId = loanId;
}
public String getMessage() {
	return message;
}
public void setMessage(String message) {
	this.message = message;
}
public LocalDateTime getCreatedAt() {
	return createdAt;
}
public void setCreatedAt(LocalDateTime createdAt) {
	this.createdAt = createdAt;
}
public boolean isReadFlag() {
	return readFlag;
}
public void setReadFlag(boolean readFlag) {
	this.readFlag = readFlag;
}
  
  
}