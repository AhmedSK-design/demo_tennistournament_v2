package com.example.roundrobintunier.model;

import java.util.ArrayList;
import java.util.List;

public class Turnier {
    private List<Spieler> spielerListe;
    private int anzahlPlaetze;
    private int rundenAnzahl;
    private List<Runde> runden = new ArrayList<>();

    public Turnier(List<Spieler> spielerListe, int anzahlPlaetze, int rundenAnzahl) {
        this.spielerListe = spielerListe;
        this.anzahlPlaetze = anzahlPlaetze;
        this.rundenAnzahl = rundenAnzahl;
    }

    // Getter für JSON
    public List<Runde> getRunden() { return runden; }
    // Optional: Wenn du die Spielerliste im Resultat nicht brauchst, kannst du @JsonIgnore hier setzen
    public List<Spieler> getSpielerListe() { return spielerListe; }
}