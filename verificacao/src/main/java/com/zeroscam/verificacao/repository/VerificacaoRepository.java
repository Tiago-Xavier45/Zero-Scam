package com.zeroscam.verificacao.repository;

import com.zeroscam.verificacao.model.Verificacao;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VerificacaoRepository extends MongoRepository<Verificacao, String> {
    
    Optional<Verificacao> findByLink(String link);
    
    List<Verificacao> findByDominio(String dominio);
    
    List<Verificacao> findBySuspeitoTrue();
    
    List<Verificacao> findByScoreRiscoGreaterThanEqual(Integer scoreRisco);
    
    List<Verificacao> findByUsuarioId(String usuarioId);
    
    
    List<Verificacao> findByPaisRegistro(String paisRegistro);
}