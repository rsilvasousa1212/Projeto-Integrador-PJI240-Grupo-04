package com.epatrimonio.api.repository;

import com.epatrimonio.api.model.entity.Patrimonio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatrimonioRepository extends JpaRepository<Patrimonio, Long> {
}
