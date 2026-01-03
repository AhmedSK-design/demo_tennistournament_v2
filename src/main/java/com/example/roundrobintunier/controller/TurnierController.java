package com.example.roundrobintunier.controller;

import com.example.roundrobintunier.model.*;
import com.example.roundrobintunier.dto.TurnierRequest;
import com.example.roundrobintunier.dto.TurnierSetupDTO;
import com.example.roundrobintunier.service.TurnierService;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.example.roundrobintunier.service.ExcelService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/turnier")
public class TurnierController {

    
    private TurnierService turnierService;
    
    private final ExcelService excelService;

    public TurnierController(TurnierService turnierService, ExcelService excelService) {
        this.turnierService = turnierService;
        this.excelService = excelService;
    }

    @PostMapping("/berechnen")
    public ResponseEntity<?> erstellePlan(@RequestBody TurnierRequest request) {
        try {
            Turnier ergebnis = turnierService.berechneTurnierplan(request);
            return ResponseEntity.ok(ergebnis);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Ein unerwarteter Fehler ist aufgetreten: " + e.getMessage());
        }
    }

    @PostMapping("/import")
    public ResponseEntity<?> importExcel(@RequestParam("file") MultipartFile file) {
        try {
            TurnierSetupDTO setup = excelService.importTurnierSetup(file);
            return ResponseEntity.ok(setup);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Fehler beim Import: " + e.getMessage());
        }
    }

    @PostMapping("/export")
    public ResponseEntity<byte[]> exportExcel(@RequestBody TurnierSetupDTO setupDTO) {
        try {
            byte[] excelContent = excelService.exportTurnierToExcel(setupDTO);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=turnier_setup.xlsx")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(excelContent);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}