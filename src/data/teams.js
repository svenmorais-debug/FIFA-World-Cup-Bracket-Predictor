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
      { id: 'CAN', name: 'Canada',               flag: '🇨🇦', confederation: 'CONCACAF' },
      { id: 'SUI', name: 'Switzerland',           flag: '🇨🇭', confederation: 'UEFA' },
      { id: 'QAT', name: 'Qatar',                 flag: '🇶🇦', confederation: 'AFC' },
      { id: 'BIH', name: 'Bosnia and Herzegovina',flag: '🇧🇦', confederation: 'UEFA' },
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
      { id: 'GER', name: 'Germany',      flag: '🇩🇪', confederation: 'UEFA' },
      { id: 'ECU', name: 'Ecuador',      flag: '🇪🇨', confederation: 'CONMEBOL' },
      { id: 'CIV', name: 'Ivory Coast',  flag: '🇨🇮', confederation: 'CAF' },
      { id: 'CUW', name: 'Curaçao',      flag: '🇨🇼', confederation: 'CONCACAF' },
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
      { id: 'SPA', name: 'Spain',       flag: '🇪🇸', confederation: 'UEFA' },
      { id: 'URU', name: 'Uruguay',     flag: '🇺🇾', confederation: 'CONMEBOL' },
      { id: 'SAU', name: 'Saudi Arabia',flag: '🇸🇦', confederation: 'AFC' },
      { id: 'CPV', name: 'Cape Verde',  flag: '🇨🇻', confederation: 'CAF' },
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
      { id: 'POR', name: 'Portugal',  flag: '🇵🇹', confederation: 'UEFA' },
      { id: 'COL', name: 'Colombia',  flag: '🇨🇴', confederation: 'CONMEBOL' },
      { id: 'UZB', name: 'Uzbekistan',flag: '🇺🇿', confederation: 'AFC' },
      { id: 'COD', name: 'DR Congo',  flag: '🇨🇩', confederation: 'CAF' },
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

// Official 2026 R32 bracket matchup slot assignments
// 32 slots: 12 group winners (1A–1L), 12 runners-up (2A–2L), 8 best 3rd place (T1–T8)
export const R32_MATCHUPS = [
  { id: 'R32_1',  slotA: '1A',  slotB: '2C' },
  { id: 'R32_2',  slotA: '1C',  slotB: '2A' },
  { id: 'R32_3',  slotA: '1B',  slotB: '2D' },
  { id: 'R32_4',  slotA: '1D',  slotB: '2B' },
  { id: 'R32_5',  slotA: '1E',  slotB: '2G' },
  { id: 'R32_6',  slotA: '1G',  slotB: '2E' },
  { id: 'R32_7',  slotA: '1F',  slotB: '2H' },
  { id: 'R32_8',  slotA: '1H',  slotB: '2F' },
  { id: 'R32_9',  slotA: '1I',  slotB: '2K' },
  { id: 'R32_10', slotA: '1K',  slotB: '2I' },
  { id: 'R32_11', slotA: '1J',  slotB: '2L' },
  { id: 'R32_12', slotA: '1L',  slotB: '2J' },
  { id: 'R32_13', slotA: 'T1',  slotB: 'T4' },
  { id: 'R32_14', slotA: 'T2',  slotB: 'T5' },
  { id: 'R32_15', slotA: 'T3',  slotB: 'T6' },
  { id: 'R32_16', slotA: 'T7',  slotB: 'T8' },
];

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

export const FINAL_MATCHUP      = { id: 'FINAL', fromA: 'SF_1', fromB: 'SF_2' };
export const THIRD_PLACE_MATCHUP = { id: 'THIRD', fromLoserA: 'SF_1', fromLoserB: 'SF_2' };
