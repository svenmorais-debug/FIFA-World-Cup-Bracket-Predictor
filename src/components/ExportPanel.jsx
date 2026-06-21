import { useRef } from 'react';
import html2canvas from 'html2canvas';
import ConfidenceStars from './ConfidenceStars';
import {
  R32_MATCHUPS,
  R16_MATCHUPS,
  QF_MATCHUPS,
  SF_MATCHUPS,
  FINAL_MATCHUP,
  THIRD_PLACE_MATCHUP,
} from '../data/teams';

function ExportMatchup({ matchId, matchupMap }) {
  const data = matchupMap[matchId];
  if (!data) return null;
  const { teamA, teamB, winner, confidence } = data;
  return (
    <div className="export-matchup">
      <div className={`export-team ${winner?.id === teamA?.id ? 'export-team--win' : winner ? 'export-team--loss' : ''}`}>
        {teamA ? <>{teamA.flag} {teamA.name}</> : '—'}
      </div>
      <div className={`export-team ${winner?.id === teamB?.id ? 'export-team--win' : winner ? 'export-team--loss' : ''}`}>
        {teamB ? <>{teamB.flag} {teamB.name}</> : '—'}
      </div>
      {winner && confidence && (
        <div className="export-stars">
          {'★'.repeat(confidence)}{'☆'.repeat(5 - confidence)}
        </div>
      )}
    </div>
  );
}

function ExportRound({ title, matchups, matchupMap }) {
  return (
    <div className="export-round">
      <div className="export-round-title">{title}</div>
      {matchups.map((m) => (
        <ExportMatchup key={m.id} matchId={m.id} matchupMap={matchupMap} />
      ))}
    </div>
  );
}

export default function ExportPanel({ userName, matchupMap, onExportJSON, onImportJSON, onClose }) {
  const exportRef = useRef();
  const fileRef = useRef();
  const finalData = matchupMap[FINAL_MATCHUP.id];
  const thirdData = matchupMap[THIRD_PLACE_MATCHUP.id];

  async function handleExportImage() {
    if (!exportRef.current) return;
    try {
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = 'wc2026-bracket.png';
      a.click();
    } catch (err) {
      alert('Export failed. Try again.');
    }
  }

  return (
    <div className="export-overlay" onClick={onClose}>
      <div className="export-modal" onClick={(e) => e.stopPropagation()}>
        <div className="export-modal__header">
          <h2>Export Bracket</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="export-actions">
          <button className="btn btn--primary" onClick={handleExportImage}>
            📸 Save as Image
          </button>
          <button className="btn btn--secondary" onClick={onExportJSON}>
            💾 Save Progress (JSON)
          </button>
          <label className="btn btn--secondary btn--file">
            📂 Load Progress
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files[0]) onImportJSON(e.target.files[0]);
              }}
            />
          </label>
        </div>

        <div className="export-preview-scroll">
          <div ref={exportRef} className="export-bracket">
            <div className="export-header">
              <div className="export-title">{userName}</div>
              <div className="export-subtitle">FIFA World Cup 2026 — My Predictions</div>
            </div>

            <div className="export-rounds">
              <ExportRound title="R32" matchups={R32_MATCHUPS} matchupMap={matchupMap} />
              <ExportRound title="R16" matchups={R16_MATCHUPS} matchupMap={matchupMap} />
              <ExportRound title="QF" matchups={QF_MATCHUPS} matchupMap={matchupMap} />
              <ExportRound title="SF" matchups={SF_MATCHUPS} matchupMap={matchupMap} />
              <div className="export-round">
                <div className="export-round-title">Final</div>
                <ExportMatchup matchId={FINAL_MATCHUP.id} matchupMap={matchupMap} />
                {finalData?.winner && (
                  <div className="export-champion">
                    🏆 {finalData.winner.flag} {finalData.winner.name}
                  </div>
                )}
              </div>
              <div className="export-round">
                <div className="export-round-title">3rd Place</div>
                <ExportMatchup matchId={THIRD_PLACE_MATCHUP.id} matchupMap={matchupMap} />
              </div>
            </div>

            <div className="export-footer">FIFA World Cup 2026</div>
          </div>
        </div>
      </div>
    </div>
  );
}
