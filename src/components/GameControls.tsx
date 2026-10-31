import React from 'react';
import { RotateCcw, Undo2, Lightbulb, Volume2, VolumeX, Settings, HelpCircle, BarChart3 } from 'lucide-react';

interface GameControlsProps {
  onNewGame: () => void;
  onUndo: () => void;
  canUndo: boolean;
  onHint: () => void;
  isHintActive: boolean;
  canHint: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  onOpenRules: () => void;
  onOpenStats: () => void;
  isGameOver: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onNewGame,
  onUndo,
  canUndo,
  onHint,
  isHintActive,
  canHint,
  soundEnabled,
  onToggleSound,
  onOpenSettings,
  onOpenRules,
  onOpenStats,
  isGameOver,
}) => {
  return (
    <div className="w-full max-w-lg mt-4 flex flex-col gap-3">
      {/* Primary Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={onNewGame}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-medium text-xs sm:text-sm transition-all duration-150 shadow-sm active:scale-95 ${
            isGameOver
              ? 'bg-amber-500 hover:bg-amber-600 text-white ring-2 ring-amber-400 ring-offset-2 animate-pulse'
              : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span className="whitespace-nowrap">Ván mới</span>
        </button>

        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-medium text-xs sm:text-sm border transition-all duration-150 shadow-xs active:scale-95 ${
            canUndo
              ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700'
              : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800/40 dark:text-slate-600 dark:border-slate-800 cursor-not-allowed'
          }`}
        >
          <Undo2 className="w-4 h-4" />
          <span className="whitespace-nowrap">Đi lại</span>
        </button>

        <button
          type="button"
          onClick={onHint}
          disabled={!canHint}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-medium text-xs sm:text-sm border transition-all duration-150 shadow-xs active:scale-95 ${
            isHintActive
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-200'
              : canHint
              ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800'
              : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800/40 dark:text-slate-600 dark:border-slate-800 cursor-not-allowed'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span className="whitespace-nowrap">Gợi ý</span>
        </button>
      </div>

      {/* Auxiliary Icon Buttons */}
      <div className="flex items-center justify-between px-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          <button
            type="button"
            onClick={onOpenStats}
            aria-label="Xem bảng thống kê"
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onOpenRules}
            aria-label="Hướng dẫn luật chơi Caro"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Luật chơi</span>
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Cài đặt trò chơi"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Cài đặt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
