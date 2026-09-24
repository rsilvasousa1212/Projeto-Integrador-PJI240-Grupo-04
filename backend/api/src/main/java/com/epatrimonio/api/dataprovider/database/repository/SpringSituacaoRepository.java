package com.epatrimonio.api.dataprovider.database.repository;

import com.epatrimonio.api.dataprovider.database.entity.SituacaoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringSituacaoRepository extends JpaRepository<SituacaoEntity, Long> {
}