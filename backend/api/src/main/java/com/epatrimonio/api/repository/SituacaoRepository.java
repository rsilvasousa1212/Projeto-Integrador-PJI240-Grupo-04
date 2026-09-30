package com.epatrimonio.api.repository;

import com.epatrimonio.api.model.entity.Situacao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SituacaoRepository extends JpaRepository<Situacao, Long> {
}
