package com.example.roundrobintunier.controller;

import com.example.roundrobintunier.dto.PlayerRequestDTO;
import com.example.roundrobintunier.dto.SolveRequest;
import com.example.roundrobintunier.model.Runde;
import com.example.roundrobintunier.model.Spieler;
import com.example.roundrobintunier.solver.TournamentSolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/tournament")
public class TournamentController {

    private final TournamentSolver solver;

    @Autowired
    public TournamentController(TournamentSolver solver) {
        this.solver = solver;
    }

    /**
     * Der Endpunkt, den dein JavaScript-Frontend aufruft.
     */
    @PostMapping("/solve-round")
    public ResponseEntity<Runde> solveNextRound(@RequestBody SolveRequest request) {

        // 1. DTOs in Domain-Objekte (Spieler) umwandeln
        List<Spieler> spielerInRunde = new ArrayList<>();
        
        // **WICHTIGE KORREKTUR:** Wir iterieren über request.getSpielerDetails()
        for (PlayerRequestDTO dto : request.getSpielerDetails()) { 
            spielerInRunde.add(new Spieler(
                    dto.getName(),
                    dto.getGeschlecht(),
                    dto.getSpielstaerke()
            ));
        }

        try {
            // 2. Solver mit der erstellten Liste aufrufen
            // **WICHTIGE KORREKTUR:** Übergabe der lokalen Liste 'spielerInRunde'
            Runde ergebnis = solver.solveRunde(
                    request.getRundenNummer(),
                    spielerInRunde, 
                    request.isForceMixed()
            );

            if (ergebnis == null) { 
                System.out.println("Controller: Solver fand keine Lösung.");
                return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(null);
            }

            return ResponseEntity.ok(ergebnis);

        } catch (Exception e) {
            System.err.println("Schwerer Fehler im Solver-Controller: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}