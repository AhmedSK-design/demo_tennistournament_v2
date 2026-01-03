// types.ts

// --- Request Types (Was wir senden) ---
export interface PlayerRequestDTO {
    name: string;
    geschlecht: string;
    spielstaerke: number;
}

export interface TurnierRequest {
    spielerListe: PlayerRequestDTO[];
    anzahlPlaetze: number;
    anzahlRunden: number;
    forceMixed: boolean;
}

export interface LocalPlayer {
    id: number;
    name: string;
    gender: string;
    spielstärke: number;
}

// --- Response Types (Was wir empfangen) ---
export interface SpielerModel {
    id: number;
    name: string;
    geschlecht: string;
    spielstaerke: number;
}

export interface TeamModel {
    spieler1: SpielerModel;
    spieler2: SpielerModel;
}

export interface MatchModel {
    team1: TeamModel;
    team2: TeamModel;
}

export interface RundeModel {
    rundenNummer: number;
    matches: MatchModel[];
}

export interface TurnierResponse {
    runden: RundeModel[];
}


