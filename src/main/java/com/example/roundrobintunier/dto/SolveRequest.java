package com.example.roundrobintunier.dto;

import java.util.List;

/**
 * Data Transfer Object für die API-Anfrage zur Berechnung einer Runde.
 */
public class SolveRequest {
    private int rundenNummer;
    private List<PlayerRequestDTO> spielerDetails; // Liste der Spielerdaten
    private boolean forceMixed;

    // Standardkonstruktor für JSON-Deserialisierung
    public SolveRequest() {}

    public int getRundenNummer() { return rundenNummer; }
    public void setRundenNummer(int rundenNummer) { this.rundenNummer = rundenNummer; }


    public List<PlayerRequestDTO> getSpielerDetails() { return spielerDetails; }
    public void setSpielerDetails(List<PlayerRequestDTO> spielerDetails) { this.spielerDetails = spielerDetails; }

    public boolean isForceMixed() { return forceMixed; }
    public void setForceMixed(boolean forceMixed) { this.forceMixed = forceMixed; }
}