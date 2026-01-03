package com.example.roundrobintunier.model;

import java.util.ArrayList;
import java.util.List;

public class Runde {
    private int rundenNummer;
    private List<Match> matches = new ArrayList<>();
    
    // NEU: Die Liste der pausierenden Spieler
    private List<Spieler> pausierendeSpieler = new ArrayList<>();

    public Runde(int nummer) {
        this.rundenNummer = nummer;
    }

    public void addMatch(Match m) { matches.add(m); }

    // Getter & Setter
    public int getRundenNummer() { return rundenNummer; }
    public List<Match> getMatches() { return matches; }
    
    public List<Spieler> getPausierendeSpieler() { return pausierendeSpieler; }
    public void setPausierendeSpieler(List<Spieler> pausierendeSpieler) { this.pausierendeSpieler = pausierendeSpieler; }
}