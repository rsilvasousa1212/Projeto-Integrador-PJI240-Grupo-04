package com.epatrimonio.api.repository;

import com.epatrimonio.api.model.entity.Permissao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermissaoRepository extends JpaRepository<Permissao, Long> {
}
