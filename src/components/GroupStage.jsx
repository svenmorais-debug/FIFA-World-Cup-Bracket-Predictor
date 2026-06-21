import { GROUPS, GROUP_LETTERS } from '../data/teams';

function GroupCard({ letter, group, picks, onPick }) {
  const { teams } = group;
  const first = picks?.first;
  const second = picks?.second;
  const isComplete = first && second;

  return (
    <div className={`group-card ${isComplete ? 'group-card--complete' : ''}`}>
      <div className="group-card__header">
        <span className="group-letter">Group {letter}</span>
        {isComplete && <span className="group-check">✓</span>}
      </div>
      <div className="group-teams">
        {teams.map((team) => {
          const isFirst = first === team.id;
          const isSecond = second === team.id;
          const isSelected = isFirst || isSecond;
          return (
            <div key={team.id} className={`team-row ${isSelected ? 'team-row--selected' : ''}`}>
              <div className="team-info">
                <span className="team-flag">{team.flag}</span>
                <span className="team-name">{team.name}</span>
              </div>
              <div className="team-picks">
                <button
                  className={`pick-btn pick-btn--1st ${isFirst ? 'pick-btn--active' : ''}`}
                  onClick={() => onPick(letter, 'first', isFirst ? null : team.id)}
                  title="Pick as 1st place"
                >
                  1st
                </button>
                <button
                  className={`pick-btn pick-btn--2nd ${isSecond ? 'pick-btn--active' : ''}`}
                  onClick={() => onPick(letter, 'second', isSecond ? null : team.id)}
                  title="Pick as 2nd place"
                >
                  2nd
                </button>
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
    return p?.first && p?.second;
  }).length;

  return (
    <div className="group-stage">
      <div className="stage-header">
        <h2 className="stage-title">Group Stage</h2>
        <p className="stage-subtitle">
          Select which team finishes 1st and 2nd in each group. The top 2 teams from each group advance.
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
        <span className="groups-progress-text">
          {doneCount} of 12 groups complete
        </span>
        <button
          className="btn btn--primary"
          disabled={!groupsComplete}
          onClick={onAdvance}
        >
          Select Best 3rd-Place Teams →
        </button>
      </div>
    </div>
  );
}
