import React from 'react';
import { Player, GameMode, GameStats, WinCondition } from '../types/game';
import { User, Bot, Clock } from 'lucide-react';

interface ScoreBoardProps {
  currentPlayer: Player;
  winner: Player | 'DRAW' | null;
  mode: GameMode;
  userRole: Player;
  stats: GameStats;
  turnTimeLeft: number | null;
  winCondition: WinCondition;
  moveCount: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  currentPlayer,
  winner,
  mode,
  userRole,
  stats,
  turnTimeLeft,
  winCondition,
  moveCount,
}) => {
  const isXTurn = currentPlayer === 'X' && !winner;
  const isOTurn = currentPlayer === 'O' && !winner;

  const isXHuman = mode === 'PVP' || userRole === 'X';
  const isOHuman = mode === 'PVP' || userRole === 'O';

  return (
    <div className="w-full max-w-lg mb-4">
      {/* Player Turn Cards */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Player X Card */}
        <div
          className={`p-3 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
            isXTurn
              ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-400 dark:border-blue-600 shadow-md ring-2 ring-blue-400/40'
              : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-80'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 text-xl shadow-xs">
              ✕
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <span>{mode === 'PVP' ? 'Người chơi 1' : isXHuman ? 'Bạn (X)' : 'Máy (X)'}</span>
                {isXHuman ? (
                  <User className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <Bot className="w-3.5 h-3.5 text-blue-500" />
                )}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Thắng: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{stats.xWins}</span>
              </div>
            </div>
          </div>

          {isXTurn && turnTimeLeft !== null && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-mono font-bold">
              <Clock className="w-3 h-3" />
              <span>{turnTimeLeft}s</span>
            </div>
          )}
        </div>

        {/* Player O Card */}
        <div
          className={`p-3 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
            isOTurn
              ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-400 dark:border-rose-600 shadow-md ring-2 ring-rose-400/40'
              : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-80'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center font-bold text-rose-500 dark:text-rose-400 text-xl shadow-xs">
              ○
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <span>{mode === 'PVP' ? 'Người chơi 2' : isOHuman ? 'Bạn (O)' : 'Máy (O)'}</span>
                {isOHuman ? (
                  <User className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <Bot className="w-3.5 h-3.5 text-rose-500" />
                )}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Thắng: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{stats.oWins}</span>
              </div>
            </div>
          </div>

          {isOTurn && turnTimeLeft !== null && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-mono font-bold">
              <Clock className="w-3 h-3" />
              <span>{turnTimeLeft}s</span>
            </div>
          )}
        </div>
      </div>

      {/* Match Meta & Current Status Info */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-500 dark:text-slate-400 select-none">
        <div className="flex items-center gap-2">
          <span>Luật: <strong className="text-slate-700 dark:text-slate-200">{winCondition} quân liên tiếp</strong></span>
          <span aria-hidden="true">·</span>
          <span>Hòa: <strong className="font-mono text-slate-700 dark:text-slate-200">{stats.draws}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <span>Nước đi: <strong className="font-mono text-slate-700 dark:text-slate-200">{moveCount}</strong>/25</span>
          {stats.currentStreak > 1 && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                Chuỗi {stats.currentStreak}🔥
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
