package com.zeroscam.verificacao.service;

import com.zeroscam.verificacao.model.Verificacao;
import com.zeroscam.verificacao.client.DenunciaFeignClient;
import com.zeroscam.verificacao.repository.VerificacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class VerificacaoService {

    @Autowired
    private VerificacaoRepository verificacaoRepository;

    @Autowired
    private WhoisService whoisService;

    @Autowired
    private DenunciaFeignClient denunciaClient;

    public List<Verificacao> listarTodas() {
        return verificacaoRepository.findAll();
    }

    public Optional<Verificacao> buscarPorId(String id) {
        return verificacaoRepository.findById(id);
    }

    public Optional<Verificacao> buscarPorLink(String link) {
        return verificacaoRepository.findByLink(link);
    }

    public List<Verificacao> buscarSuspeitos() {
        return verificacaoRepository.findBySuspeitoTrue();
    }

    public List<Verificacao> buscarPorScoreMinimo(Integer scoreMinimo) {
        return verificacaoRepository.findByScoreRiscoGreaterThanEqual(scoreMinimo);
    }

    public Verificacao verificarLink(String link) {
        Optional<Verificacao> existente = buscarPorLink(link);
        if (existente.isPresent()) {
            return existente.get();
        }

        Verificacao verificacao = new Verificacao();
        verificacao.setLink(link);
        verificacao.setDominio(extrairDominio(link));
        verificacao.setDataVerificacao(LocalDateTime.now());

        Map<String, Object> whoisData = whoisService.consultarWhois(verificacao.getDominio());
        if (whoisData != null) {
            verificacao.setPaisRegistro(whoisService.extrairPaisRegistro(whoisData));
        }

        int totalDenuncias = buscarTotalDenuncias(link);

        int score = calcularRisco(link, verificacao.getPaisRegistro(), totalDenuncias);
        verificacao.setScoreRisco(score);

        // 👉 SUSPEITO é true sempre que NÃO estiver no caso "parece seguro"
        // (score < 30 E totalDenuncias == 0)
        verificacao.setSuspeito(ehSuspeito(score, totalDenuncias));

        return verificacaoRepository.save(verificacao);
    }

    public Map<String, Object> verificarLinkCompleto(String link) {
        int totalDenuncias = buscarTotalDenuncias(link);
        double valorTotalPerdido = buscarValorTotalPerdido(link);

        Verificacao verificacao;
        Optional<Verificacao> existente = buscarPorLink(link);

        if (existente.isPresent()) {
            verificacao = existente.get();
        } else {
            verificacao = new Verificacao();
            verificacao.setLink(link);
            verificacao.setDominio(extrairDominio(link));
            verificacao.setDataVerificacao(LocalDateTime.now());

            Map<String, Object> whoisData = whoisService.consultarWhois(verificacao.getDominio());
            if (whoisData != null) {
                verificacao.setPaisRegistro(whoisService.extrairPaisRegistro(whoisData));
            }
        }

        int scoreAtualizado = calcularRisco(link, verificacao.getPaisRegistro(), totalDenuncias);
        verificacao.setScoreRisco(scoreAtualizado);

        // 👉 mesma regra aqui
        verificacao.setSuspeito(ehSuspeito(scoreAtualizado, totalDenuncias));

        verificacaoRepository.save(verificacao);

        Map<String, Object> resultado = new HashMap<>();
        resultado.put("id", verificacao.getId());
        resultado.put("link", verificacao.getLink());
        resultado.put("dominio", verificacao.getDominio());
        resultado.put("dominioRegistrado", verificacao.getDominio() != null);
        resultado.put("scoreRisco", scoreAtualizado);
        resultado.put("suspeito", verificacao.getSuspeito());
        resultado.put("paisRegistro", verificacao.getPaisRegistro() != null ? verificacao.getPaisRegistro() : "Não identificado");
        resultado.put("dataRegistro", verificacao.getDataVerificacao().toString());
        resultado.put("totalDenuncias", totalDenuncias);
        resultado.put("valorTotalPerdido", valorTotalPerdido);
        resultado.put("dicaSeguranca", gerarDicaSeguranca(scoreAtualizado, totalDenuncias));

        return resultado;
    }

    private double buscarValorTotalPerdido(String link) {
        try {
            List<Map<String, Object>> denuncias = denunciaClient.buscarPorLink(link);
            if (denuncias == null || denuncias.isEmpty()) {
                return 0.0;
            }

            double total = 0.0;
            for (Map<String, Object> denuncia : denuncias) {
                Object valor = denuncia.get("valorPerdido");
                if (valor != null && valor instanceof Number) {
                    total += ((Number) valor).doubleValue();
                }
            }
            return total;
        } catch (Exception e) {
            System.err.println("Erro ao buscar valor total perdido: " + e.getMessage());
            return 0.0;
        }
    }

    private String gerarDicaSeguranca(int scoreRisco, int totalDenuncias) {
        if (scoreRisco >= 70 || totalDenuncias >= 5) {
            return "Alerta vermelho! Este link apresenta alto risco de golpe. Evite acessá-lo e, se possível, denuncie.";
        } else if (scoreRisco >= 50 || totalDenuncias >= 2) {
            return "Atenção! Este link possui alguns sinais suspeitos. Tenha cautela ao acessá-lo.";
        } else if (scoreRisco >= 30 || totalDenuncias >= 1) {
            return "Este link apresenta alguns alertas. Verifique a autenticidade antes de fornecer dados.";
        } else {
            return "Este link parece seguro, mas sempre verifique a URL antes de inserir informações pessoais.";
        }
    }

    private int buscarTotalDenuncias(String link) {
        try {
            List<Map<String, Object>> denuncias = denunciaClient.buscarPorLink(link);
            return denuncias != null ? denuncias.size() : 0;
        } catch (Exception e) {
            System.err.println("Erro ao buscar denúncias: " + e.getMessage());
            e.printStackTrace();
            return 0;
        }
    }

    public Verificacao criar(Verificacao verificacao) {
        verificacao.setDataVerificacao(LocalDateTime.now());
        return verificacaoRepository.save(verificacao);
    }

    public Verificacao atualizar(String id, Verificacao verificacaoAtualizada) {
        return verificacaoRepository.findById(id)
                .map(verificacao -> {
                    verificacao.setLink(verificacaoAtualizada.getLink());
                    verificacao.setDominio(verificacaoAtualizada.getDominio());
                    verificacao.setScoreRisco(verificacaoAtualizada.getScoreRisco());
                    verificacao.setSuspeito(verificacaoAtualizada.getSuspeito());
                    verificacao.setPaisRegistro(verificacaoAtualizada.getPaisRegistro());
                    return verificacaoRepository.save(verificacao);
                })
                .orElseThrow(() -> new RuntimeException("Verificação não encontrada"));
    }

    public void deletar(String id) {
        verificacaoRepository.deleteById(id);
    }

    private String extrairDominio(String link) {
        try {
            String dominio = link.replace("https://", "").replace("http://", "");
            int barraIndex = dominio.indexOf("/");
            if (barraIndex > 0) {
                dominio = dominio.substring(0, barraIndex);
            }
            return dominio;
        } catch (Exception e) {
            return link;
        }
    }

    private Integer calcularRisco(String link, String paisRegistro, int totalDenuncias) {
        int risco = 0;

        // Sem HTTPS
        if (link.startsWith("http://")) {
            risco += 20;
        }

        // URL com IP
        if (link.matches(".*\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}.*")) {
            risco += 30;
        }

        // URL muito longa
        if (link.length() > 100) {
            risco += 15;
        }

        // Domínios gratuitos suspeitos
        String linkLower = link.toLowerCase();
        if (linkLower.contains(".tk") || linkLower.contains(".ml") ||
            linkLower.contains(".ga") || linkLower.contains(".cf")) {
            risco += 25;
        }

        // País de registro suspeito
        if (paisRegistro != null) {
            String paisLower = paisRegistro.toLowerCase();
            if (paisLower.contains("russia") || paisLower.contains("china") ||
                paisLower.contains("nigeria")) {
                risco += 15;
            }
        }

        // Risco baseado em denúncias (mantendo sua lógica)
        if (totalDenuncias >= 10) {
            risco += 40;
        } else if (totalDenuncias >= 5) {
            risco += 25;
        } else if (totalDenuncias >= 1) {
            risco += 10;
        }

        return Math.min(100, risco);
    }


private boolean ehSuspeito(int scoreRisco, int totalDenuncias) {
    // Seguro somente se: score < 30 e denúncias <= 1
    boolean seguro = scoreRisco < 30 && totalDenuncias <= 1;

    return !seguro; // suspeito = não seguro
}
}
