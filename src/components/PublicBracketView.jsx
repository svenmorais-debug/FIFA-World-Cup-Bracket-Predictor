import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchByShareToken } from '../hooks/useFirestore';
import { buildMatchupMap } from '../hooks/useBracket';
import KnockoutBracket from './KnockoutBracket';
import ProgressBar from './ProgressBar';

const STORAGE_KEY = 'wc2026_bracket';

export default function PublicBracketView() {
  const { shareToken }              = useParams();
  const { user }                    = useAuth();
  const [bracketDoc, setBracketDoc] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [compare,    setCompare]    = useState(false);

  useEffect(() => {
    fetchByShareToken(shareToken)
      .then(doc => {
        if (!doc) setError('Bracket not found. The link may be invalid or the bracket was deleted.');
        else setBracketDoc(doc);
      })
      .catch(() => setError('Failed to load bracket. Please try again.'))
      .finally(() => setLoading(false));
  }, [shareToken]);

  if (loading) return (
    <div className="public-loading">
      <div className="public-loading__spinner" />
      <p>Loading bracket…</p>
    </div>
  );

  if (error) return (
    <div className="public-error">
      <div className="public-error__icon">⚠️</div>
      <p>{error}</p>
      <Link to="/" className="btn btn--primary">Go to App</Link>
    </div>
  );

  const { groupPicks = {}, bestThirdPicks = [], knockoutPicks = {} } = bracketDoc.bracketState ?? {};
  const matchupMap = buildMatchupMap(groupPicks, bestThirdPicks, knockoutPicks);

  // Build compare map from viewer's own localStorage bracket
  let compareMatchupMap = null;
  if (compare) {
    try {
      const local = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      compareMatchupMap = buildMatchupMap(
        local.groupPicks    ?? {},
        local.bestThirdPicks ?? [],
        local.knockoutPicks  ?? {},
      );
    } catch (_) {}
  }

  const progress = {
    groupsDone:    Object.values(groupPicks).filter(p => p?.first && p?.second && p?.third).length,
    groupsTotal:   12,
    knockoutDone:  Object.values(knockoutPicks).filter(p => p?.winnerId).length,
    knockoutTotal: 32,
    bestThirdDone: bestThirdPicks.length,
  };

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
            <div className="public-badge">
              👁 Viewing: <strong>{bracketDoc.name}</strong>
            </div>
          </div>

          <div className="header-right" style={{ gap: 8 }}>
            {user && (
              <button
                className={`btn btn--small ${compare ? 'btn--primary' : 'btn--secondary'}`}
                onClick={() => setCompare(c => !c)}
              >
                {compare ? '⚡ Comparing' : '⚡ Compare'}
              </button>
            )}
            <Link to="/" className="btn btn--secondary btn--small">
              {user ? '← My Bracket' : 'Sign In'}
            </Link>
          </div>
        </div>
        <ProgressBar progress={progress} stage="knockout" />
      </header>

      {compare && (
        <div className="compare-banner">
          Differences from your bracket are highlighted in amber.
        </div>
      )}

      <main className="app-main">
        <KnockoutBracket
          matchupMap={matchupMap}
          onPick={() => {}}
          onBack={() => {}}
          thirdAssignmentValid={true}
          readOnly
          compareMatchupMap={compareMatchupMap}
        />
      </main>
    </div>
  );
}
