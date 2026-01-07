
export interface GuessRecord {
  value: number;
  result: 'higher' | 'lower' | 'correct';
  timestamp: number;
}

export interface GameState {
  target: number;
  guesses: GuessRecord[];
  isGameOver: boolean;
  status: 'idle' | 'playing' | 'won' | 'lost';
}

export type ConnectionStatus = 'idle' | 'testing' | 'success' | 'error';
