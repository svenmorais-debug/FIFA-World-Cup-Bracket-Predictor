import { useState } from 'react';
import useBracket from './hooks/useBracket';
import ProgressBar from './components/ProgressBar';
import GroupStage from './components/GroupStage';
import ThirdPlaceSelection from './components/ThirdPlaceSelection';
import KnockoutBracket from './components/KnockoutBracket';
import ExportPanel from './components/ExportPanel';
import './App.css';

export default function App() {
  const {
    state,
    groupsComplete,
    thirdPlaceTeams,
    bestThirdComplete,
    thirdAssignmentValid,
    matchupMap,
    progress,
    setGroupPick,
    toggleBestThird,
    setKnockoutPick,
    setConfidence,
    setStage,
    setUserName,
    resetAll,
    exportJSON,
    importJSON,
  } = useBracket();

  const [showExport, setShowExport] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(state.userName);

  function handleNameSave() {
    setUserName(nameInput);
    setEditingName(false);
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-left">
            <div className="header-logo">
              <span className="logo-icon">⚽</span>
              <div>
                <div className="logo-title">FIFA World Cup 2026</div>
                <div className="logo-sub">Bracket Predictor</div>
              </div>
            </div>
          </div>

          <div className="header-center">
            {editingName ? (
              <div className="name-edit">
                <input
                  className="name-input"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                  autoFocus
                />
                <button className="btn btn--small btn--primary" onClick={handleNameSave}>Save</button>
                <button className="btn btn--small btn--ghost" onClick={() => setEditingName(false)}>Cancel</button>
              </div>
            ) : (
              <button className="name-display" onClick={() => { setEditingName(true); setNameInput(state.userName); }}>
                <span>{state.userName}</span>
                <span className="name-edit-icon">✏️</span>
              </button>
            )}
          </div>

          <div className="header-right">
            <nav className="stage-nav">
              <button
                className={`nav-btn ${state.stage === 'group' ? 'nav-btn--active' : ''}`}
                onClick={() => setStage('group')}
              >
                Groups
              </button>
              <button
                className={`nav-btn ${state.stage === 'third-place-selection' ? 'nav-btn--active' : ''}`}
                onClick={() => groupsComplete && setStage('third-place-selection')}
                disabled={!groupsComplete}
              >
                Best 3rd
              </button>
              <button
                className={`nav-btn ${state.stage === 'knockout' ? 'nav-btn--active' : ''}`}
                onClick={() => bestThirdComplete && setStage('knockout')}
                disabled={!bestThirdComplete}
              >
                Bracket
              </button>
            </nav>
            <button className="btn btn--primary btn--small" onClick={() => setShowExport(true)}>
              Export
            </button>
            <button
              className="btn btn--ghost btn--small"
              onClick={() => { if (window.confirm('Reset all picks? This cannot be undone.')) resetAll(); }}
            >
              Reset
            </button>
          </div>
        </div>

        <ProgressBar progress={progress} stage={state.stage} />
      </header>

      <main className="app-main">
        {state.stage === 'group' && (
          <GroupStage
            groupPicks={state.groupPicks}
            onPick={setGroupPick}
            groupsComplete={groupsComplete}
            onAdvance={() => setStage('third-place-selection')}
          />
        )}

        {state.stage === 'third-place-selection' && (
          <ThirdPlaceSelection
            thirdPlaceTeams={thirdPlaceTeams}
            bestThirdPicks={state.bestThirdPicks}
            onToggle={toggleBestThird}
            onAdvance={() => setStage('knockout')}
            onBack={() => setStage('group')}
          />
        )}

        {state.stage === 'knockout' && (
          <KnockoutBracket
            matchupMap={matchupMap}
            onPick={setKnockoutPick}
            onBack={() => setStage('group')}
            thirdAssignmentValid={thirdAssignmentValid}
          />
        )}
      </main>

      {showExport && (
        <ExportPanel
          userName={state.userName}
          matchupMap={matchupMap}
          onExportJSON={exportJSON}
          onImportJSON={(file) => { importJSON(file); setShowExport(false); }}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
}
