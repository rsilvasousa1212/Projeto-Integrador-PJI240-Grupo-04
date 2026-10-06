package com.epatrimonio.api.repository;

import com.epatrimonio.api.model.entity.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventarioRepository extends JpaRepository<Inventario, Long> {
}
