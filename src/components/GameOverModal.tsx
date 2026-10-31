import React, { useEffect } from 'react';
import { Player, GameMode } from '../types/game';
import confetti from 'canvas-confetti';
import { Trophy, Frown, Equal, RotateCcw } from 'lucide-react';

interface GameOverModalProps {
  winner: Player | 'DRAW' | null;
  mode: GameMode;
  userRole: Player;
  onPlayAgain: () => void;
  moveCount: number;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  winner,
  mode,
  userRole,
  onPlayAgain,
  moveCount,
}) => {
  if (!winner) return null;

  const isUserWinner = mode === 'AI' ? winner === userRole : false;
  const isDraw = winner === 'DRAW';

  useEffect(() => {
    if (winner !== 'DRAW') {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.65 },
        });
      } catch {
        // ignore
      }
    }
  }, [winner]);

  let title = '';
  let subtitle = '';
  let icon = null;

  if (isDraw) {
    title = 'Bất phân thắng bại!';
    subtitle = `Hai bên đã hòa sau ${moveCount} nước cờ giằng co quyết liệt.`;
    icon = <Equal className="w-12 h-12 text-slate-500" />;
  } else if (mode === 'AI') {
    if (isUserWinner) {
      title = 'Xin chúc mừng! Bạn đã chiến thắng!';
      subtitle = `Bạn đã đánh bại máy tính xuất sắc sau ${moveCount} nước cờ.`;
      icon = <Trophy className="w-12 h-12 text-amber-500 animate-bounce" />;
    } else {
      title = 'Máy tính đã chiến thắng!';
      subtitle = `Đừng nản lòng! Hãy phục thù ở ván tiếp theo.`;
      icon = <Frown className="w-12 h-12 text-rose-500" />;
    }
  } else {
    // PVP
    title = `Người chơi ${winner === 'X' ? '1 (✕)' : '2 (○)'} Chiến Thắng!`;
    subtitle = `Một ván đấu đỉnh cao kết thúc sau ${moveCount} lượt đi.`;
    icon = <Trophy className="w-12 h-12 text-amber-500" />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in zoom-in-95 duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-center">
        <div className="flex justify-center mb-4">{icon}</div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          {title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          {subtitle}
        </p>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onPlayAgain}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Chơi lại ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
};
