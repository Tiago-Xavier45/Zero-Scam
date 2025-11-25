package com.zeroscam.verificacao.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class WhoisService {

    @Value("${whois.api.key}")
    private String apiKey;

    @Value("${whois.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> consultarWhois(String dominio) {
        try {
            String url = apiUrl + "?apiKey=" + apiKey 
                       + "&domainName=" + dominio 
                       + "&outputFormat=JSON";

            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            return response;

        } catch (Exception e) {
            System.err.println("Erro ao consultar WHOIS: " + e.getMessage());
            return null;
        }
    }

    public String extrairPaisRegistro(Map<String, Object> whoisData) {
        try {
            Map<String, Object> whoisRecord = (Map<String, Object>) whoisData.get("WhoisRecord");
            Map<String, Object> registrant = (Map<String, Object>) whoisRecord.get("registrant");
            return (String) registrant.get("country");
        } catch (Exception e) {
            return "Desconhecido";
        }
    }

    public String extrairDataCriacao(Map<String, Object> whoisData) {
        try {
            Map<String, Object> whoisRecord = (Map<String, Object>) whoisData.get("WhoisRecord");
            return (String) whoisRecord.get("createdDate");
        } catch (Exception e) {
            return null;
        }
    }

    public String extrairRegistrante(Map<String, Object> whoisData) {
        try {
            Map<String, Object> whoisRecord = (Map<String, Object>) whoisData.get("WhoisRecord");
            Map<String, Object> registrant = (Map<String, Object>) whoisRecord.get("registrant");
            return (String) registrant.get("organization");
        } catch (Exception e) {
            return "Desconhecido";
        }
    }
}