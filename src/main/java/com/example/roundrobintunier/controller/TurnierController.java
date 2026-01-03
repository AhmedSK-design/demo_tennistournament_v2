package com.example.roundrobintunier.controller;

import com.example.roundrobintunier.model.*;
import com.example.roundrobintunier.dto.TurnierRequest;
import com.example.roundrobintunier.service.TurnierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/turnier")
public class TurnierController {

    @Autowired
    private TurnierService turnierService;

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
}