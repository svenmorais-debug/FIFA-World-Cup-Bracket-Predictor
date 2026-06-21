import { useState, useEffect, useCallback } from 'react';
import {
  GROUPS,
  GROUP_LETTERS,
  R32_MATCHUPS,
  R16_MATCHUPS,
  QF_MATCHUPS,
  SF_MATCHUPS,
  FINAL_MATCHUP,
  THIRD_PLACE_MATCHUP,
} from '../data/teams';

const STORAGE_KEY = 'wc2026_bracket';

const initialState = () => ({
  // stage: 'group' | 'third-place-selection' | 'knockout'
  stage: 'group',
  userName: 'My 2026 Picks',
  // groupPicks[group] = { first: teamId, second: teamId }
  groupPicks: {},
  // bestThird: array of up to 8 selected third-place team IDs
  bestThirdPicks: [],
  // knockoutPicks[matchId] = { winnerId, confidence (1-5) }
  knockoutPicks: {},
});

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...initialState(), ...JSON.parse(saved) };
  } catch (_) {}
  return initialState();
}

function getTeamById(id) {
  for (const g of Object.values(GROUPS)) {
    const t = g.teams.find((t) => t.id === id);
    if (t) return t;
  }
  return null;
}

// Derive the team that fills a given slot based on groupPicks / bestThirdPicks
function resolveSlot(slot, groupPicks, bestThirdPicks) {
  const rank = slot[0]; // '1', '2', or 'T'
  const key = slot.slice(1);
  if (rank === '1') {
    const picks = groupPicks[key];
    return picks?.first ? getTeamById(picks.first) : null;
  }
  if (rank === '2') {
    const picks = groupPicks[key];
    return picks?.second ? getTeamById(picks.second) : null;
  }
  if (rank === 'T') {
    const idx = parseInt(key, 10) - 1;
    const id = bestThirdPicks[idx];
    return id ? getTeamById(id) : null;
  }
  return null;
}

// Build a map from matchId -> { teamA, teamB } for all rounds
function buildMatchupMap(groupPicks, bestThirdPicks, knockoutPicks) {
  const map = {};

  // R32
  for (const m of R32_MATCHUPS) {
    map[m.id] = {
      teamA: resolveSlot(m.slotA, groupPicks, bestThirdPicks),
      teamB: resolveSlot(m.slotB, groupPicks, bestThirdPicks),
      winner: knockoutPicks[m.id]?.winnerId
        ? getTeamById(knockoutPicks[m.id].winnerId)
        : null,
      confidence: knockoutPicks[m.id]?.confidence ?? null,
    };
  }

  const winnerOf = (id) => {
    const w = knockoutPicks[id]?.winnerId;
    return w ? getTeamById(w) : null;
  };
  const loserOf = (id) => {
    const pick = knockoutPicks[id];
    if (!pick?.winnerId) return null;
    const m = map[id];
    if (!m) return null;
    if (m.teamA?.id === pick.winnerId) return m.teamB;
    return m.teamA;
  };

  for (const m of R16_MATCHUPS) {
    map[m.id] = {
      teamA: winnerOf(m.fromA),
      teamB: winnerOf(m.fromB),
      winner: winnerOf(m.id),
      confidence: knockoutPicks[m.id]?.confidence ?? null,
    };
  }
  for (const m of QF_MATCHUPS) {
    map[m.id] = {
      teamA: winnerOf(m.fromA),
      teamB: winnerOf(m.fromB),
      winner: winnerOf(m.id),
      confidence: knockoutPicks[m.id]?.confidence ?? null,
    };
  }
  for (const m of SF_MATCHUPS) {
    map[m.id] = {
      teamA: winnerOf(m.fromA),
      teamB: winnerOf(m.fromB),
      winner: winnerOf(m.id),
      confidence: knockoutPicks[m.id]?.confidence ?? null,
    };
  }
  map[FINAL_MATCHUP.id] = {
    teamA: winnerOf(SF_MATCHUPS[0].id),
    teamB: winnerOf(SF_MATCHUPS[1].id),
    winner: winnerOf(FINAL_MATCHUP.id),
    confidence: knockoutPicks[FINAL_MATCHUP.id]?.confidence ?? null,
  };
  map[THIRD_PLACE_MATCHUP.id] = {
    teamA: loserOf(SF_MATCHUPS[0].id),
    teamB: loserOf(SF_MATCHUPS[1].id),
    winner: winnerOf(THIRD_PLACE_MATCHUP.id),
    confidence: knockoutPicks[THIRD_PLACE_MATCHUP.id]?.confidence ?? null,
  };

  return map;
}

export default function useBracket() {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}
  }, [state]);

  const setGroupPick = useCallback((group, rank, teamId) => {
    setState((prev) => {
      const existing = prev.groupPicks[group] || {};
      // Prevent picking same team for both positions
      const updated = { ...existing };
      if (rank === 'first') {
        if (updated.second === teamId) updated.second = null;
        updated.first = teamId;
      } else {
        if (updated.first === teamId) updated.first = null;
        updated.second = teamId;
      }
      return { ...prev, groupPicks: { ...prev.groupPicks, [group]: updated } };
    });
  }, []);

  const toggleBestThird = useCallback((teamId) => {
    setState((prev) => {
      const current = prev.bestThirdPicks;
      if (current.includes(teamId)) {
        return { ...prev, bestThirdPicks: current.filter((id) => id !== teamId) };
      }
      if (current.length >= 8) return prev;
      return { ...prev, bestThirdPicks: [...current, teamId] };
    });
  }, []);

  const setKnockoutPick = useCallback((matchId, winnerId, confidence) => {
    setState((prev) => {
      const existing = prev.knockoutPicks[matchId] || {};
      return {
        ...prev,
        knockoutPicks: {
          ...prev.knockoutPicks,
          [matchId]: { ...existing, winnerId, confidence: confidence ?? existing.confidence ?? 3 },
        },
      };
    });
  }, []);

  const setConfidence = useCallback((matchId, confidence) => {
    setState((prev) => {
      const existing = prev.knockoutPicks[matchId];
      if (!existing) return prev;
      return {
        ...prev,
        knockoutPicks: {
          ...prev.knockoutPicks,
          [matchId]: { ...existing, confidence },
        },
      };
    });
  }, []);

  const setStage = useCallback((stage) => {
    setState((prev) => ({ ...prev, stage }));
  }, []);

  const setUserName = useCallback((name) => {
    setState((prev) => ({ ...prev, userName: name }));
  }, []);

  const resetAll = useCallback(() => {
    setState(initialState());
  }, []);

  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wc2026-bracket.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const importJSON = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        setState({ ...initialState(), ...parsed });
      } catch (_) {
        alert('Invalid bracket file.');
      }
    };
    reader.readAsText(file);
  }, []);

  // Derived data
  const groupsComplete = GROUP_LETTERS.every((g) => {
    const p = state.groupPicks[g];
    return p?.first && p?.second;
  });

  const thirdPlaceTeams = GROUP_LETTERS.map((g) => {
    const picks = state.groupPicks[g];
    const group = GROUPS[g];
    const taken = [picks?.first, picks?.second].filter(Boolean);
    const third = group.teams.find((t) => !taken.includes(t.id));
    // Only return if both 1st and 2nd are picked
    if (!picks?.first || !picks?.second) return null;
    return { ...third, group: g };
  }).filter(Boolean);

  const bestThirdComplete = state.bestThirdPicks.length === 8;

  const matchupMap = buildMatchupMap(state.groupPicks, state.bestThirdPicks, state.knockoutPicks);

  const totalKnockoutPicks = Object.keys(matchupMap).length; // 33 matches total
  const madeKnockoutPicks = Object.values(state.knockoutPicks).filter((p) => p?.winnerId).length;

  const progress = {
    groupsDone: GROUP_LETTERS.filter((g) => {
      const p = state.groupPicks[g];
      return p?.first && p?.second;
    }).length,
    groupsTotal: 12,
    knockoutDone: madeKnockoutPicks,
    knockoutTotal: 33,
    bestThirdDone: state.bestThirdPicks.length,
  };

  return {
    state,
    groupsComplete,
    thirdPlaceTeams,
    bestThirdComplete,
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
    getTeamById,
  };
}
