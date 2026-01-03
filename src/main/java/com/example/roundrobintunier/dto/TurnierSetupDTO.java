package com.example.roundrobintunier.dto;

import java.util.List;

public class TurnierSetupDTO {
    // Parameter
    private int anzahlPlaetze;
    private int anzahlRunden;
    private String startZeit;      // Format "HH:mm"
    private int spielDauerMin;
    private int pausenLaengeMin;
    private boolean forceMixed;    // Neu, falls du das auch speichern willst

    // Spieler
    private List<PlayerRequestDTO> spielerListe;

    // Default Constructor
    public TurnierSetupDTO() {}

    // Getter und Setter
    public int getAnzahlPlaetze() { return anzahlPlaetze; }
    public void setAnzahlPlaetze(int anzahlPlaetze) { this.anzahlPlaetze = anzahlPlaetze; }

    public int getAnzahlRunden() { return anzahlRunden; }
    public void setAnzahlRunden(int anzahlRunden) { this.anzahlRunden = anzahlRunden; }

    public String getStartZeit() { return startZeit; }
    public void setStartZeit(String startZeit) { this.startZeit = startZeit; }

    public int getSpielDauerMin() { return spielDauerMin; }
    public void setSpielDauerMin(int spielDauerMin) { this.spielDauerMin = spielDauerMin; }

    public int getPausenLaengeMin() { return pausenLaengeMin; }
    public void setPausenLaengeMin(int pausenLaengeMin) { this.pausenLaengeMin = pausenLaengeMin; }

    public boolean isForceMixed() { return forceMixed; }
    public void setForceMixed(boolean forceMixed) { this.forceMixed = forceMixed; }

    public List<PlayerRequestDTO> getSpielerListe() { return spielerListe; }
    public void setSpielerListe(List<PlayerRequestDTO> spielerListe) { this.spielerListe = spielerListe; }
}