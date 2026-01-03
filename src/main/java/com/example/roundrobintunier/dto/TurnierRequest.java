package com.example.roundrobintunier.dto;

import java.util.List;

public class TurnierRequest {
    // Wir nehmen hier DTOs an, um flexibel zu bleiben
    private List<PlayerRequestDTO> spielerListe; 
    private int anzahlPlaetze;
    private int anzahlRunden;
    private boolean forceMixed;

    // Getter / Setter
    public List<PlayerRequestDTO> getSpielerListe() { return spielerListe; }
    public void setSpielerListe(List<PlayerRequestDTO> spielerListe) { this.spielerListe = spielerListe; }
    public int getAnzahlPlaetze() { return anzahlPlaetze; }
    public void setAnzahlPlaetze(int anzahlPlaetze) { this.anzahlPlaetze = anzahlPlaetze; }
    public int getAnzahlRunden() { return anzahlRunden; }
    public void setAnzahlRunden(int anzahlRunden) { this.anzahlRunden = anzahlRunden; }
    public boolean isForceMixed() { return forceMixed; }
    public void setForceMixed(boolean forceMixed) { this.forceMixed = forceMixed; }
}