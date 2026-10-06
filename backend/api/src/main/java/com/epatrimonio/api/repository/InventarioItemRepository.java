package com.epatrimonio.api.repository;

import com.epatrimonio.api.model.entity.InventarioItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventarioItemRepository extends JpaRepository<InventarioItem, Long> {
}
