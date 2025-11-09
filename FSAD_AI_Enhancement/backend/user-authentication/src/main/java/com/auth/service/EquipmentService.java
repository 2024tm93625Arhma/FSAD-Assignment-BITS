package com.auth.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.auth.entity.Equipment;
import com.auth.exception.InvalidRequestException;
import com.auth.exception.ResourceNotFoundException;
import com.auth.repository.EquipmentRepository;
import com.auth.repository.BorrowRequestRepository;

import jakarta.transaction.Transactional;

@Service
public class EquipmentService {

    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private BorrowRequestRepository borrowRequestRepository; // ✅ added

    @Transactional
    public Equipment create(Equipment e) {
        if (e == null) {
            throw new InvalidRequestException("Equipment payload is missing.");
        }
        if (e.getName() == null || e.getName().trim().isEmpty()) {
            throw new InvalidRequestException("Equipment name is required.");
        }

        Integer total = (e.getTotalQuantity() != null) ? e.getTotalQuantity() : 0;
        if (total < 0) {
            throw new InvalidRequestException("totalQuantity must be >= 0.");
        }
        e.setTotalQuantity(total);

        Integer providedAvailable = e.getAvailableQuantity();
        int available = (providedAvailable != null) ? providedAvailable : total;
        available = Math.max(0, Math.min(available, total));
        e.setAvailableQuantity(available);

        return equipmentRepository.save(e);
    }

    @Transactional
    public Equipment update(Long id, Equipment incoming) {
        if (id == null) {
            throw new InvalidRequestException("Equipment id is required for update.");
        }
        if (incoming == null) {
            throw new InvalidRequestException("Incoming equipment data is missing.");
        }

        Equipment e = equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment with id " + id + " not found."));

        Integer oldTotal = (e.getTotalQuantity() != null) ? e.getTotalQuantity() : 0;
        Integer currentAvailable = (e.getAvailableQuantity() != null) ? e.getAvailableQuantity() : 0;
        Integer newTotal = (incoming.getTotalQuantity() != null) ? incoming.getTotalQuantity() : oldTotal;

        if (newTotal < 0) {
            throw new InvalidRequestException("totalQuantity must be >= 0.");
        }

        int changeInTotal = newTotal - oldTotal;
        int newAvailable = currentAvailable + changeInTotal;
        newAvailable = Math.max(0, Math.min(newAvailable, newTotal));
        e.setAvailableQuantity(newAvailable);

        if (incoming.getName() != null) e.setName(incoming.getName());
        if (incoming.getCategory() != null) e.setCategory(incoming.getCategory());
        if (incoming.getConditionDescription() != null) e.setConditionDescription(incoming.getConditionDescription());
        if (incoming.getDescription() != null) e.setDescription(incoming.getDescription());

        e.setTotalQuantity(newTotal);

        return equipmentRepository.save(e);
    }

    // ✅ Updated delete() method
    @Transactional
    public void delete(Long id) {
        if (id == null) {
            throw new InvalidRequestException("Equipment id is required for deletion.");
        }

        if (!equipmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cannot delete: equipment with id " + id + " does not exist.");
        }

        // ✅ Prevent deletion if linked borrow requests exist
        boolean hasBorrowRequests = borrowRequestRepository.existsByEquipmentId(id);
        if (hasBorrowRequests) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Cannot delete this equipment — it is linked to existing borrow or issue records."
            );
        }

        try {
            equipmentRepository.deleteById(id);
        } catch (DataIntegrityViolationException ex) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Cannot delete equipment due to related records in borrow history."
            );
        }
    }

    public Optional<Equipment> getById(Long id) {
        if (id == null) {
            throw new InvalidRequestException("Equipment id is required.");
        }
        return equipmentRepository.findById(id);
    }

    public List<Equipment> listAll() {
        return equipmentRepository.findAll();
    }
}
