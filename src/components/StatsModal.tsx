import React from 'react';
import { GameStats } from '../types/game';
import { X, Trophy, RotateCcw, Award, Flame } from 'lucide-react';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  onResetStats: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  onResetStats,
}) => {
  if (!isOpen) return null;

  const total = stats.gamesPlayed;
  const xPercent = total > 0 ? Math.round((stats.xWins / total) * 100) : 0;
  const oPercent = total > 0 ? Math.round((stats.oWins / total) * 100) : 0;
  const drawPercent = total > 0 ? Math.round((stats.draws / total) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base">Thống kê chiến tích</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng bảng thống kê"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Main Counters */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-medium text-slate-500 block mb-0.5">Tổng số ván</span>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">{total}</span>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50">
              <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400 flex items-center justify-center gap-1 mb-0.5">
                <Flame className="w-3 h-3 text-amber-500" /> Chuỗi thắng
              </span>
              <span className="text-xl font-bold font-mono text-amber-900 dark:text-amber-200">
                {stats.currentStreak}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
              <span className="text-[11px] font-medium text-indigo-700 dark:text-indigo-400 flex items-center justify-center gap-1 mb-0.5">
                <Award className="w-3 h-3 text-indigo-500" /> Kỷ lục chuỗi
              </span>
              <span className="text-xl font-bold font-mono text-indigo-900 dark:text-indigo-200">
                {stats.maxStreak}
              </span>
            </div>
          </div>

          {/* Breakdown bars */}
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <span>✕</span> Thắng ({stats.xWins})
                </span>
                <span className="font-mono text-slate-500">{xPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${xPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-rose-500 dark:text-rose-400 flex items-center gap-1">
                  <span>○</span> Thắng ({stats.oWins})
                </span>
                <span className="font-mono text-slate-500">{oPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${oPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-600 dark:text-slate-400">
                  Hòa ({stats.draws})
                </span>
                <span className="font-mono text-slate-500">{drawPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-slate-400 dark:bg-slate-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${drawPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onResetStats}
            className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 transition-colors font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại thống kê</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs sm:text-sm font-medium text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-xl hover:bg-slate-800 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
