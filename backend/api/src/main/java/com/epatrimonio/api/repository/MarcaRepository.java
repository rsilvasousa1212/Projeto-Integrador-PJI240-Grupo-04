package com.epatrimonio.api.repository;

import com.epatrimonio.api.model.entity.Marca;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MarcaRepository extends JpaRepository<Marca, Long> {
}
