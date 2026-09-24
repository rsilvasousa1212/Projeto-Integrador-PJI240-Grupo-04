package com.epatrimonio.api.dataprovider.database.repository;

import com.epatrimonio.api.dataprovider.database.entity.PermissaoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringPermissaoRepository extends JpaRepository<PermissaoEntity, Long> {
}