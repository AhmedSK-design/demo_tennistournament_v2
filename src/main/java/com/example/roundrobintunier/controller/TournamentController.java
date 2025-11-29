package com.example.roundrobintunier.controller;

import com.example.roundrobintunier.dto.SolveRequest;
import com.example.roundrobintunier.model.Runde;
import com.example.roundrobintunier.solver.TournamentSolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tournament") // Basis-URL für diesen Controller
public class TournamentController {

    private final TournamentSolver solver;

    // Spring injiziert automatisch die Instanz deines Solvers
    @Autowired
    public TournamentController(TournamentSolver solver) {
        this.solver = solver;
    }

    /**
     * Der Endpunkt, den dein JavaScript-Frontend aufruft.
     * Nimmt JSON entgegen, gibt JSON zurück.
     */
    @PostMapping("/solve-round")
    public ResponseEntity<Runde> solveNextRound(@RequestBody SolveRequest request) {
        
        try {
            // Rufe deine bestehende Logik auf
            Runde ergebnis = solver.solveRunde(
                    request.getRundenNummer(),
                    request.getSpielerInRunde(),
                    request.isForceMixed()
            );

            // Prüfen, ob der Solver eine Lösung gefunden hat (null zurückgegeben)
            if (ergebnis == null) { 
                // Sende einen "422 Unprocessable Entity" Status, wenn keine Lösung gefunden wurde
                System.out.println("Controller: Solver fand keine Lösung.");
                return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(null);
            }

            // Sende "200 OK" mit der Runde als JSON-Body
            return ResponseEntity.ok(ergebnis);

        } catch (Exception e) {
            // Fange unerwartete Fehler ab
            System.err.println("Schwerer Fehler im Solver-Controller: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}