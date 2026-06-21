export default function ProgressBar({ progress, stage }) {
  const groupPct = Math.round((progress.groupsDone / progress.groupsTotal) * 100);
  const knockoutPct = Math.round((progress.knockoutDone / progress.knockoutTotal) * 100);

  return (
    <div className="progress-bar-wrapper">
      <div className="progress-bar-inner">
        <div className="progress-section">
          <span className="progress-label">Group Stage</span>
          <span className="progress-value">
            {progress.groupsDone}/{progress.groupsTotal} complete
          </span>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${groupPct}%` }} />
          </div>
        </div>
        <div className="progress-divider" />
        <div className="progress-section">
          <span className="progress-label">Bracket</span>
          <span className="progress-value">
            {progress.knockoutDone}/{progress.knockoutTotal} picks made
          </span>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${knockoutPct}%` }} />
          </div>
        </div>
        {stage === 'third-place-selection' && (
          <>
            <div className="progress-divider" />
            <div className="progress-section">
              <span className="progress-label">Best 3rd Place</span>
              <span className="progress-value">
                {progress.bestThirdDone}/8 selected
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
