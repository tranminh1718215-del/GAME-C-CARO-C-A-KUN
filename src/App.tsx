/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  CellValue,
  Player,
  Move,
  GameSettings,
  GameStats,
} from './types/game';
import {
  TOTAL_CELLS,
  checkWinner,
  getAIMove,
  getSmartHint,
  indexToCoord,
} from './utils/caroLogic';
import { soundManager } from './utils/audio';
import { GameBoard } from './components/GameBoard';
import { ScoreBoard } from './components/ScoreBoard';
import { GameControls } from './components/GameControls';
import { SettingsModal } from './components/SettingsModal';
import { RulesModal } from './components/RulesModal';
import { StatsModal } from './components/StatsModal';
import { GameOverModal } from './components/GameOverModal';
import { Sparkles, Trophy, HelpCircle, RotateCcw, AlertTriangle } from 'lucide-react';

const DEFAULT_SETTINGS: GameSettings = {
  mode: 'AI',
  difficulty: 'MEDIUM',
  winCondition: 4, // 4-in-a-row is optimal and dynamic for 5x5
  playerRole: 'X',
  timerSeconds: 0,
  soundEnabled: true,
  theme: 'wood',
};

const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  xWins: 0,
  oWins: 0,
  draws: 0,
  currentStreak: 0,
  maxStreak: 0,
};

export default function App() {
  // Settings & Local Storage
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem('caro_5x5_settings');
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem('caro_5x5_stats');
      if (saved) return { ...DEFAULT_STATS, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    return DEFAULT_STATS;
  });

  // Game Board State
  const [board, setBoard] = useState<CellValue[]>(Array(TOTAL_CELLS).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'DRAW' | null>(null);
  const [winningCells, setWinningCells] = useState<number[]>([]);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Hints & Timer
  const [hintIndex, setHintIndex] = useState<number | null>(null);
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [turnTimeLeft, setTurnTimeLeft] = useState<number | null>(null);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(false);

  // Sync sound manager enabled state
  useEffect(() => {
    soundManager.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem('caro_5x5_settings', JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Persist stats
  useEffect(() => {
    try {
      localStorage.setItem('caro_5x5_stats', JSON.stringify(stats));
    } catch {
      // ignore
    }
  }, [stats]);

  // Reset/Start new game
  const startNewGame = useCallback(() => {
    setBoard(Array(TOTAL_CELLS).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningCells([]);
    setMoveHistory([]);
    setHintIndex(null);
    setHintMessage(null);
    setIsGameOverModalOpen(false);
    setIsAiThinking(false);

    if (settings.timerSeconds > 0) {
      setTurnTimeLeft(settings.timerSeconds);
    } else {
      setTurnTimeLeft(null);
    }
    soundManager.playClickSound();
  }, [settings.timerSeconds]);

  // Handle Win/Draw update statistics
  const handleGameEnd = useCallback(
    (winResult: Player | 'DRAW') => {
      setWinner(winResult);
      setIsGameOverModalOpen(true);

      if (winResult === 'DRAW') {
        soundManager.playDrawSound();
        setStats((prev) => ({
          ...prev,
          gamesPlayed: prev.gamesPlayed + 1,
          draws: prev.draws + 1,
          currentStreak: 0,
        }));
      } else {
        soundManager.playVictorySound();
        const isUserWinner =
          settings.mode === 'PVP' ? true : winResult === settings.playerRole;

        setStats((prev) => {
          const newXWins = winResult === 'X' ? prev.xWins + 1 : prev.xWins;
          const newOWins = winResult === 'O' ? prev.oWins + 1 : prev.oWins;
          const newStreak = isUserWinner ? prev.currentStreak + 1 : 0;
          const newMaxStreak = Math.max(prev.maxStreak, newStreak);

          return {
            ...prev,
            gamesPlayed: prev.gamesPlayed + 1,
            xWins: newXWins,
            oWins: newOWins,
            currentStreak: newStreak,
            maxStreak: newMaxStreak,
          };
        });
      }
    },
    [settings.mode, settings.playerRole]
  );

  // Execute a move on the board
  const makeMove = useCallback(
    (index: number, playerToMove: Player) => {
      if (board[index] !== null || winner !== null) return false;

      const newBoard = [...board];
      newBoard[index] = playerToMove;
      setBoard(newBoard);

      soundManager.playPlaceSound(playerToMove);

      // Record move
      const { row, col } = indexToCoord(index);
      const newMove: Move = {
        index,
        row,
        col,
        player: playerToMove,
        timestamp: Date.now(),
      };
      setMoveHistory((prev) => [...prev, newMove]);

      // Reset hint
      setHintIndex(null);
      setHintMessage(null);

      // Check win condition
      const result = checkWinner(newBoard, settings.winCondition);
      if (result.winner) {
        setWinningCells(result.winningCells);
        handleGameEnd(result.winner);
        return true;
      }

      // Switch turn
      const nextPlayer = playerToMove === 'X' ? 'O' : 'X';
      setCurrentPlayer(nextPlayer);

      if (settings.timerSeconds > 0) {
        setTurnTimeLeft(settings.timerSeconds);
      }

      return true;
    },
    [board, winner, settings.winCondition, settings.timerSeconds, handleGameEnd]
  );

  // AI Turn Logic trigger
  useEffect(() => {
    if (winner !== null) return;
    if (settings.mode !== 'AI') return;

    const isAiTurn =
      (settings.playerRole === 'X' && currentPlayer === 'O') ||
      (settings.playerRole === 'O' && currentPlayer === 'X');

    if (isAiTurn && !isAiThinking) {
      setIsAiThinking(true);
      const delay = Math.floor(Math.random() * 200) + 350; // 350-550ms realistic human-like rhythm

      const timerId = setTimeout(() => {
        const aiMove = getAIMove(
          board,
          currentPlayer,
          settings.difficulty,
          settings.winCondition
        );
        makeMove(aiMove, currentPlayer);
        setIsAiThinking(false);
      }, delay);

      return () => clearTimeout(timerId);
    }
  }, [
    currentPlayer,
    board,
    winner,
    settings.mode,
    settings.playerRole,
    settings.difficulty,
    settings.winCondition,
    isAiThinking,
    makeMove,
  ]);

  // Turn Countdown Timer
  useEffect(() => {
    if (winner !== null || settings.timerSeconds <= 0 || isAiThinking) return;

    if (turnTimeLeft === null) {
      setTurnTimeLeft(settings.timerSeconds);
      return;
    }

    if (turnTimeLeft <= 0) {
      // Timeout: switch turn or declare draw/loss
      const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
      setCurrentPlayer(nextPlayer);
      setTurnTimeLeft(settings.timerSeconds);
      return;
    }

    const interval = setInterval(() => {
      setTurnTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [turnTimeLeft, winner, settings.timerSeconds, currentPlayer, isAiThinking]);

  // User click on cell
  const handleCellClick = (index: number) => {
    if (winner !== null || isAiThinking) return;

    if (settings.mode === 'AI') {
      const isUserTurn = currentPlayer === settings.playerRole;
      if (!isUserTurn) return;
    }

    makeMove(index, currentPlayer);
  };

  // Undo feature
  const handleUndo = () => {
    if (moveHistory.length === 0 || winner !== null || isAiThinking) return;

    soundManager.playUndoSound();

    if (settings.mode === 'AI') {
      // In AI mode, undo 2 moves (both AI and User) so user is back on their turn
      // If AI hasn't moved yet (1 move total), undo 1 move
      const stepsToUndo = moveHistory.length >= 2 ? 2 : 1;
      const newHistory = moveHistory.slice(0, moveHistory.length - stepsToUndo);

      const newBoard: CellValue[] = Array(TOTAL_CELLS).fill(null);
      newHistory.forEach((m) => {
        newBoard[m.index] = m.player;
      });

      setBoard(newBoard);
      setMoveHistory(newHistory);
      setCurrentPlayer(settings.playerRole);
      setHintIndex(null);
      setHintMessage(null);
      setWinningCells([]);
      if (settings.timerSeconds > 0) setTurnTimeLeft(settings.timerSeconds);
    } else {
      // PVP mode: undo 1 move
      const newHistory = moveHistory.slice(0, moveHistory.length - 1);
      const newBoard: CellValue[] = Array(TOTAL_CELLS).fill(null);
      newHistory.forEach((m) => {
        newBoard[m.index] = m.player;
      });

      const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
      setBoard(newBoard);
      setMoveHistory(newHistory);
      setCurrentPlayer(nextPlayer);
      setHintIndex(null);
      setHintMessage(null);
      setWinningCells([]);
      if (settings.timerSeconds > 0) setTurnTimeLeft(settings.timerSeconds);
    }
  };

  // Smart Hint feature
  const handleHint = () => {
    if (winner !== null || isAiThinking) return;

    soundManager.playClickSound();

    if (hintIndex !== null) {
      // Toggle off
      setHintIndex(null);
      setHintMessage(null);
      return;
    }

    const hint = getSmartHint(board, currentPlayer, settings.winCondition);
    setHintIndex(hint.index);
    setHintMessage(hint.reason);
  };

  // Reset stats
  const handleResetStats = () => {
    setStats({ ...DEFAULT_STATS });
    soundManager.playClickSound();
  };

  const lastMoveIndex =
    moveHistory.length > 0 ? moveHistory[moveHistory.length - 1].index : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* 
        Mandatory Top Bar Contract (3 Zones, Single-Line, No Pills)
        Zone 1: Brand title
        Zone 2: Clean Nav links
        Zone 3: Primary Action
      */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-30">
        {/* Zone 1: Brand single text element */}
        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span>Cờ Caro 5x5</span>
        </h1>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
          <button
            onClick={() => {
              setSettings((prev) => ({ ...prev, mode: 'AI' }));
              startNewGame();
            }}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors ${
              settings.mode === 'AI' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Đấu với máy
          </button>
          <button
            onClick={() => {
              setSettings((prev) => ({ ...prev, mode: 'PVP' }));
              startNewGame();
            }}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors ${
              settings.mode === 'PVP' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Đấu 2 người
          </button>
          <button
            onClick={() => setIsRulesOpen(true)}
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Luật chơi
          </button>
          <button
            onClick={() => setIsStatsOpen(true)}
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Chiến tích
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={startNewGame}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white rounded-xl transition-all shadow-xs flex items-center gap-1.5 whitespace-nowrap active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ván mới</span>
          </button>
        </div>
      </header>

      {/* Main Game Arena */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 max-w-4xl mx-auto w-full">
        {/* Game Mode / Difficulty Pill-Free Subtitle */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3 select-none">
          <span>{settings.mode === 'AI' ? 'Chế độ AI' : '2 Người chơi'}</span>
          {settings.mode === 'AI' && (
            <>
              <span aria-hidden="true">·</span>
              <span>Độ khó {settings.difficulty === 'EASY' ? 'Dễ' : settings.difficulty === 'MEDIUM' ? 'Kỳ thủ' : 'Cao thủ'}</span>
            </>
          )}
          <span aria-hidden="true">·</span>
          <span>Luật {settings.winCondition} quân</span>
          {isAiThinking && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-medium animate-pulse">
                Máy tính đang suy nghĩ...
              </span>
            </>
          )}
        </div>

        {/* Turn & Score Display */}
        <ScoreBoard
          currentPlayer={currentPlayer}
          winner={winner}
          mode={settings.mode}
          userRole={settings.playerRole}
          stats={stats}
          turnTimeLeft={turnTimeLeft}
          winCondition={settings.winCondition}
          moveCount={moveHistory.length}
        />

        {/* Interactive 5x5 Game Board */}
        <GameBoard
          board={board}
          currentPlayer={currentPlayer}
          onCellClick={handleCellClick}
          disabled={winner !== null || isAiThinking}
          winningCells={winningCells}
          lastMoveIndex={lastMoveIndex}
          hintIndex={hintIndex}
          theme={settings.theme}
        />

        {/* Active Strategic Hint Card */}
        {hintMessage && (
          <div className="w-full max-w-lg mt-3 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-700 dark:text-emerald-400">💡 Gợi ý:</span>
              <span>{hintMessage}</span>
            </div>
            <button
              onClick={() => {
                setHintIndex(null);
                setHintMessage(null);
              }}
              className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline ml-2 text-[11px]"
            >
              Ẩn
            </button>
          </div>
        )}

        {/* Tactical Game Controls */}
        <GameControls
          onNewGame={startNewGame}
          onUndo={handleUndo}
          canUndo={moveHistory.length > 0 && winner === null && !isAiThinking}
          onHint={handleHint}
          isHintActive={hintIndex !== null}
          canHint={winner === null && !isAiThinking && (settings.mode === 'PVP' || currentPlayer === settings.playerRole)}
          soundEnabled={settings.soundEnabled}
          onToggleSound={() =>
            setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
          }
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenRules={() => setIsRulesOpen(true)}
          onOpenStats={() => setIsStatsOpen(true)}
          isGameOver={winner !== null}
        />
      </main>

      {/* Modals & Dialogs */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={(newSettings) => {
          setSettings(newSettings);
          // If win condition or player role changed, restart board
          if (
            newSettings.winCondition !== settings.winCondition ||
            newSettings.mode !== settings.mode ||
            newSettings.playerRole !== settings.playerRole
          ) {
            setBoard(Array(TOTAL_CELLS).fill(null));
            setCurrentPlayer('X');
            setWinner(null);
            setWinningCells([]);
            setMoveHistory([]);
            setHintIndex(null);
            setHintMessage(null);
          }
        }}
      />

      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        onResetStats={handleResetStats}
      />

      <GameOverModal
        winner={winner}
        mode={settings.mode}
        userRole={settings.playerRole}
        onPlayAgain={startNewGame}
        moveCount={moveHistory.length}
      />
    </div>
  );
}
