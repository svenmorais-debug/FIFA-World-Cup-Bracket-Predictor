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
  // groupPicks[group] = { first, second, third, fourth (auto) }
  groupPicks: {},
  // bestThirdPicks: array of up to 8 selected third-place team IDs
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

export function getTeamById(id) {
  for (const g of Object.values(GROUPS)) {
    const t = g.teams.find((t) => t.id === id);
    if (t) return t;
  }
  return null;
}

// Auto-derive 4th place as the team not picked for 1st/2nd/3rd
function deriveFourth(group, picks) {
  const taken = [picks.first, picks.second, picks.third].filter(Boolean);
  if (taken.length < 3) return null;
  const fourth = GROUPS[group].teams.find((t) => !taken.includes(t.id));
  return fourth?.id ?? null;
}

// Resolve a bracket slot to a team object
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

function buildMatchupMap(groupPicks, bestThirdPicks, knockoutPicks) {
  const map = {};

  for (const m of R32_MATCHUPS) {
    map[m.id] = {
      teamA: resolveSlot(m.slotA, groupPicks, bestThirdPicks),
      teamB: resolveSlot(m.slotB, groupPicks, bestThirdPicks),
      winner: knockoutPicks[m.id]?.winnerId ? getTeamById(knockoutPicks[m.id].winnerId) : null,
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
    return m.teamA?.id === pick.winnerId ? m.teamB : m.teamA;
  };

  for (const m of R16_MATCHUPS) {
    map[m.id] = {
      teamA: winnerOf(m.fromA), teamB: winnerOf(m.fromB),
      winner: winnerOf(m.id), confidence: knockoutPicks[m.id]?.confidence ?? null,
    };
  }
  for (const m of QF_MATCHUPS) {
    map[m.id] = {
      teamA: winnerOf(m.fromA), teamB: winnerOf(m.fromB),
      winner: winnerOf(m.id), confidence: knockoutPicks[m.id]?.confidence ?? null,
    };
  }
  for (const m of SF_MATCHUPS) {
    map[m.id] = {
      teamA: winnerOf(m.fromA), teamB: winnerOf(m.fromB),
      winner: winnerOf(m.id), confidence: knockoutPicks[m.id]?.confidence ?? null,
    };
  }
  map[FINAL_MATCHUP.id] = {
    teamA: winnerOf(SF_MATCHUPS[0].id), teamB: winnerOf(SF_MATCHUPS[1].id),
    winner: winnerOf(FINAL_MATCHUP.id), confidence: knockoutPicks[FINAL_MATCHUP.id]?.confidence ?? null,
  };
  map[THIRD_PLACE_MATCHUP.id] = {
    teamA: loserOf(SF_MATCHUPS[0].id), teamB: loserOf(SF_MATCHUPS[1].id),
    winner: winnerOf(THIRD_PLACE_MATCHUP.id), confidence: knockoutPicks[THIRD_PLACE_MATCHUP.id]?.confidence ?? null,
  };

  return map;
}

export default function useBracket() {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
  }, [state]);

  const setGroupPick = useCallback((group, rank, teamId) => {
    setState((prev) => {
      const existing = prev.groupPicks[group] || {};
      const updated = { ...existing };

      // Clear this team from any other rank it already occupies
      if (teamId) {
        if (updated.first === teamId && rank !== 'first') updated.first = null;
        if (updated.second === teamId && rank !== 'second') updated.second = null;
        if (updated.third === teamId && rank !== 'third') updated.third = null;
      }

      updated[rank] = teamId; // null to deselect
      updated.fourth = deriveFourth(group, updated);

      // If 3rd changes, clear bestThirdPicks for that group's old 3rd
      let bestThirdPicks = prev.bestThirdPicks;
      if (rank === 'third' || rank === 'first' || rank === 'second') {
        // Remove any team from this group from bestThirdPicks since 3rd place changed
        const groupTeamIds = GROUPS[group].teams.map((t) => t.id);
        bestThirdPicks = bestThirdPicks.filter((id) => !groupTeamIds.includes(id));
      }

      return {
        ...prev,
        groupPicks: { ...prev.groupPicks, [group]: updated },
        bestThirdPicks,
      };
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
        knockoutPicks: { ...prev.knockoutPicks, [matchId]: { ...existing, confidence } },
      };
    });
  }, []);

  const setStage = useCallback((stage) => {
    setState((prev) => ({ ...prev, stage }));
  }, []);

  const setUserName = useCallback((name) => {
    setState((prev) => ({ ...prev, userName: name }));
  }, []);

  const resetAll = useCallback(() => { setState(initialState()); }, []);

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
      } catch (_) { alert('Invalid bracket file.'); }
    };
    reader.readAsText(file);
  }, []);

  // Group is complete when 1st, 2nd, and 3rd are all picked (4th auto-fills)
  const groupsComplete = GROUP_LETTERS.every((g) => {
    const p = state.groupPicks[g];
    return p?.first && p?.second && p?.third;
  });

  // Third-place teams come from explicit picks, not derivation
  const thirdPlaceTeams = GROUP_LETTERS.map((g) => {
    const picks = state.groupPicks[g];
    if (!picks?.third) return null;
    const team = getTeamById(picks.third);
    return team ? { ...team, group: g } : null;
  }).filter(Boolean);

  const bestThirdComplete = state.bestThirdPicks.length === 8;
  const matchupMap = buildMatchupMap(state.groupPicks, state.bestThirdPicks, state.knockoutPicks);
  const madeKnockoutPicks = Object.values(state.knockoutPicks).filter((p) => p?.winnerId).length;

  const progress = {
    groupsDone: GROUP_LETTERS.filter((g) => {
      const p = state.groupPicks[g];
      return p?.first && p?.second && p?.third;
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
  };
}
