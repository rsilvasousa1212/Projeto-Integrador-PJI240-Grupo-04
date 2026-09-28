package com.epatrimonio.api.repository;

import com.epatrimonio.api.model.entity.Sala;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalaRepository extends JpaRepository<Sala, Long> {
}
