import MatchupCard from './MatchupCard';
import {
  R32_MATCHUPS,
  R16_MATCHUPS,
  QF_MATCHUPS,
  SF_MATCHUPS,
  FINAL_MATCHUP,
  THIRD_PLACE_MATCHUP,
} from '../data/teams';

function RoundColumn({ title, matchups, matchupMap, onPick, onConfidence }) {
  return (
    <div className="round-column">
      <h3 className="round-title">{title}</h3>
      <div className="round-matches">
        {matchups.map((m) => {
          const data = matchupMap[m.id];
          return (
            <MatchupCard
              key={m.id}
              matchId={m.id}
              teamA={data?.teamA}
              teamB={data?.teamB}
              winner={data?.winner}
              confidence={data?.confidence}
              thirdSlot={data?.thirdSlot ?? null}
              onPick={onPick}
              onConfidence={onConfidence}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function KnockoutBracket({
  matchupMap,
  onPick,
  onConfidence,
  onBack,
  thirdAssignmentValid,
}) {
  const finalData = matchupMap[FINAL_MATCHUP.id];
  const thirdData = matchupMap[THIRD_PLACE_MATCHUP.id];

  return (
    <div className="knockout-bracket">
      <div className="stage-header">
        <h2 className="stage-title">Knockout Bracket</h2>
        <p className="stage-subtitle">
          Click a team to pick them as the winner. Rate your confidence with ★ stars after each pick.
          Third-place slots are auto-assigned using the official 2026 bracket seeding rules.
        </p>
      </div>

      {!thirdAssignmentValid && (
        <div className="assignment-warning">
          ⚠️ The selected third-place teams cannot be validly assigned to the bracket slots using the
          official FIFA seeding rules. Try changing your 3rd-place selections.
        </div>
      )}

      <div className="bracket-scroll-wrap">
        <div className="bracket-container">
          <RoundColumn
            title="Round of 32"
            matchups={R32_MATCHUPS}
            matchupMap={matchupMap}
            onPick={onPick}
            onConfidence={onConfidence}
          />
          <RoundColumn
            title="Round of 16"
            matchups={R16_MATCHUPS}
            matchupMap={matchupMap}
            onPick={onPick}
            onConfidence={onConfidence}
          />
          <RoundColumn
            title="Quarterfinals"
            matchups={QF_MATCHUPS}
            matchupMap={matchupMap}
            onPick={onPick}
            onConfidence={onConfidence}
          />
          <RoundColumn
            title="Semifinals"
            matchups={SF_MATCHUPS}
            matchupMap={matchupMap}
            onPick={onPick}
            onConfidence={onConfidence}
          />
          <div className="round-column round-column--final">
            <h3 className="round-title">Final</h3>
            <div className="round-matches">
              <MatchupCard
                matchId={FINAL_MATCHUP.id}
                teamA={finalData?.teamA}
                teamB={finalData?.teamB}
                winner={finalData?.winner}
                confidence={finalData?.confidence}
                onPick={onPick}
                onConfidence={onConfidence}
                label="🏆 World Cup Final"
              />
            </div>
            {finalData?.winner && (
              <div className="champion-display">
                <div className="champion-badge">
                  <span className="champion-trophy">🏆</span>
                  <span className="champion-flag">{finalData.winner.flag}</span>
                  <span className="champion-name">{finalData.winner.name}</span>
                  <span className="champion-label">World Champion</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="third-place-section">
        <h3 className="round-title">3rd Place Match</h3>
        <div className="third-place-match">
          <MatchupCard
            matchId={THIRD_PLACE_MATCHUP.id}
            teamA={thirdData?.teamA}
            teamB={thirdData?.teamB}
            winner={thirdData?.winner}
            confidence={thirdData?.confidence}
            onPick={onPick}
            onConfidence={onConfidence}
            label="Bronze Medal Match"
          />
        </div>
      </div>

      <div className="stage-footer">
        <button className="btn btn--secondary" onClick={onBack}>
          ← Back to Group Stage
        </button>
      </div>
    </div>
  );
}
