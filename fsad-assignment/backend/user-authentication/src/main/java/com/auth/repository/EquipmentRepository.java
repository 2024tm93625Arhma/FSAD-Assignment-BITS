package com.auth.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.auth.entity.Equipment;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
    Optional<Equipment> findByNameIgnoreCase(String name);
}
