package com.example.roundrobintunier.service;

import com.example.roundrobintunier.dto.TurnierRequest; // DTO
import com.example.roundrobintunier.model.PausenManager;
import com.example.roundrobintunier.model.Runde;
import com.example.roundrobintunier.model.Spieler;
import com.example.roundrobintunier.model.Turnier;
import com.example.roundrobintunier.solver.TournamentSolver;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TurnierService {

    private final TournamentSolver solver;

    // Konstruktor-Injektion: Spring reicht hier die @Component-Instanz des Solvers rein
    public TurnierService(TournamentSolver solver) {
        this.solver = solver;
    }

    public Turnier berechneTurnierplan(TurnierRequest request) {
        // 1. Daten aus dem Request extrahieren
        List<Spieler> spielerListe = request.getSpielerListe();
        int runden = request.getAnzahlRunden();
        int plaetze = request.getAnzahlPlaetze();
        boolean forceMixed = request.isForceMixed();

        // 2. Statistiken der Spieler zurücksetzen (wichtig, falls Objekte aus einem Cache kommen oder wiederverwendet werden)
        spielerListe.forEach(Spieler::resetStats);

        // 3. PausenManager initialisieren (lokal, da er spezifisch für diesen Request ist)
        PausenManager pm = new PausenManager(spielerListe, runden, plaetze);
        
        // 4. Runden vorplanen (wer spielt in welcher Runde, wer pausiert)
        List<List<Spieler>> rundenPlan = pm.planeRunden();

        // 5. Turnier-Objekt erstellen
        Turnier turnier = new Turnier(spielerListe, plaetze, runden);

        // 6. Für jede Runde die optimalen Paarungen finden
        for (int i = 0; i < rundenPlan.size(); i++) {
            List<Spieler> spielerInRunde = rundenPlan.get(i);

            // Validierung für Mixed-Modus (wenn erzwungen)
            if (forceMixed) {
                long maleCount = spielerInRunde.stream()
                        .filter(s -> "M".equalsIgnoreCase(s.getGeschlecht())) // Robustere Prüfung (Groß/Klein)
                        .count();
                long femaleCount = spielerInRunde.stream()
                        .filter(s -> "F".equalsIgnoreCase(s.getGeschlecht()))
                        .count();
                
                if (maleCount != femaleCount) {
                    throw new IllegalArgumentException("Fehler in Runde " + (i + 1) + ": Für den Mixed-Modus muss die Anzahl der männlichen (" + maleCount + ") und weiblichen (" + femaleCount + ") Spieler in der Runde gleich sein.");
                }
            }

            // Den injizierten Solver nutzen
            // i + 1, da Runden im UI meist bei 1 starten, der Index aber bei 0
            Runde optimierteRunde = solver.solveRunde(i + 1, spielerInRunde, forceMixed);
            
            if (optimierteRunde != null) {
                turnier.getRunden().add(optimierteRunde);
            } else {
                throw new RuntimeException("Der Solver konnte für Runde " + (i + 1) + " keine gültige Lösung finden.");
            }
        }

        return turnier;
    }
}