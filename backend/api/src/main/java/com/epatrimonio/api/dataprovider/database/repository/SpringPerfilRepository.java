package com.epatrimonio.api.dataprovider.database.repository;

import com.epatrimonio.api.dataprovider.database.entity.PerfilEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringPerfilRepository extends JpaRepository<PerfilEntity, Long> {
}