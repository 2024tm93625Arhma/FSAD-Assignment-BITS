package com.auth.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auth.entity.Equipment;
import com.auth.service.EquipmentService;

@RestController
@RequestMapping("/api/equipment")
@CrossOrigin(origins = "http://localhost:3000")
public class EquipmentController {
    @Autowired private EquipmentService equipmentService;

    @GetMapping
    public List<Equipment> list() { return equipmentService.listAll(); }

    @GetMapping("/{id}")
    public Equipment get(@PathVariable Long id) {
        return equipmentService.getById(id)
            .orElseThrow(() -> new RuntimeException("Equipment not found with id: " + id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // only admins add equipment
    public ResponseEntity<Equipment> create(@RequestBody Equipment e) {
        return ResponseEntity.status(HttpStatus.CREATED).body(equipmentService.create(e));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Equipment update(@PathVariable Long id, @RequestBody Equipment e) { return equipmentService.update(id, e); }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) { equipmentService.delete(id); return ResponseEntity.noContent().build(); }
}

