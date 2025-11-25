package com.zeroscam.denuncia.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;
@FeignClient(name = "denuncia-service", url = "http://localhost:8082")  
public interface DenunciaFeignClient {

    @GetMapping("/api/denuncias/link")
    List<Map<String, Object>> buscarPorLink(@RequestParam("link") String link);
}