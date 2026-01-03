package com.example.roundrobintunier.dto; 

import com.example.roundrobintunier.model.Spieler;
import java.util.List;

public class TurnierRequest {
    private List<Spieler> spielerListe;
    private int anzahlPlaetze;
    private int anzahlRunden;
    private boolean forceMixed;
    
    // Getter und Setter sind wichtig für JSON Deserialisierung!
    public List<Spieler> getSpielerListe() { return spielerListe; }
    public void setSpielerListe(List<Spieler> spielerListe) { this.spielerListe = spielerListe; }

    public int getAnzahlPlaetze() { return anzahlPlaetze; }
    public void setAnzahlPlaetze(int anzahlPlaetze) { this.anzahlPlaetze = anzahlPlaetze; }

    public int getAnzahlRunden() { return anzahlRunden; }
    public void setAnzahlRunden(int anzahlRunden) { this.anzahlRunden = anzahlRunden; }

    public boolean isForceMixed() { return forceMixed; }
    public void setForceMixed(boolean forceMixed) { this.forceMixed = forceMixed; }
}