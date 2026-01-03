export function TournamentView({ plan, onBack }: { plan: any; onBack: () => void }) {
    return (
        <div className="tournament-results">
            <h1>Turnierplan</h1>
            <button onClick={onBack} className="back-btn">Zurück zur Bearbeitung</button>

            <div className="rounds-grid">
                {plan.runden.map((runde: any) => (
                    <div key={runde.rundenNummer} className="round-box">
                        <h2>Runde {runde.rundenNummer}</h2>
                        {runde.matches.map((match: any, idx: number) => (
                            <div key={idx} className="match-card">
                                <div className="team">
                                    {match.team1.spieler1.name} & {match.team1.spieler2.name}
                                </div>
                                <div className="vs">VS</div>
                                <div className="team">
                                    {match.team2.spieler1.name} & {match.team2.spieler2.name}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}