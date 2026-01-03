package com.example.roundrobintunier.service;

import com.example.roundrobintunier.dto.TurnierRequest;
import com.example.roundrobintunier.model.*;
import com.example.roundrobintunier.solver.TournamentSolver;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TurnierService {

    private final TournamentSolver solver;

    public TurnierService(TournamentSolver solver) {
        this.solver = solver;
    }

    public Turnier berechneTurnierplan(TurnierRequest request) {
        // 1. DTOs in echte Model-Objekte umwandeln
        List<Spieler> spielerListe = request.getSpielerListe().stream()
                .map(dto -> new Spieler(
                        dto.getName(), 
                        dto.getGeschlecht(), 
                        dto.getSpielstaerke()
                ))
                .collect(Collectors.toList());

        int runden = request.getAnzahlRunden();
        int plaetze = request.getAnzahlPlaetze();
        boolean forceMixed = request.isForceMixed();

        // 2. Logik wie gehabt
        PausenManager pm = new PausenManager(spielerListe, runden, plaetze);
        List<List<Spieler>> rundenPlan = pm.planeRunden();

        Turnier turnier = new Turnier(spielerListe, plaetze, runden);

        for (int i = 0; i < rundenPlan.size(); i++) {
            List<Spieler> spielerInRunde = rundenPlan.get(i);

            // Mixed-Check (optional hier oder im Solver)
            if (forceMixed) {
                long m = spielerInRunde.stream().filter(s -> "M".equalsIgnoreCase(s.getGeschlecht())).count();
                long w = spielerInRunde.stream().filter(s -> "F".equalsIgnoreCase(s.getGeschlecht()) || "W".equalsIgnoreCase(s.getGeschlecht())).count();
                if (m != w) throw new RuntimeException("Runde " + (i+1) + ": Mixed erzwungen, aber ungleiche Anzahl M/W.");
            }

            Runde optimierteRunde = solver.solveRunde(i + 1, spielerInRunde, forceMixed);
            if (optimierteRunde != null) {
                List<Spieler> pauseInDieserRunde = pm.getPausenProRunde().get(i);
                optimierteRunde.setPausierendeSpieler(pauseInDieserRunde);
        
                turnier.getRunden().add(optimierteRunde);
            }
             else {
                throw new RuntimeException("Keine Lösung für Runde " + (i + 1));
            }
        }

        // Das Turnier-Objekt wird von Spring automatisch als JSON serialisiert zurückgegeben
        return turnier;
    }
}