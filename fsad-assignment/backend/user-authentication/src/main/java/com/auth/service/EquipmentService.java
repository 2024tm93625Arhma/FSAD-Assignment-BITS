package com.auth.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.auth.entity.Equipment;
import com.auth.repository.EquipmentRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional; // Make sure this is imported

@Service
public class EquipmentService {
    @Autowired
    private EquipmentRepository equipmentRepository;

    @Transactional // Add @Transactional
    public Equipment create(Equipment e) {
        // Ensure totalQuantity and availableQuantity are not null
        Integer total = (e.getTotalQuantity() != null) ? e.getTotalQuantity() : 0;
        
        e.setTotalQuantity(total);
        e.setAvailableQuantity(total); // Set available to the new total
        
        return equipmentRepository.save(e);
    }

    @Transactional // Add @Transactional
    public Equipment update(Long id, Equipment incoming) {
        Equipment e = equipmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Equipment not found"));
        
        // Get old and new values, providing 0 as a default if they are null
        Integer oldTotal = (e.getTotalQuantity() != null) ? e.getTotalQuantity() : 0;
        Integer currentAvailable = (e.getAvailableQuantity() != null) ? e.getAvailableQuantity() : 0;
        Integer newTotal = (incoming.getTotalQuantity() != null) ? incoming.getTotalQuantity() : 0;

        // Calculate the change in total stock
        int changeInTotal = newTotal - oldTotal;
        
        // Apply the change to the available stock
        int newAvailable = Math.max(0, currentAvailable + changeInTotal);
        // Ensure available stock doesn't go above the new total
        newAvailable = Math.min(newAvailable, newTotal);

        e.setAvailableQuantity(newAvailable);

        // Now update the rest of the fields
        e.setName(incoming.getName());
        e.setCategory(incoming.getCategory());
        e.setConditionDescription(incoming.getConditionDescription());
        e.setTotalQuantity(newTotal); // Set the new total
        e.setDescription(incoming.getDescription());
        
        return equipmentRepository.save(e);
    }

    public void delete(Long id) { equipmentRepository.deleteById(id); }
    public Optional<Equipment> getById(Long id) { return equipmentRepository.findById(id); }
    public List<Equipment> listAll() { return equipmentRepository.findAll(); }
}