package com.epatrimonio.api.repository;

import com.epatrimonio.api.model.entity.Modelo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ModeloRepository extends JpaRepository<Modelo, Long> {
}
