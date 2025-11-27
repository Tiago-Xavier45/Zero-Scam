package com.zeroscam.denuncia.controller;

import com.zeroscam.denuncia.model.Denuncia;
import com.zeroscam.denuncia.service.DenunciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/denuncias")
public class DenunciaController {

    @Autowired
    private DenunciaService denunciaService;

    @GetMapping
    public ResponseEntity<List<Denuncia>> listarTodas() {
        return ResponseEntity.ok(denunciaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Denuncia> buscarPorId(@PathVariable String id) {
        return denunciaService.buscarPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/canal/{canal}")
    public ResponseEntity<List<Denuncia>> buscarPorCanal(@PathVariable String canal) {
        return ResponseEntity.ok(denunciaService.buscarPorCanal(canal));
    }

    @GetMapping("/link")
    public ResponseEntity<List<Denuncia>> buscarPorLink(@RequestParam String link) {
        return ResponseEntity.ok(denunciaService.buscarPorLink(link));
    }

    @GetMapping("/suspeitas")
    public ResponseEntity<List<Denuncia>> buscarSuspeitas() {
        return ResponseEntity.ok(denunciaService.buscarSuspeitas());
    }

    @PostMapping
    public ResponseEntity<Denuncia> criar(@RequestBody Denuncia denuncia) {
        Denuncia novaDenuncia = denunciaService.criar(denuncia);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaDenuncia);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Denuncia> atualizar(
            @PathVariable String id,
            @RequestBody Denuncia denuncia) {
        try {
            Denuncia denunciaAtualizada = denunciaService.atualizar(id, denuncia);
            return ResponseEntity.ok(denunciaAtualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable String id) {
        denunciaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}