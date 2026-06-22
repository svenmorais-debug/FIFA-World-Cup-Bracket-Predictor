import ConfidenceStars from './ConfidenceStars';

function TeamSlot({ team, isWinner, isLoser, disabled, onClick, tbdLabel }) {
  return (
    <button
      className={`team-slot ${isWinner ? 'team-slot--winner' : ''} ${isLoser ? 'team-slot--loser' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {team ? (
        <>
          <span className="slot-flag">{team.flag}</span>
          <span className="slot-name">{team.name}</span>
        </>
      ) : (
        <span className="slot-tbd">{tbdLabel ?? 'TBD'}</span>
      )}
      {isWinner && <span className="winner-mark">✓</span>}
    </button>
  );
}

export default function MatchupCard({
  matchId,
  teamA,
  teamB,
  winner,
  confidence,
  onPick,
  onConfidence,
  label,
  // For R32 third-place slots: array of eligible group letters e.g. ['A','B','C','D','F']
  thirdSlot,
}) {
  const canPick = teamA && teamB;
  const winnerId = winner?.id;

  function handlePick(team) {
    if (!canPick) return;
    onPick(matchId, team.id, confidence ?? 3);
  }

  // Build the TBD label for an unresolved third-place slot
  const tbdB = thirdSlot && !teamB
    ? `3rd (${thirdSlot.join('/')})`
    : null;

  return (
    <div
      className={[
        'matchup-card',
        winner         ? 'matchup-card--decided' : '',
        !canPick       ? 'matchup-card--pending'  : '',
      ].join(' ')}
    >
      {label && <div className="matchup-label">{label}</div>}

      <div className="matchup-teams">
        <TeamSlot
          team={teamA}
          isWinner={winnerId === teamA?.id}
          isLoser={!!winnerId && winnerId !== teamA?.id}
          disabled={!canPick}
          onClick={() => teamA && handlePick(teamA)}
        />

        <div className="matchup-vs">vs</div>

        <TeamSlot
          team={teamB}
          isWinner={winnerId === teamB?.id}
          isLoser={!!winnerId && winnerId !== teamB?.id}
          disabled={!canPick}
          onClick={() => teamB && handlePick(teamB)}
          tbdLabel={tbdB}
        />
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
