package com.example.roundrobintunier.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.ArrayList;
import java.util.List;

public class Spieler {
    // ... (vorherige Felder wie id, name, geschlecht, spielstaerke) ...
    private static int idCounter = 1;
    private int id;
    private String name;
    private String geschlecht;
    private int spielstaerke;

    // --- NEU: Felder für den PausenManager ---
    // Wir senden diese Infos mit (@JsonIgnore weglassen), 
    // falls du im Frontend eine Tabelle mit "Anzahl Spiele" anzeigen willst.
    private int pausenAnzahl = 0;
    private int anzahlSpiele = 0;

    @JsonIgnore
    private List<Spieler> partnerHistorie = new ArrayList<>();
    @JsonIgnore
    private List<Spieler> gegnerHistorie = new ArrayList<>();

    public Spieler() {}

    public Spieler(String name, String geschlecht, int spielstaerke) {
        this.id = idCounter++;
        this.name = name;
        this.geschlecht = geschlecht;
        this.spielstaerke = spielstaerke;
    }

    public void resetStats() {
        this.partnerHistorie.clear();
        this.gegnerHistorie.clear();
        this.pausenAnzahl = 0;
        this.anzahlSpiele = 0;
    }

    // --- Methoden für den PausenManager ---
    public void erhoehePausenAnzahl() {
        this.pausenAnzahl++;
    }

    public void incrementSpielAnzahl() {
        this.anzahlSpiele++;
    }

    public int getPausenAnzahl() {
        return pausenAnzahl;
    }

    public int getAnzahlSpiele() {
        return anzahlSpiele;
    }

    // ... (vorherige Getter/Setter/Add Methoden) ...
    public void addGegner(Spieler g) { gegnerHistorie.add(g); }
    public List<Spieler> getPartnerHistorie() { return partnerHistorie; }
    public List<Spieler> getGegnerHistorie() { return gegnerHistorie; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getGeschlecht() { return geschlecht; }
    public void setGeschlecht(String geschlecht) { this.geschlecht = geschlecht; }
    public int getSpielstaerke() { return spielstaerke; }
    public void setSpielstaerke(int spielstaerke) { this.spielstaerke = spielstaerke; }
    public int getId() { return id; } // ID Getter ist auch nützlich
}