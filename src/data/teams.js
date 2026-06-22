// FIFA World Cup 2026 — 48 teams in 12 groups (official confirmed groups)

export const GROUPS = {
  A: {
    teams: [
      { id: 'MEX', name: 'Mexico',      flag: '🇲🇽', confederation: 'CONCACAF' },
      { id: 'KOR', name: 'South Korea', flag: '🇰🇷', confederation: 'AFC' },
      { id: 'RSA', name: 'South Africa',flag: '🇿🇦', confederation: 'CAF' },
      { id: 'CZE', name: 'Czechia',     flag: '🇨🇿', confederation: 'UEFA' },
    ],
  },
  B: {
    teams: [
      { id: 'CAN', name: 'Canada',                flag: '🇨🇦', confederation: 'CONCACAF' },
      { id: 'SUI', name: 'Switzerland',            flag: '🇨🇭', confederation: 'UEFA' },
      { id: 'QAT', name: 'Qatar',                  flag: '🇶🇦', confederation: 'AFC' },
      { id: 'BIH', name: 'Bosnia & Herzegovina',   flag: '🇧🇦', confederation: 'UEFA' },
    ],
  },
  C: {
    teams: [
      { id: 'BRA', name: 'Brazil',  flag: '🇧🇷', confederation: 'CONMEBOL' },
      { id: 'MAR', name: 'Morocco', flag: '🇲🇦', confederation: 'CAF' },
      { id: 'SCO', name: 'Scotland',flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', confederation: 'UEFA' },
      { id: 'HAI', name: 'Haiti',   flag: '🇭🇹', confederation: 'CONCACAF' },
    ],
  },
  D: {
    teams: [
      { id: 'USA', name: 'United States', flag: '🇺🇸', confederation: 'CONCACAF' },
      { id: 'AUS', name: 'Australia',     flag: '🇦🇺', confederation: 'AFC' },
      { id: 'PAR', name: 'Paraguay',      flag: '🇵🇾', confederation: 'CONMEBOL' },
      { id: 'TUR', name: 'Türkiye',       flag: '🇹🇷', confederation: 'UEFA' },
    ],
  },
  E: {
    teams: [
      { id: 'GER', name: 'Germany',     flag: '🇩🇪', confederation: 'UEFA' },
      { id: 'ECU', name: 'Ecuador',     flag: '🇪🇨', confederation: 'CONMEBOL' },
      { id: 'CIV', name: 'Ivory Coast', flag: '🇨🇮', confederation: 'CAF' },
      { id: 'CUW', name: 'Curaçao',     flag: '🇨🇼', confederation: 'CONCACAF' },
    ],
  },
  F: {
    teams: [
      { id: 'NED', name: 'Netherlands', flag: '🇳🇱', confederation: 'UEFA' },
      { id: 'JPN', name: 'Japan',       flag: '🇯🇵', confederation: 'AFC' },
      { id: 'SWE', name: 'Sweden',      flag: '🇸🇪', confederation: 'UEFA' },
      { id: 'TUN', name: 'Tunisia',     flag: '🇹🇳', confederation: 'CAF' },
    ],
  },
  G: {
    teams: [
      { id: 'BEL', name: 'Belgium',     flag: '🇧🇪', confederation: 'UEFA' },
      { id: 'IRN', name: 'Iran',        flag: '🇮🇷', confederation: 'AFC' },
      { id: 'EGY', name: 'Egypt',       flag: '🇪🇬', confederation: 'CAF' },
      { id: 'NZL', name: 'New Zealand', flag: '🇳🇿', confederation: 'OFC' },
    ],
  },
  H: {
    teams: [
      { id: 'SPA', name: 'Spain',        flag: '🇪🇸', confederation: 'UEFA' },
      { id: 'URU', name: 'Uruguay',      flag: '🇺🇾', confederation: 'CONMEBOL' },
      { id: 'SAU', name: 'Saudi Arabia', flag: '🇸🇦', confederation: 'AFC' },
      { id: 'CPV', name: 'Cape Verde',   flag: '🇨🇻', confederation: 'CAF' },
    ],
  },
  I: {
    teams: [
      { id: 'FRA', name: 'France',  flag: '🇫🇷', confederation: 'UEFA' },
      { id: 'SEN', name: 'Senegal', flag: '🇸🇳', confederation: 'CAF' },
      { id: 'IRQ', name: 'Iraq',    flag: '🇮🇶', confederation: 'AFC' },
      { id: 'NOR', name: 'Norway',  flag: '🇳🇴', confederation: 'UEFA' },
    ],
  },
  J: {
    teams: [
      { id: 'ARG', name: 'Argentina', flag: '🇦🇷', confederation: 'CONMEBOL' },
      { id: 'ALG', name: 'Algeria',   flag: '🇩🇿', confederation: 'CAF' },
      { id: 'AUT', name: 'Austria',   flag: '🇦🇹', confederation: 'UEFA' },
      { id: 'JOR', name: 'Jordan',    flag: '🇯🇴', confederation: 'AFC' },
    ],
  },
  K: {
    teams: [
      { id: 'POR', name: 'Portugal',   flag: '🇵🇹', confederation: 'UEFA' },
      { id: 'COL', name: 'Colombia',   flag: '🇨🇴', confederation: 'CONMEBOL' },
      { id: 'UZB', name: 'Uzbekistan', flag: '🇺🇿', confederation: 'AFC' },
      { id: 'COD', name: 'DR Congo',   flag: '🇨🇩', confederation: 'CAF' },
    ],
  },
  L: {
    teams: [
      { id: 'ENG', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', confederation: 'UEFA' },
      { id: 'CRO', name: 'Croatia', flag: '🇭🇷', confederation: 'UEFA' },
      { id: 'GHA', name: 'Ghana',   flag: '🇬🇭', confederation: 'CAF' },
      { id: 'PAN', name: 'Panama',  flag: '🇵🇦', confederation: 'CONCACAF' },
    ],
  },
};

export const GROUP_LETTERS = Object.keys(GROUPS);

// Official 2026 Round of 32 matchups.
// slotA / slotB: '1X' = winner of group X, '2X' = runner-up of group X.
// For third-place slots, use { t3: ['X','Y',...] } — the eligible groups
// whose 3rd-place finisher can fill that slot. Auto-assignment is computed
// via constraint solving once the user selects their 8 best 3rd-place teams.
export const R32_MATCHUPS = [
  { id: 'R32_1',  slotA: '2A', slotB: '2B' },                              // Runner-up A vs Runner-up B
  { id: 'R32_2',  slotA: '1E', slotB: { t3: ['A','B','C','D','F'] } },     // Winner E vs 3rd (A/B/C/D/F)
  { id: 'R32_3',  slotA: '2F', slotB: '2C' },                              // Runner-up F vs Runner-up C
  { id: 'R32_4',  slotA: '1C', slotB: '2F' },                              // Winner C vs Runner-up F
  { id: 'R32_5',  slotA: '1I', slotB: { t3: ['C','D','F','G','H'] } },     // Winner I vs 3rd (C/D/F/G/H)
  { id: 'R32_6',  slotA: '2E', slotB: '2I' },                              // Runner-up E vs Runner-up I
  { id: 'R32_7',  slotA: '1A', slotB: { t3: ['C','E','F','H','I'] } },     // Winner A vs 3rd (C/E/F/H/I)
  { id: 'R32_8',  slotA: '1L', slotB: { t3: ['E','H','I','J','K'] } },     // Winner L vs 3rd (E/H/I/J/K)
  { id: 'R32_9',  slotA: '1D', slotB: { t3: ['B','E','F','I','J'] } },     // Winner D vs 3rd (B/E/F/I/J)
  { id: 'R32_10', slotA: '1G', slotB: { t3: ['A','E','H','I','J'] } },     // Winner G vs 3rd (A/E/H/I/J)
  { id: 'R32_11', slotA: '2K', slotB: '2L' },                              // Runner-up K vs Runner-up L
  { id: 'R32_12', slotA: '1H', slotB: '2J' },                              // Winner H vs Runner-up J
  { id: 'R32_13', slotA: '1B', slotB: { t3: ['E','F','G','I','J'] } },     // Winner B vs 3rd (E/F/G/I/J)
  { id: 'R32_14', slotA: '1J', slotB: '2H' },                              // Winner J vs Runner-up H
  { id: 'R32_15', slotA: '1K', slotB: { t3: ['D','E','I','J','L'] } },     // Winner K vs 3rd (D/E/I/J/L)
  { id: 'R32_16', slotA: '2D', slotB: '2G' },                              // Runner-up D vs Runner-up G
];

// Third-place slots in bracket order (used for assignment UI)
export const THIRD_PLACE_SLOTS = R32_MATCHUPS
  .filter(m => m.slotB?.t3)
  .map(m => ({ matchId: m.id, groups: m.slotB.t3 }));

export const R16_MATCHUPS = [
  { id: 'R16_1', fromA: 'R32_1',  fromB: 'R32_2' },
  { id: 'R16_2', fromA: 'R32_3',  fromB: 'R32_4' },
  { id: 'R16_3', fromA: 'R32_5',  fromB: 'R32_6' },
  { id: 'R16_4', fromA: 'R32_7',  fromB: 'R32_8' },
  { id: 'R16_5', fromA: 'R32_9',  fromB: 'R32_10' },
  { id: 'R16_6', fromA: 'R32_11', fromB: 'R32_12' },
  { id: 'R16_7', fromA: 'R32_13', fromB: 'R32_14' },
  { id: 'R16_8', fromA: 'R32_15', fromB: 'R32_16' },
];

export const QF_MATCHUPS = [
  { id: 'QF_1', fromA: 'R16_1', fromB: 'R16_2' },
  { id: 'QF_2', fromA: 'R16_3', fromB: 'R16_4' },
  { id: 'QF_3', fromA: 'R16_5', fromB: 'R16_6' },
  { id: 'QF_4', fromA: 'R16_7', fromB: 'R16_8' },
];

export const SF_MATCHUPS = [
  { id: 'SF_1', fromA: 'QF_1', fromB: 'QF_2' },
  { id: 'SF_2', fromA: 'QF_3', fromB: 'QF_4' },
];

export const FINAL_MATCHUP       = { id: 'FINAL', fromA: 'SF_1', fromB: 'SF_2' };
export const THIRD_PLACE_MATCHUP = { id: 'THIRD', fromLoserA: 'SF_1', fromLoserB: 'SF_2' };
