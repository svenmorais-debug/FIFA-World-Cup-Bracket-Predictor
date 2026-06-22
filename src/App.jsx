import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './contexts/AuthContext';
import useBracket from './hooks/useBracket';
import { useFirestore } from './hooks/useFirestore';
import ProgressBar from './components/ProgressBar';
import GroupStage from './components/GroupStage';
import ThirdPlaceSelection from './components/ThirdPlaceSelection';
import KnockoutBracket from './components/KnockoutBracket';
import ExportPanel from './components/ExportPanel';
import LoginModal from './components/LoginModal';
import BracketsMenu from './components/BracketsMenu';
import ShareModal from './components/ShareModal';
import './App.css';

export default function App() {
  const { user, logout } = useAuth();

  const bracket = useBracket();
  const {
    state, groupsComplete, thirdPlaceTeams, bestThirdComplete,
    thirdAssignmentValid, matchupMap, progress,
    setGroupPick, toggleBestThird, setKnockoutPick, setConfidence,
    setStage, setUserName, resetAll, exportJSON, importJSON, loadBracketState,
  } = bracket;

  const {
    brackets, currentBracketId, setCurrentBracketId, loading: fsLoading,
    loadBracket, saveBracket, createBracket, deleteBracket, renameBracket, shareBracket,
  } = useFirestore(user?.uid ?? null);

  const [showExport, setShowExport] = useState(false);
  const [showShare,  setShowShare]  = useState(false);

  // Track whether we've finished loading from Firebase (prevents saving during load)
  const bracketReady    = useRef(false);
  const initialLoadDone = useRef(false);

  // ── On login: auto-load the most recent bracket or create one ──────────────
  useEffect(() => {
    if (!user || fsLoading || initialLoadDone.current) return;
    initialLoadDone.current = true;

    async function init() {
      if (brackets.length === 0) {
        // First time: persist local picks to Firebase
        const id = await createBracket(state.userName || 'My Predictions', state);
        if (id) { setCurrentBracketId(id); bracketReady.current = true; }
      } else {
        // Load most recent bracket
        await handleSelectBracket(brackets[0].id);
      }
    }
    init();
  }, [user, fsLoading, brackets]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-save bracket state to Firebase (debounced 800ms) ─────────────────
  useEffect(() => {
    if (!user || !currentBracketId || !bracketReady.current) return;
    const timer = setTimeout(() => {
      saveBracket(currentBracketId, state);
    }, 800);
    return () => clearTimeout(timer);
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Switch bracket ─────────────────────────────────────────────────────────
  const handleSelectBracket = useCallback(async (id) => {
    bracketReady.current = false;
    const doc = await loadBracket(id);
    if (doc?.bracketState) loadBracketState(doc.bracketState);
    setCurrentBracketId(id);
    setTimeout(() => { bracketReady.current = true; }, 300);
  }, [loadBracket, loadBracketState, setCurrentBracketId]);

  // ── Create new bracket ─────────────────────────────────────────────────────
  const handleCreateBracket = useCallback(async (name) => {
    bracketReady.current = false;
    const id = await createBracket(name);
    if (id) {
      const blank = { stage: 'group', userName: name, groupPicks: {}, bestThirdPicks: [], knockoutPicks: {} };
      loadBracketState(blank);
      setCurrentBracketId(id);
    }
    setTimeout(() => { bracketReady.current = true; }, 300);
  }, [createBracket, loadBracketState, setCurrentBracketId]);

  // ── Delete bracket ─────────────────────────────────────────────────────────
  const handleDeleteBracket = useCallback(async (id) => {
    await deleteBracket(id);
    // If we deleted the current one, switch to another
    const remaining = brackets.filter(b => b.id !== id);
    if (id === currentBracketId && remaining.length > 0) {
      await handleSelectBracket(remaining[0].id);
    }
  }, [brackets, currentBracketId, deleteBracket, handleSelectBracket]);

  // ── Share ──────────────────────────────────────────────────────────────────
  const currentBracketDoc = brackets.find(b => b.id === currentBracketId);

  async function handleShare() {
    if (!currentBracketId) return;
    await shareBracket(currentBracketId);
  }

  // ── Reset ──────────────────────────────────────────────────────────────────
  function handleReset() {
    if (!window.confirm('Reset all picks? This cannot be undone.')) return;
    resetAll();
  }

  // ── Logout ─────────────────────────────────────────────────────────────────
  function handleLogout() {
    initialLoadDone.current = false;
    bracketReady.current    = false;
    logout();
  }

  // ── Auth loading state ─────────────────────────────────────────────────────
  if (user === undefined) {
    return (
      <div className="app-loading">
        <div className="app-loading__spinner" />
      </div>
    );
  }

  if (!user) return <LoginModal />;

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
            <BracketsMenu
              brackets={brackets}
              currentId={currentBracketId}
              onSelect={handleSelectBracket}
              onCreate={handleCreateBracket}
              onDelete={handleDeleteBracket}
              onRename={(id, name) => renameBracket(id, name)}
            />
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

            <button className="btn btn--secondary btn--small" onClick={() => setShowShare(true)}>
              🔗 Share
            </button>
            <button className="btn btn--primary btn--small" onClick={() => setShowExport(true)}>
              Export
            </button>
            <button className="btn btn--ghost btn--small" onClick={handleReset}>
              Reset
            </button>
            <button className="btn btn--ghost btn--small" onClick={handleLogout}>
              Logout
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

      {showShare && (
        <ShareModal
          shareToken={currentBracketDoc?.shareToken ?? null}
          bracketName={currentBracketDoc?.name ?? 'My Bracket'}
          onShare={handleShare}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}
