import { useState } from 'react';
import ConfidenceStars from './ConfidenceStars';
import { FINAL_MATCHUP, THIRD_PLACE_MATCHUP } from '../data/teams';

// ─── Compact card used inside the bracket ────────────────────────────────────
function BracketCard({ matchId, data, onPick, onConfidence }) {
  if (!data) return <div className="b-card b-card--empty" />;
  const { teamA, teamB, winner, confidence, thirdSlot } = data;
  const canPick = !!(teamA && teamB);
  const winnerId = winner?.id;

  const tbdLabelB = !teamB && thirdSlot
    ? `3rd (${thirdSlot.slice(0, 3).join('/')}${thirdSlot.length > 3 ? '…' : ''})`
    : 'TBD';

  function pick(team) {
    if (canPick) onPick(matchId, team.id, confidence ?? 3);
  }

  return (
    <div className={`b-card${winner ? ' b-card--done' : ''}${!canPick ? ' b-card--tbd' : ''}`}>
      <button
        className={`b-team${winnerId === teamA?.id ? ' b-team--win' : winnerId ? ' b-team--loss' : ''}`}
        disabled={!canPick}
        onClick={() => teamA && pick(teamA)}
      >
        <span className="b-flag">{teamA?.flag ?? ''}</span>
        <span className="b-name">{teamA?.name ?? 'TBD'}</span>
      </button>
      <div className="b-divider" />
      <button
        className={`b-team${winnerId === teamB?.id ? ' b-team--win' : winnerId ? ' b-team--loss' : ''}`}
        disabled={!canPick}
        onClick={() => teamB && pick(teamB)}
      >
        <span className="b-flag">{teamB?.flag ?? ''}</span>
        <span className="b-name">{teamB?.name ?? tbdLabelB}</span>
      </button>
      {winner && (
        <div className="b-stars">
          <ConfidenceStars value={confidence} onChange={v => onConfidence(matchId, v)} small />
        </div>
      )}
    </div>
  );
}

// ─── A vertical round column using CSS Grid rows ──────────────────────────────
// `rows` determines how many equal-height slots the column is divided into.
// Each match card sits centered in its slot(s).
// `side` is 'left' or 'right' — controls which direction connector lines point.
function BracketRound({ matchIds, matchupMap, onPick, onConfidence, rows, side }) {
  return (
    <div className={`bracket-round bracket-round--${rows} bracket-round--${side}`}>
      {matchIds.map(id => (
        <div key={id} className="bracket-slot">
          <BracketCard matchId={id} data={matchupMap[id]} onPick={onPick} onConfidence={onConfidence} />
        </div>
      ))}
    </div>
  );
}

// ─── Main bracket ─────────────────────────────────────────────────────────────
export default function KnockoutBracket({
  matchupMap, onPick, onConfidence, onBack, thirdAssignmentValid,
}) {
  const finalData = matchupMap[FINAL_MATCHUP.id];
  const thirdData = matchupMap[THIRD_PLACE_MATCHUP.id];

  return (
    <div className="knockout-bracket">
      <div className="stage-header">
        <h2 className="stage-title">Knockout Bracket</h2>
        <p className="stage-subtitle">
          Click a team to advance them. Star ratings appear after each pick.
          3rd-place opponents are auto-seeded using the official 2026 FIFA rules.
        </p>
      </div>

      {!thirdAssignmentValid && (
        <div className="assignment-warning">
          ⚠️ The selected third-place teams cannot be validly assigned using the official FIFA seeding
          rules. Try changing your selections.
        </div>
      )}

      {/* ── Round labels ── */}
      <div className="bracket-labels">
        <span>Round of 32</span>
        <span>Round of 16</span>
        <span>QF</span>
        <span>SF</span>
        <span className="bracket-labels__center">Final</span>
        <span>SF</span>
        <span>QF</span>
        <span>Round of 16</span>
        <span>Round of 32</span>
      </div>

      {/* ── Bracket grid ── */}
      <div className="bracket-layout-wrap"><div className="bracket-layout">
        {/* Left half: R32 → R16 → QF → SF */}
        <BracketRound
          matchIds={['R32_1','R32_2','R32_3','R32_4','R32_5','R32_6','R32_7','R32_8']}
          rows={8} side="left" matchupMap={matchupMap} onPick={onPick} onConfidence={onConfidence}
        />
        <BracketRound
          matchIds={['R16_1','R16_2','R16_3','R16_4']}
          rows={4} side="left" matchupMap={matchupMap} onPick={onPick} onConfidence={onConfidence}
        />
        <BracketRound
          matchIds={['QF_1','QF_2']}
          rows={2} side="left" matchupMap={matchupMap} onPick={onPick} onConfidence={onConfidence}
        />
        <BracketRound
          matchIds={['SF_1']}
          rows={1} side="left" matchupMap={matchupMap} onPick={onPick} onConfidence={onConfidence}
        />

        {/* Center: Final + Champion + Bronze */}
        <div className="bracket-center">
          <div className="bracket-center__final">
            <BracketCard matchId={FINAL_MATCHUP.id} data={finalData} onPick={onPick} onConfidence={onConfidence} />
          </div>
          {finalData?.winner && (
            <div className="champion-badge">
              <span className="champion-trophy">🏆</span>
              <span className="champion-flag">{finalData.winner.flag}</span>
              <span className="champion-name">{finalData.winner.name}</span>
            </div>
          )}
          <div className="bracket-center__bronze">
            <div className="bronze-label">🥉 Bronze</div>
            <BracketCard matchId={THIRD_PLACE_MATCHUP.id} data={thirdData} onPick={onPick} onConfidence={onConfidence} />
          </div>
        </div>

        {/* Right half: SF → QF → R16 → R32 */}
        <BracketRound
          matchIds={['SF_2']}
          rows={1} side="right" matchupMap={matchupMap} onPick={onPick} onConfidence={onConfidence}
        />
        <BracketRound
          matchIds={['QF_3','QF_4']}
          rows={2} side="right" matchupMap={matchupMap} onPick={onPick} onConfidence={onConfidence}
        />
        <BracketRound
          matchIds={['R16_5','R16_6','R16_7','R16_8']}
          rows={4} side="right" matchupMap={matchupMap} onPick={onPick} onConfidence={onConfidence}
        />
        <BracketRound
          matchIds={['R32_9','R32_10','R32_11','R32_12','R32_13','R32_14','R32_15','R32_16']}
          rows={8} side="right" matchupMap={matchupMap} onPick={onPick} onConfidence={onConfidence}
        />
      </div></div>

      <div className="stage-footer">
        <button className="btn btn--secondary" onClick={onBack}>← Back to Group Stage</button>
      </div>
    </div>
  );
}
