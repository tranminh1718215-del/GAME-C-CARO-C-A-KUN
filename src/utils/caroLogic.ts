import { CellValue, Player, WinCondition, AIDifficulty } from '../types/game';

export const BOARD_SIZE = 5;
export const TOTAL_CELLS = BOARD_SIZE * BOARD_SIZE;

export interface WinResult {
  winner: Player | 'DRAW' | null;
  winningCells: number[];
}

export interface HintResult {
  index: number;
  reason: string;
}

/**
 * Converts index (0-24) to row and column
 */
export function indexToCoord(index: number): { row: number; col: number } {
  return {
    row: Math.floor(index / BOARD_SIZE),
    col: index % BOARD_SIZE,
  };
}

/**
 * Converts row and column to index
 */
export function coordToIndex(row: number, col: number): number {
  return row * BOARD_SIZE + col;
}

/**
 * Coordinate notation: e.g. A1, B2, C3, etc.
 * Column 0-4 => A-E, Row 0-4 => 1-5
 */
export function indexToNotation(index: number): string {
  const { row, col } = indexToCoord(index);
  const colLetter = String.fromCharCode(65 + col); // A, B, C, D, E
  const rowNumber = row + 1; // 1, 2, 3, 4, 5
  return `${colLetter}${rowNumber}`;
}

/**
 * Check if a player has won
 */
export function checkWinner(board: CellValue[], winCondition: WinCondition): WinResult {
  const directions = [
    { dr: 0, dc: 1 },  // Ngang (Horizontal)
    { dr: 1, dc: 0 },  // Dọc (Vertical)
    { dr: 1, dc: 1 },  // Chéo chính (Main diagonal \)
    { dr: 1, dc: -1 }, // Chéo phụ (Anti diagonal /)
  ];

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const startIndex = coordToIndex(r, c);
      const player = board[startIndex];
      if (!player) continue;

      for (const { dr, dc } of directions) {
        const endR = r + (winCondition - 1) * dr;
        const endC = c + (winCondition - 1) * dc;

        if (endR >= 0 && endR < BOARD_SIZE && endC >= 0 && endC < BOARD_SIZE) {
          let hasLine = true;
          const lineCells: number[] = [];

          for (let step = 0; step < winCondition; step++) {
            const currR = r + step * dr;
            const currC = c + step * dc;
            const currIdx = coordToIndex(currR, currC);
            lineCells.push(currIdx);

            if (board[currIdx] !== player) {
              hasLine = false;
              break;
            }
          }

          if (hasLine) {
            return {
              winner: player,
              winningCells: lineCells,
            };
          }
        }
      }
    }
  }

  // Check draw (all cells filled)
  const isFull = board.every((cell) => cell !== null);
  if (isFull) {
    return { winner: 'DRAW', winningCells: [] };
  }

  return { winner: null, winningCells: [] };
}

/**
 * Returns candidate moves (cells adjacent to existing stones or center)
 */
function getCandidateMoves(board: CellValue[]): number[] {
  const candidates = new Set<number>();
  let hasAnyMove = false;

  for (let i = 0; i < TOTAL_CELLS; i++) {
    if (board[i] !== null) {
      hasAnyMove = true;
      const { row, col } = indexToCoord(i);
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = row + dr;
          const nc = col + dc;
          if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
            const nIdx = coordToIndex(nr, nc);
            if (board[nIdx] === null) {
              candidates.add(nIdx);
            }
          }
        }
      }
    }
  }

  if (!hasAnyMove) {
    return [12]; // Center cell C3
  }

  const list = Array.from(candidates);
  if (list.length === 0) {
    // Return all empty cells
    return board.map((v, i) => (v === null ? i : -1)).filter((i) => i !== -1);
  }

  return list;
}

/**
 * Static heuristic evaluation for a single position from perspective of `player`
 */
function evaluateCellScore(board: CellValue[], index: number, player: Player, winCondition: WinCondition): number {
  const opponent: Player = player === 'X' ? 'O' : 'X';
  const { row, col } = indexToCoord(index);

  const directions = [
    { dr: 0, dc: 1 },
    { dr: 1, dc: 0 },
    { dr: 1, dc: 1 },
    { dr: 1, dc: -1 },
  ];

  let attackScore = 0;
  let defenseScore = 0;

  // Center proximity bonus
  const distFromCenter = Math.abs(row - 2) + Math.abs(col - 2);
  const centerBonus = (4 - distFromCenter) * 15;

  for (const { dr, dc } of directions) {
    // Analyze attacking potential for player
    const att = countLinePattern(board, row, col, dr, dc, player, opponent, winCondition);
    attackScore += att;

    // Analyze defensive block potential for opponent
    const def = countLinePattern(board, row, col, dr, dc, opponent, player, winCondition);
    defenseScore += def * 1.15; // Slightly prioritize blocking critical threats
  }

  return attackScore + defenseScore + centerBonus;
}

function countLinePattern(
  board: CellValue[],
  r: number,
  c: number,
  dr: number,
  dc: number,
  targetPlayer: Player,
  blockingPlayer: Player,
  winCondition: WinCondition
): number {
  let consecutive = 1; // current cell considered as placed
  let openEnds = 0;

  // Forward direction
  let step = 1;
  while (true) {
    const nr = r + step * dr;
    const nc = c + step * dc;
    if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE) break;
    const val = board[coordToIndex(nr, nc)];
    if (val === targetPlayer) {
      consecutive++;
      step++;
    } else if (val === null) {
      openEnds++;
      break;
    } else {
      break; // Blocked by opponent
    }
  }

  // Backward direction
  step = 1;
  while (true) {
    const nr = r - step * dr;
    const nc = c - step * dc;
    if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE) break;
    const val = board[coordToIndex(nr, nc)];
    if (val === targetPlayer) {
      consecutive++;
      step++;
    } else if (val === null) {
      openEnds++;
      break;
    } else {
      break;
    }
  }

  if (consecutive >= winCondition) {
    return 100000; // Immediate win
  }

  if (winCondition === 4) {
    if (consecutive === 3 && openEnds === 2) return 15000; // Open 3 is lethal
    if (consecutive === 3 && openEnds === 1) return 3000;
    if (consecutive === 2 && openEnds === 2) return 800;
    if (consecutive === 2 && openEnds === 1) return 200;
    if (consecutive === 1 && openEnds === 2) return 50;
  } else {
    // Win condition 5
    if (consecutive === 4 && openEnds >= 1) return 20000;
    if (consecutive === 3 && openEnds === 2) return 4000;
    if (consecutive === 3 && openEnds === 1) return 1000;
    if (consecutive === 2 && openEnds === 2) return 400;
    if (consecutive === 2 && openEnds === 1) return 100;
  }

  return consecutive * 20;
}

/**
 * Minimax with Alpha-Beta pruning for HARD difficulty
 */
function minimax(
  board: CellValue[],
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  humanPlayer: Player,
  winCondition: WinCondition
): { score: number; move: number } {
  const winState = checkWinner(board, winCondition);
  if (winState.winner === aiPlayer) return { score: 100000 - (4 - depth) * 100, move: -1 };
  if (winState.winner === humanPlayer) return { score: -100000 + (4 - depth) * 100, move: -1 };
  if (winState.winner === 'DRAW' || depth === 0) {
    // Evaluate static heuristic
    let totalScore = 0;
    for (let i = 0; i < TOTAL_CELLS; i++) {
      if (board[i] === aiPlayer) {
        totalScore += evaluateCellScore(board, i, aiPlayer, winCondition);
      } else if (board[i] === humanPlayer) {
        totalScore -= evaluateCellScore(board, i, humanPlayer, winCondition);
      }
    }
    return { score: totalScore, move: -1 };
  }

  const candidates = getCandidateMoves(board);
  if (candidates.length === 0) return { score: 0, move: -1 };

  // Sort candidates by shallow evaluation for better alpha-beta cutoffs
  const currentPlayer = isMaximizing ? aiPlayer : humanPlayer;
  const scoredMoves = candidates.map((m) => {
    board[m] = currentPlayer;
    const score = evaluateCellScore(board, m, currentPlayer, winCondition);
    board[m] = null;
    return { move: m, score };
  });

  scoredMoves.sort((a, b) => b.score - a.score);

  let bestMove = scoredMoves[0].move;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const { move } of scoredMoves) {
      board[move] = aiPlayer;
      const evaluation = minimax(board, depth - 1, alpha, beta, false, aiPlayer, humanPlayer, winCondition).score;
      board[move] = null;

      if (evaluation > maxEval) {
        maxEval = evaluation;
        bestMove = move;
      }
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break; // Pruning
    }
    return { score: maxEval, move: bestMove };
  } else {
    let minEval = Infinity;
    for (const { move } of scoredMoves) {
      board[move] = humanPlayer;
      const evaluation = minimax(board, depth - 1, alpha, beta, true, aiPlayer, humanPlayer, winCondition).score;
      board[move] = null;

      if (evaluation < minEval) {
        minEval = evaluation;
        bestMove = move;
      }
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break; // Pruning
    }
    return { score: minEval, move: bestMove };
  }
}

/**
 * AI move selection based on difficulty
 */
export function getAIMove(
  board: CellValue[],
  aiPlayer: Player,
  difficulty: AIDifficulty,
  winCondition: WinCondition
): number {
  const opponent: Player = aiPlayer === 'X' ? 'O' : 'X';
  const candidates = getCandidateMoves(board);

  if (candidates.length === 0) {
    return 12; // Center
  }

  // Check instant winning move first for all levels
  for (const move of candidates) {
    board[move] = aiPlayer;
    const checkWin = checkWinner(board, winCondition);
    board[move] = null;
    if (checkWin.winner === aiPlayer) {
      return move;
    }
  }

  // Check instant blocking move for all levels
  for (const move of candidates) {
    board[move] = opponent;
    const checkWin = checkWinner(board, winCondition);
    board[move] = null;
    if (checkWin.winner === opponent) {
      return move;
    }
  }

  if (difficulty === 'EASY') {
    // 50% random chance or highest shallow score
    if (Math.random() < 0.45) {
      const randomIndex = Math.floor(Math.random() * candidates.length);
      return candidates[randomIndex];
    }
  }

  if (difficulty === 'MEDIUM') {
    // Pure heuristic with small jitter
    let bestScore = -Infinity;
    let bestMove = candidates[0];

    for (const move of candidates) {
      const score = evaluateCellScore(board, move, aiPlayer, winCondition) + (Math.random() * 20 - 10);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    return bestMove;
  }

  // HARD: Minimax with depth 3 + alpha beta
  const searchDepth = candidates.length > 18 ? 2 : 3;
  const result = minimax(
    [...board],
    searchDepth,
    -Infinity,
    Infinity,
    true,
    aiPlayer,
    opponent,
    winCondition
  );

  return result.move !== -1 ? result.move : candidates[0];
}

/**
 * Generate a smart hint for the player
 */
export function getSmartHint(
  board: CellValue[],
  player: Player,
  winCondition: WinCondition
): HintResult {
  const opponent: Player = player === 'X' ? 'O' : 'X';
  const candidates = getCandidateMoves(board);

  if (candidates.length === 0) {
    return { index: 12, reason: 'Chiếm vị trí trung tâm C3 để kiểm soát bàn cờ.' };
  }

  // Check winning move
  for (const move of candidates) {
    board[move] = player;
    const checkWin = checkWinner(board, winCondition);
    board[move] = null;
    if (checkWin.winner === player) {
      return {
        index: move,
        reason: `Đánh vào ${indexToNotation(move)} để hoàn thành chuỗi ${winCondition} quân và chiến thắng ngay!`,
      };
    }
  }

  // Check block move
  for (const move of candidates) {
    board[move] = opponent;
    const checkWin = checkWinner(board, winCondition);
    board[move] = null;
    if (checkWin.winner === opponent) {
      return {
        index: move,
        reason: `Bắt buộc chặn đối thủ tại ${indexToNotation(move)} để không bị thua!`,
      };
    }
  }

  // Find move with highest score
  let bestScore = -Infinity;
  let bestMove = candidates[0];

  for (const move of candidates) {
    const score = evaluateCellScore(board, move, player, winCondition);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  const { row, col } = indexToCoord(bestMove);
  let reason = `Nước đi chiến lược tại ${indexToNotation(bestMove)}: `;

  if (row === 2 && col === 2) {
    reason += 'Chiếm giữ ô trung tâm C3 tạo hướng công thủ đa diện.';
  } else if (bestScore > 1000) {
    reason += 'Tạo thế đôi hoặc chuỗi liên kết quân nguy hiểm.';
  } else {
    reason += 'Mở rộng thế trận và kiểm soát khu vực trung tâm.';
  }

  return {
    index: bestMove,
    reason,
  };
}
