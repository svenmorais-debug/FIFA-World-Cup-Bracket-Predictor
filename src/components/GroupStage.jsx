import { GROUPS, GROUP_LETTERS } from '../data/teams';

const RANK_CONFIG = [
  { rank: 'first',  label: '1st', short: '1', className: 'pick-btn--1st' },
  { rank: 'second', label: '2nd', short: '2', className: 'pick-btn--2nd' },
  { rank: 'third',  label: '3rd', short: '3', className: 'pick-btn--3rd' },
];

function GroupCard({ letter, group, picks, onPick }) {
  const { teams } = group;
  const first  = picks?.first;
  const second = picks?.second;
  const third  = picks?.third;
  const fourth = picks?.fourth;
  const isComplete = first && second && third;

  // Map teamId -> rank label for display in the standings order
  const rankOf = (id) => {
    if (id === first)  return { label: '1st', cls: 'rank--1st' };
    if (id === second) return { label: '2nd', cls: 'rank--2nd' };
    if (id === third)  return { label: '3rd', cls: 'rank--3rd' };
    if (id === fourth) return { label: '4th', cls: 'rank--4th' };
    return null;
  };

  return (
    <div className={`group-card ${isComplete ? 'group-card--complete' : ''}`}>
      <div className="group-card__header">
        <span className="group-letter">Group {letter}</span>
        {isComplete && <span className="group-check">✓</span>}
      </div>

      <div className="group-teams">
        {teams.map((team) => {
          const rank = rankOf(team.id);
          const isAssigned = !!rank;
          const isFourth = team.id === fourth;

          return (
            <div
              key={team.id}
              className={`team-row ${isAssigned ? 'team-row--selected' : ''} ${isFourth ? 'team-row--fourth' : ''}`}
            >
              {/* Rank badge */}
              <div className={`rank-badge ${rank ? rank.cls : 'rank--none'}`}>
                {rank ? rank.label : '—'}
              </div>

              <div className="team-info">
                <span className="team-flag">{team.flag}</span>
                <span className="team-name">{team.name}</span>
              </div>

              <div className="team-picks">
                {isFourth ? (
                  <span className="auto-badge">Auto</span>
                ) : (
                  RANK_CONFIG.map(({ rank: r, label, className }) => {
                    const isActive = picks?.[r] === team.id;
                    return (
                      <button
                        key={r}
                        className={`pick-btn ${className} ${isActive ? 'pick-btn--active' : ''}`}
                        onClick={() => onPick(letter, r, isActive ? null : team.id)}
                        title={`Pick as ${label} place`}
                      >
                        {label}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function GroupStage({ groupPicks, onPick, groupsComplete, onAdvance }) {
  const doneCount = GROUP_LETTERS.filter((g) => {
    const p = groupPicks[g];
    return p?.first && p?.second && p?.third;
  }).length;

  return (
    <div className="group-stage">
      <div className="stage-header">
        <h2 className="stage-title">Group Stage</h2>
        <p className="stage-subtitle">
          Pick 1st, 2nd, and 3rd place for each group — 4th place fills in automatically.
          The top 2 teams advance directly; 3rd-place teams compete for the remaining 8 spots.
        </p>
      </div>

      <div className="groups-grid">
        {GROUP_LETTERS.map((letter) => (
          <GroupCard
            key={letter}
            letter={letter}
            group={GROUPS[letter]}
            picks={groupPicks[letter]}
            onPick={onPick}
          />
        ))}
      </div>

      <div className="stage-footer">
        <span className="groups-progress-text">{doneCount} of 12 groups complete</span>
        <button className="btn btn--primary" disabled={!groupsComplete} onClick={onAdvance}>
          Select Best 3rd-Place Teams →
        </button>
      </div>
    </div>
  );
}
