package com.example.roundrobintunier.model;

public class Team {
    private Spieler spieler1;
    private Spieler spieler2;

    public Team(Spieler s1, Spieler s2) {
        this.spieler1 = s1;
        this.spieler2 = s2;
    }
    
    // Default Konstruktor & Getter für JSON
    public Team() {}
    public Spieler getSpieler1() { return spieler1; }
    public Spieler getSpieler2() { return spieler2; }
}