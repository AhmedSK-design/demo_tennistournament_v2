
export class Spieler {
    id;
    name;
    geschlecht;
    spielstaerke;

    constructor(name = "", geschlecht = "", spielstaerke = 1) {
        this.name = name;
        this.geschlecht = geschlecht;
        this.spielstaerke = spielstaerke;
    }

    // Optional: Hilfsmethode zum Erstellen aus JSON / Objekt
    static fromJSON(json){
        return new Spieler(
        json.name ?? "",
        json.geschlecht ?? "",
        json.spielstaerke ?? 1
        );
    }

    // Optional: Konvertieren in JSON für API-Request
    toJSON() {
        return {
        name: this.name,
        geschlecht: this.geschlecht,
        spielstaerke: this.spielstaerke
        };
    }
    }
