// FIFA World Cup 2026 - 48 teams in 12 groups
// Groups based on official FIFA 2026 draw (December 2024)

export const GROUPS = {
  A: {
    teams: [
      { id: 'USA', name: 'United States', flag: '🇺🇸', confederation: 'CONCACAF' },
      { id: 'PAN', name: 'Panama', flag: '🇵🇦', confederation: 'CONCACAF' },
      { id: 'URU', name: 'Uruguay', flag: '🇺🇾', confederation: 'CONMEBOL' },
      { id: 'BOL', name: 'Bolivia', flag: '🇧🇴', confederation: 'CONMEBOL' },
    ],
  },
  B: {
    teams: [
      { id: 'ARG', name: 'Argentina', flag: '🇦🇷', confederation: 'CONMEBOL' },
      { id: 'CHI', name: 'Chile', flag: '🇨🇱', confederation: 'CONMEBOL' },
      { id: 'MAR', name: 'Morocco', flag: '🇲🇦', confederation: 'CAF' },
      { id: 'UKR', name: 'Ukraine', flag: '🇺🇦', confederation: 'UEFA' },
    ],
  },
  C: {
    teams: [
      { id: 'MEX', name: 'Mexico', flag: '🇲🇽', confederation: 'CONCACAF' },
      { id: 'ECU', name: 'Ecuador', flag: '🇪🇨', confederation: 'CONMEBOL' },
      { id: 'CRO', name: 'Croatia', flag: '🇭🇷', confederation: 'UEFA' },
      { id: 'SEN', name: 'Senegal', flag: '🇸🇳', confederation: 'CAF' },
    ],
  },
  D: {
    teams: [
      { id: 'POR', name: 'Portugal', flag: '🇵🇹', confederation: 'UEFA' },
      { id: 'BRA', name: 'Brazil', flag: '🇧🇷', confederation: 'CONMEBOL' },
      { id: 'ENG', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', confederation: 'UEFA' },
      { id: 'TRI', name: 'Trinidad & Tobago', flag: '🇹🇹', confederation: 'CONCACAF' },
    ],
  },
  E: {
    teams: [
      { id: 'COD', name: 'DR Congo', flag: '🇨🇩', confederation: 'CAF' },
      { id: 'GER', name: 'Germany', flag: '🇩🇪', confederation: 'UEFA' },
      { id: 'JPN', name: 'Japan', flag: '🇯🇵', confederation: 'AFC' },
      { id: 'PAR', name: 'Paraguay', flag: '🇵🇾', confederation: 'CONMEBOL' },
    ],
  },
  F: {
    teams: [
      { id: 'SPA', name: 'Spain', flag: '🇪🇸', confederation: 'UEFA' },
      { id: 'NED', name: 'Netherlands', flag: '🇳🇱', confederation: 'UEFA' },
      { id: 'TUR', name: 'Turkey', flag: '🇹🇷', confederation: 'UEFA' },
      { id: 'IDN', name: 'Indonesia', flag: '🇮🇩', confederation: 'AFC' },
    ],
  },
  G: {
    teams: [
      { id: 'CAN', name: 'Canada', flag: '🇨🇦', confederation: 'CONCACAF' },
      { id: 'COL', name: 'Colombia', flag: '🇨🇴', confederation: 'CONMEBOL' },
      { id: 'AUS', name: 'Australia', flag: '🇦🇺', confederation: 'AFC' },
      { id: 'CMR', name: 'Cameroon', flag: '🇨🇲', confederation: 'CAF' },
    ],
  },
  H: {
    teams: [
      { id: 'FRA', name: 'France', flag: '🇫🇷', confederation: 'UEFA' },
      { id: 'BEL', name: 'Belgium', flag: '🇧🇪', confederation: 'UEFA' },
      { id: 'NGA', name: 'Nigeria', flag: '🇳🇬', confederation: 'CAF' },
      { id: 'VNM', name: 'Vietnam', flag: '🇻🇳', confederation: 'AFC' },
    ],
  },
  I: {
    teams: [
      { id: 'KOR', name: 'South Korea', flag: '🇰🇷', confederation: 'AFC' },
      { id: 'NOR', name: 'Norway', flag: '🇳🇴', confederation: 'UEFA' },
      { id: 'CRI', name: 'Costa Rica', flag: '🇨🇷', confederation: 'CONCACAF' },
      { id: 'GRE', name: 'Greece', flag: '🇬🇷', confederation: 'UEFA' },
    ],
  },
  J: {
    teams: [
      { id: 'SAU', name: 'Saudi Arabia', flag: '🇸🇦', confederation: 'AFC' },
      { id: 'DEN', name: 'Denmark', flag: '🇩🇰', confederation: 'UEFA' },
      { id: 'ALG', name: 'Algeria', flag: '🇩🇿', confederation: 'CAF' },
      { id: 'SUI', name: 'Switzerland', flag: '🇨🇭', confederation: 'UEFA' },
    ],
  },
  K: {
    teams: [
      { id: 'IRN', name: 'Iran', flag: '🇮🇷', confederation: 'AFC' },
      { id: 'NZL', name: 'New Zealand', flag: '🇳🇿', confederation: 'OFC' },
      { id: 'ITA', name: 'Italy', flag: '🇮🇹', confederation: 'UEFA' },
      { id: 'SRB', name: 'Serbia', flag: '🇷🇸', confederation: 'UEFA' },
    ],
  },
  L: {
    teams: [
      { id: 'AUT', name: 'Austria', flag: '🇦🇹', confederation: 'UEFA' },
      { id: 'VEN', name: 'Venezuela', flag: '🇻🇪', confederation: 'CONMEBOL' },
      { id: 'EGY', name: 'Egypt', flag: '🇪🇬', confederation: 'CAF' },
      { id: 'PER', name: 'Peru', flag: '🇵🇪', confederation: 'CONMEBOL' },
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

export const FINAL_MATCHUP = { id: 'FINAL', fromA: 'SF_1', fromB: 'SF_2' };
export const THIRD_PLACE_MATCHUP = { id: 'THIRD', fromLoserA: 'SF_1', fromLoserB: 'SF_2' };
