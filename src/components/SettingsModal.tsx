import React from 'react';
import { GameSettings, GameMode, AIDifficulty, WinCondition, BoardTheme, Player } from '../types/game';
import { X, Sparkles, Sliders, Palette, Clock, Bot, Users } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onSaveSettings: (newSettings: GameSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  if (!isOpen) return null;

  const [localSettings, setLocalSettings] = React.useState<GameSettings>({ ...settings });

  const handleSave = () => {
    onSaveSettings(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base">Cài đặt trò chơi</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng bảng cài đặt"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Game Mode */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Chế độ chơi
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLocalSettings({ ...localSettings, mode: 'AI' })}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium transition-colors ${
                  localSettings.mode === 'AI'
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-950/50 dark:border-indigo-500 dark:text-indigo-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Bot className="w-4 h-4" />
                <span>Đấu với máy</span>
              </button>
              <button
                type="button"
                onClick={() => setLocalSettings({ ...localSettings, mode: 'PVP' })}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium transition-colors ${
                  localSettings.mode === 'PVP'
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-950/50 dark:border-indigo-500 dark:text-indigo-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>2 Người chơi</span>
              </button>
            </div>
          </div>

          {/* AI Settings (Only in AI Mode) */}
          {localSettings.mode === 'AI' && (
            <div className="space-y-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Độ khó máy tính
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['EASY', 'MEDIUM', 'HARD'] as AIDifficulty[]).map((level) => {
                    const labels: Record<AIDifficulty, string> = {
                      EASY: 'Dễ',
                      MEDIUM: 'Vừa',
                      HARD: 'Cao thủ',
                    };
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setLocalSettings({ ...localSettings, difficulty: level })}
                        className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors ${
                          localSettings.difficulty === level
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {labels[level]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Bạn chọn quân (Lượt đi)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLocalSettings({ ...localSettings, playerRole: 'X' })}
                    className={`py-1.5 px-3 rounded-lg text-xs font-medium border transition-colors flex items-center justify-center gap-1.5 ${
                      localSettings.playerRole === 'X'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span className="font-bold text-sm">✕</span>
                    <span>Quân X (Đi trước)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLocalSettings({ ...localSettings, playerRole: 'O' })}
                    className={`py-1.5 px-3 rounded-lg text-xs font-medium border transition-colors flex items-center justify-center gap-1.5 ${
                      localSettings.playerRole === 'O'
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span className="font-bold text-sm">○</span>
                    <span>Quân O (Đi sau)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Win Condition */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Điều kiện thắng
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLocalSettings({ ...localSettings, winCondition: 4 })}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  localSettings.winCondition === 4
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-900 dark:bg-indigo-950/50 dark:border-indigo-500 dark:text-indigo-200'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="font-semibold text-xs sm:text-sm">4 quân liên tiếp</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Tốc độ nhanh, kích thích kịch tính trên bàn 5x5
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLocalSettings({ ...localSettings, winCondition: 5 })}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  localSettings.winCondition === 5
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-900 dark:bg-indigo-950/50 dark:border-indigo-500 dark:text-indigo-200'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="font-semibold text-xs sm:text-sm">5 quân liên tiếp</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Cả hàng / cột / đường chéo trọn vẹn
                </div>
              </button>
            </div>
          </div>

          {/* Timer per turn */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Thời gian mỗi lượt
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[0, 15, 30].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setLocalSettings({ ...localSettings, timerSeconds: sec })}
                  className={`py-2 px-2 rounded-xl text-xs font-medium border transition-colors flex items-center justify-center gap-1.5 ${
                    localSettings.timerSeconds === sec
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{sec === 0 ? 'Không giới hạn' : `${sec} giây`}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Board Theme */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Giao diện bàn cờ
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'wood', label: 'Gỗ mộc', color: 'bg-amber-700' },
                { id: 'slate', label: 'Đá đen', color: 'bg-slate-800' },
                { id: 'modern', label: 'Tối giản', color: 'bg-slate-200 text-slate-900' },
              ].map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => setLocalSettings({ ...localSettings, theme: th.id as BoardTheme })}
                  className={`py-2.5 px-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                    localSettings.theme === th.id
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold ring-1 ring-indigo-500'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${th.color} inline-block`} />
                  <span>{th.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
          >
            Lưu cài đặt
          </button>
        </div>
      </div>
    </div>
  );
};
