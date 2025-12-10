export enum SportType {
  FOOTBALL = 'Football',
  BASKETBALL = 'Basketball',
  TENNIS = 'Tennis',
  AMERICAN_FOOTBALL = 'American Football',
  ICE_HOCKEY = 'Ice Hockey',
  BASEBALL = 'Baseball',
  CRICKET = 'Cricket',
  RUGBY = 'Rugby',
  ESPORTS = 'Esports',
  VOLLEYBALL = 'Volleyball',
  MIXED = 'Mixed Sports'
}

export enum RiskLevel {
  SAFE = 'Safe (Low Odds)',
  BALANCED = 'Balanced',
  HIGH_YIELD = 'High Yield (Risky)'
}

export enum AppMode {
  ACCUMULATOR = '24h Accumulator',
  LIVE = 'Live Scanner',
  BET_BUILDER = 'Bet Builder'
}

export interface MatchData {
  homeTeam: string;
  awayTeam: string;
  league: string;
  country: string;
  startTime: string;
  prediction: string;
  market: string;
  odds: number;
  confidence: number;
  reasoning: string;
  // Live Data
  isLive?: boolean;
  currentScore?: string;
  matchTime?: string; // e.g. "35'", "2nd Qtr"
}

export interface SourceLink {
  title: string;
  url: string;
}

export interface Ticket {
  id: string;
  name: string; // e.g. "The Safe 6-Fold", "Power Treble"
  totalOdds: number;
  matches: MatchData[];
  analysisSummary: string;
}

export interface AccumulatorResult {
  id: string;
  tickets: Ticket[]; // Array of generated options
  generatedAt: string;
  mode?: AppMode;
  sport?: SportType;
  sources?: SourceLink[];
  selectedMarkets?: string[]; // Added for Bet Builder context
}