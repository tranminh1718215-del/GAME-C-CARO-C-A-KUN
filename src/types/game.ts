export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type GameMode = 'AI' | 'PVP';
export type AIDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type WinCondition = 4 | 5;
export type BoardTheme = 'wood' | 'slate' | 'modern';

export interface Move {
  index: number;
  row: number;
  col: number;
  player: Player;
  timestamp: number;
}

export interface GameStats {
  gamesPlayed: number;
  xWins: number;
  oWins: number;
  draws: number;
  currentStreak: number;
  maxStreak: number;
}

export interface GameSettings {
  mode: GameMode;
  difficulty: AIDifficulty;
  winCondition: WinCondition;
  playerRole: Player; // Role of user in AI mode
  timerSeconds: number; // 0 for unlimited, 15, 30, 45
  soundEnabled: boolean;
  theme: BoardTheme;
}
