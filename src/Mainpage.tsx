import React, { useState } from 'react';
import './App.css'; // Oder wo auch immer du das CSS unten hinpackst

export default function Mainpage({ openNext }: { openNext: () => void }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="epic-container">
      {/* Animierter Hintergrund */}
      <div className="bg-grid"></div>
      <div className="bg-glow"></div>
      
      {/* Floating Particles (Fake) */}
      <div className="particle p1"></div>
      <div className="particle p2"></div>
      <div className="particle p3"></div>

      <div className="menu-interface">
        <div className="title-section">
          <h2 className="subtitle">CHAMPIONSHIP SERIES 2026</h2>
          <h1 className="mega-title" data-text="TENNIS MANAGER">
            TENNIS <span className="gradient-text">MANAGER</span>
          </h1>
        </div>

        <div className="menu-grid">
          {/* Haupt Button - Start */}
          <button 
            className={`ultra-card ${hovered === 'start' ? 'active' : ''}`}
            onMouseEnter={() => setHovered('start')}
            onMouseLeave={() => setHovered(null)}
            onClick={() => openNext()}
          >
            <div className="card-content">
              <span className="card-icon">🎾</span>
              <div className="text-group">
                <h3>Neues Turnier</h3>
                <p>Starte eine neue Legende</p>
              </div>
              <div className="arrow">→</div>
            </div>
            <div className="glow-effect"></div>
          </button>

          {/* Dummy Button - Laden */}
          <button 
            className={`ultra-card secondary ${hovered === 'load' ? 'active' : ''}`}
            onMouseEnter={() => setHovered('load')}
            onMouseLeave={() => setHovered(null)}
            onClick={() => alert("Coming Soon: Spielstand laden...")}
          >
            <div className="card-content">
              <span className="card-icon">📂</span>
              <div className="text-group">
                <h3>Laden</h3>
                <p>Fortschritt wiederherstellen</p>
              </div>
            </div>
          </button>

          {/* Dummy Button - Einstellungen */}
          <button 
            className={`ultra-card secondary ${hovered === 'settings' ? 'active' : ''}`}
            onMouseEnter={() => setHovered('settings')}
            onMouseLeave={() => setHovered(null)}
            onClick={() => alert("Hier gibt's nichts einzustellen. Es ist perfekt.")}
          >
            <div className="card-content">
              <span className="card-icon">⚙️</span>
              <div className="text-group">
                <h3>Optionen</h3>
                <p>Systemkonfiguration</p>
              </div>
            </div>
          </button>
        </div>
        
        <div className="footer-status">
          <span>SYSTEM: ONLINE</span>
          <span className="blink">WAITING FOR INPUT...</span>
          <span>V 2.0.4</span>
        </div>
      </div>
    </div>
  );
}