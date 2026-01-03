package com.example.roundrobintunier.model;

import java.util.ArrayList;
import java.util.List;

public class Runde {
    private int rundenNummer;
    private List<Match> matches = new ArrayList<>();

    public Runde(int nummer) {
        this.rundenNummer = nummer;
    }

    public void addMatch(Match m) { matches.add(m); }

    // Getter für JSON
    public int getRundenNummer() { return rundenNummer; }
    public List<Match> getMatches() { return matches; }
}