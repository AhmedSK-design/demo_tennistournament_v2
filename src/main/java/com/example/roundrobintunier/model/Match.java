package com.example.roundrobintunier.model;

public class Match {
    private Team team1;
    private Team team2;

    public Match(Team t1, Team t2) {
        this.team1 = t1;
        this.team2 = t2;
    }

    // Getter für JSON
    public Team getTeam1() { return team1; }
    public Team getTeam2() { return team2; }
}