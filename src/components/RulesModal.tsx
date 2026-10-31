import React from 'react';
import { X, BookOpen, CheckCircle2, AlertCircle } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base">Hướng dẫn luật cờ Caro 5x5</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng hướng dẫn"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
            <h4 className="font-semibold text-indigo-950 dark:text-indigo-200 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Quy tắc cơ bản
            </h4>
            <p className="leading-relaxed text-indigo-900/80 dark:text-indigo-300/80">
              Hai người chơi lần lượt đi quân trên bàn cờ 5x5 (25 ô từ A1 đến E5). Quân <strong>✕</strong> luôn đi trước, theo sau là quân <strong>○</strong>.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <h5 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                1. Hai tùy chọn luật thắng linh hoạt:
              </h5>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong className="text-slate-800 dark:text-slate-200">Luật 4 quân (Khuyên dùng cho 5x5):</strong> Người chơi đầu tiên xếp được 4 quân liên tiếp theo hàng ngang, dọc hoặc đường chéo sẽ thắng.
                </li>
                <li>
                  <strong className="text-slate-800 dark:text-slate-200">Luật 5 quân:</strong> Phải xếp trọn vẹn cả hàng ngang, hàng dọc hoặc đường chéo 5 quân để thắng.
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                2. Hòa cờ:
              </h5>
              <p>
                Nếu toàn bộ 25 ô trên bàn cờ đã được đánh kín mà không bên nào tạo được chuỗi thắng, ván cờ kết thúc với kết quả Hòa.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
              <h5 className="font-semibold text-amber-900 dark:text-amber-200 mb-1 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Mẹo & Bí quyết chiến thắng bàn 5x5
              </h5>
              <ul className="list-disc pl-4 space-y-1 text-amber-900/80 dark:text-amber-300/80">
                <li>
                  <strong>Ô C3 trung tâm:</strong> Vị trí chiến lược số một giao cắt với cả 2 đường chéo, 1 hàng ngang và 1 hàng dọc.
                </li>
                <li>
                  <strong>Tạo thế đôi (Fork):</strong> Cố gắng tạo cùng lúc hai chuỗi đe dọa (ví dụ: vừa có 3 quân ngang vừa có 3 quân dọc) khiến đối thủ không thể chặn cả hai.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs sm:text-sm font-medium text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-xl hover:bg-slate-800 transition-colors"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
