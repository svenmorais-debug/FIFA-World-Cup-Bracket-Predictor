import ConfidenceStars from './ConfidenceStars';

export default function MatchupCard({ matchId, teamA, teamB, winner, confidence, onPick, onConfidence, label }) {
  const canPick = teamA && teamB;
  const winnerId = winner?.id;

  function handlePick(team) {
    if (!canPick) return;
    onPick(matchId, team.id, confidence ?? 3);
  }

  return (
    <div className={`matchup-card ${winner ? 'matchup-card--decided' : ''} ${!canPick ? 'matchup-card--pending' : ''}`}>
      {label && <div className="matchup-label">{label}</div>}
      <div className="matchup-teams">
        <button
          className={`team-slot ${winnerId === teamA?.id ? 'team-slot--winner' : ''} ${winnerId && winnerId !== teamA?.id ? 'team-slot--loser' : ''}`}
          onClick={() => teamA && handlePick(teamA)}
          disabled={!canPick}
        >
          {teamA ? (
            <>
              <span className="slot-flag">{teamA.flag}</span>
              <span className="slot-name">{teamA.name}</span>
            </>
          ) : (
            <span className="slot-tbd">TBD</span>
          )}
          {winnerId === teamA?.id && <span className="winner-mark">▶</span>}
        </button>

        <div className="matchup-vs">vs</div>

        <button
          className={`team-slot ${winnerId === teamB?.id ? 'team-slot--winner' : ''} ${winnerId && winnerId !== teamB?.id ? 'team-slot--loser' : ''}`}
          onClick={() => teamB && handlePick(teamB)}
          disabled={!canPick}
        >
          {teamB ? (
            <>
              <span className="slot-flag">{teamB.flag}</span>
              <span className="slot-name">{teamB.name}</span>
            </>
          ) : (
            <span className="slot-tbd">TBD</span>
          )}
          {winnerId === teamB?.id && <span className="winner-mark">◀</span>}
        </button>
      </div>

      {winner && (
        <div className="matchup-confidence">
          <ConfidenceStars
            value={confidence}
            onChange={(v) => onConfidence(matchId, v)}
            small
          />
        </div>
      )}
    </div>
  );
}
