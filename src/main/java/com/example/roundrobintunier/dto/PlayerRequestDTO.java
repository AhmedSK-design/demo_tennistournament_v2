package com.example.roundrobintunier.dto;
/**
 * Data Transfer Object für die Spielerdaten aus dem Frontend-Request.
 */
public class PlayerRequestDTO {
    private String name;
    private String geschlecht; 
    private int spielstaerke;   // Werte von 1 bis 10

    // Standardkonstruktor für JSON-Deserialisierung (wichtig für Spring)
    public PlayerRequestDTO() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getGeschlecht() { return geschlecht; }
    public void setGeschlecht(String geschlecht) { this.geschlecht = geschlecht; }

    public int getSpielstaerke() { return spielstaerke; }
    public void setSpielstaerke(int spielstaerke) { this.spielstaerke = spielstaerke; }
}