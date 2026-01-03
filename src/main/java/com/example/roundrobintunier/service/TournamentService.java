package com.example.roundrobintunier.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.roundrobintunier.controller.TournamentController;

@Service
public class TournamentService {

    @Autowired
    private TournamentController tournamentController;
}