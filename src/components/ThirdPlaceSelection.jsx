export default function ThirdPlaceSelection({
  thirdPlaceTeams,
  bestThirdPicks,
  onToggle,
  onAdvance,
  onBack,
}) {
  const selected = bestThirdPicks.length;
  const canAdvance = selected === 8;

  return (
    <div className="third-place-selection">
      <div className="stage-header">
        <h2 className="stage-title">Best 3rd-Place Teams</h2>
        <p className="stage-subtitle">
          Choose <strong>8 out of 12</strong> third-place finishers to advance to the Round of 32.
          These teams are ranked by points, then goal difference.
        </p>
      </div>

      <div className="third-counter">
        <span className={`counter-badge ${canAdvance ? 'counter-badge--done' : ''}`}>
          {selected} / 8 selected
        </span>
        {canAdvance && <span className="counter-check">All 8 selected ✓</span>}
      </div>

      <div className="third-grid">
        {thirdPlaceTeams.map((team) => {
          const isSelected = bestThirdPicks.includes(team.id);
          const isDisabled = !isSelected && selected >= 8;
          return (
            <button
              key={team.id}
              className={`third-card ${isSelected ? 'third-card--selected' : ''} ${isDisabled ? 'third-card--disabled' : ''}`}
              onClick={() => !isDisabled || isSelected ? onToggle(team.id) : null}
              disabled={isDisabled && !isSelected}
            >
              <span className="third-card__flag">{team.flag}</span>
              <div className="third-card__info">
                <span className="third-card__name">{team.name}</span>
                <span className="third-card__group">3rd — Group {team.group}</span>
              </div>
              <span className="third-card__check">{isSelected ? '✓' : ''}</span>
            </button>
          );
        })}
      </div>

      <div className="stage-footer">
        <button className="btn btn--secondary" onClick={onBack}>
          ← Back to Groups
        </button>
        <button
          className="btn btn--primary"
          disabled={!canAdvance}
          onClick={onAdvance}
        >
          View Knockout Bracket →
        </button>
      </div>
    </div>
  );
}
