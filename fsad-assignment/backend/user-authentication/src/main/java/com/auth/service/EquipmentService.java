package com.auth.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.auth.entity.Equipment;
import com.auth.repository.EquipmentRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class EquipmentService {
    @Autowired
    private EquipmentRepository equipmentRepository;

    public Equipment create(Equipment e) {
        e.setAvailableQuantity(e.getTotalQuantity());
        return equipmentRepository.save(e);
    }

    public Equipment update(Long id, Equipment incoming) {
        Equipment e = equipmentRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Equipment not found"));
        e.setName(incoming.getName());
        e.setCategory(incoming.getCategory());
        e.setConditionDescription(incoming.getConditionDescription());
        e.setTotalQuantity(incoming.getTotalQuantity());
        // adjust availableQuantity if total changed (simple approach)
        e.setAvailableQuantity(Math.max(0, incoming.getTotalQuantity()));
        e.setDescription(incoming.getDescription());
        return equipmentRepository.save(e);
    }

    public void delete(Long id) { equipmentRepository.deleteById(id); }
    public Optional<Equipment> getById(Long id) { return equipmentRepository.findById(id); }
    public List<Equipment> listAll() { return equipmentRepository.findAll(); }
}
