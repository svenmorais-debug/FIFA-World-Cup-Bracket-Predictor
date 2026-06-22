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
  THIRD_PLACE_SLOTS,
} from '../data/teams';

const STORAGE_KEY = 'wc2026_bracket';

const initialState = () => ({
  stage: 'group',
  userName: 'My 2026 Picks',
  // groupPicks[group] = { first, second, third, fourth (auto) }
  groupPicks: {},
  // bestThirdPicks: ordered array of up to 8 selected third-place team IDs
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

// Return the group letter that a team belongs to
function getGroupOfTeam(teamId) {
  for (const [letter, group] of Object.entries(GROUPS)) {
    if (group.teams.some((t) => t.id === teamId)) return letter;
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

// ─── Third-place auto-assignment ─────────────────────────────────────────────
// Given the 8 selected 3rd-place teams, assign each to one of the 8 R32 slots
// using backtracking. Each slot has a list of eligible groups; the team from
// that group (if selected) may fill it.  Returns { matchId: teamId } or null
// if no valid assignment exists (shouldn't happen with valid FIFA data).
function computeThirdAssignments(bestThirdPicks) {
  if (bestThirdPicks.length !== 8) return {};

  // Build group → teamId map for the selected third-place teams
  const groupToTeam = {};
  for (const teamId of bestThirdPicks) {
    const g = getGroupOfTeam(teamId);
    if (g) groupToTeam[g] = teamId;
  }

  // Sort slots most-constrained first (fewest eligible teams among those selected)
  const slots = THIRD_PLACE_SLOTS.map((slot) => ({
    ...slot,
    eligible: slot.groups.filter((g) => groupToTeam[g]),
  })).sort((a, b) => a.eligible.length - b.eligible.length);

  const assignment = {};
  const used = new Set();

  function solve(idx) {
    if (idx === slots.length) return true;
    const slot = slots[idx];
    for (const g of slot.eligible) {
      const teamId = groupToTeam[g];
      if (used.has(teamId)) continue;
      assignment[slot.matchId] = teamId;
      used.add(teamId);
      if (solve(idx + 1)) return true;
      delete assignment[slot.matchId];
      used.delete(teamId);
    }
    return false;
  }

  return solve(0) ? assignment : {};
}

// ─── Matchup map builder ──────────────────────────────────────────────────────
function resolveRegularSlot(slot, groupPicks) {
  const rank = slot[0]; // '1' or '2'
  const key = slot.slice(1);
  const picks = groupPicks[key];
  if (rank === '1') return picks?.first  ? getTeamById(picks.first)  : null;
  if (rank === '2') return picks?.second ? getTeamById(picks.second) : null;
  return null;
}

function buildMatchupMap(groupPicks, bestThirdPicks, knockoutPicks) {
  const thirdAssignments = computeThirdAssignments(bestThirdPicks);
  const map = {};

  // R32
  for (const m of R32_MATCHUPS) {
    const teamA = resolveRegularSlot(m.slotA, groupPicks);
    let teamB;
    if (typeof m.slotB === 'string') {
      teamB = resolveRegularSlot(m.slotB, groupPicks);
    } else {
      // 3rd-place slot — auto-assigned
      const assignedId = thirdAssignments[m.id];
      teamB = assignedId ? getTeamById(assignedId) : null;
    }
    map[m.id] = {
      teamA,
      teamB,
      thirdSlot: m.slotB?.t3 ?? null, // eligible groups label (for UI)
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

export { buildMatchupMap };

// ─── Hook ─────────────────────────────────────────────────────────────────────
export default function useBracket() {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
  }, [state]);

  const loadBracketState = useCallback((newState) => {
    const merged = { ...initialState(), ...newState };
    setState(merged);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(merged)); } catch (_) {}
  }, []);

  const setGroupPick = useCallback((group, rank, teamId) => {
    setState((prev) => {
      const existing = prev.groupPicks[group] || {};
      const updated = { ...existing };

      // Clear this team from any rank it already holds
      if (teamId) {
        if (updated.first  === teamId && rank !== 'first')  updated.first  = null;
        if (updated.second === teamId && rank !== 'second') updated.second = null;
        if (updated.third  === teamId && rank !== 'third')  updated.third  = null;
      }

      updated[rank] = teamId;
      updated.fourth = deriveFourth(group, updated);

      // Clear this group's team from bestThirdPicks whenever group rankings change
      const groupTeamIds = GROUPS[group].teams.map((t) => t.id);
      const bestThirdPicks = prev.bestThirdPicks.filter((id) => !groupTeamIds.includes(id));

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

  const setStage    = useCallback((s)    => setState((p) => ({ ...p, stage: s })), []);
  const setUserName = useCallback((name) => setState((p) => ({ ...p, userName: name })), []);
  const resetAll    = useCallback(()     => setState(initialState()), []);

  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'wc2026-bracket.json'; a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const importJSON = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try { setState({ ...initialState(), ...JSON.parse(e.target.result) }); }
      catch (_) { alert('Invalid bracket file.'); }
    };
    reader.readAsText(file);
  }, []);

  // ── Derived ───────────────────────────────────────────────────────────────
  const groupsComplete = GROUP_LETTERS.every((g) => {
    const p = state.groupPicks[g];
    return p?.first && p?.second && p?.third;
  });

  const thirdPlaceTeams = GROUP_LETTERS.map((g) => {
    const picks = state.groupPicks[g];
    if (!picks?.third) return null;
    const team = getTeamById(picks.third);
    return team ? { ...team, group: g } : null;
  }).filter(Boolean);

  const bestThirdComplete = state.bestThirdPicks.length === 8;

  // Warn if the 8 selected teams can't be validly assigned (rare edge case)
  const thirdAssignmentValid =
    !bestThirdComplete || Object.keys(computeThirdAssignments(state.bestThirdPicks)).length === 8;

  const matchupMap = buildMatchupMap(state.groupPicks, state.bestThirdPicks, state.knockoutPicks);
  const madeKnockoutPicks = Object.values(state.knockoutPicks).filter((p) => p?.winnerId).length;

  const progress = {
    groupsDone: GROUP_LETTERS.filter((g) => {
      const p = state.groupPicks[g];
      return p?.first && p?.second && p?.third;
    }).length,
    groupsTotal: 12,
    knockoutDone: madeKnockoutPicks,
    knockoutTotal: 32,
    bestThirdDone: state.bestThirdPicks.length,
  };

  return {
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
    loadBracketState,
  };
}
