import React from 'react';
import { CellValue, Player, BoardTheme } from '../types/game';
import { BOARD_SIZE, indexToCoord, indexToNotation } from '../utils/caroLogic';

interface GameBoardProps {
  board: CellValue[];
  currentPlayer: Player;
  onCellClick: (index: number) => void;
  disabled: boolean;
  winningCells: number[];
  lastMoveIndex: number | null;
  hintIndex: number | null;
  theme: BoardTheme;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  currentPlayer,
  onCellClick,
  disabled,
  winningCells,
  lastMoveIndex,
  hintIndex,
  theme,
}) => {
  const colLabels = ['A', 'B', 'C', 'D', 'E'];
  const rowLabels = ['1', '2', '3', '4', '5'];

  // Theme styling configurations
  const themeStyles = {
    wood: {
      container: 'bg-[#8B5A2B]/10 border-[#8B5A2B]/30 shadow-2xl',
      boardBg: 'bg-gradient-to-br from-[#E2B176] via-[#D59E5D] to-[#C08544] border-8 border-[#7C4718] shadow-inner',
      gridLines: 'border-[#7C4718]/40',
      labelColor: 'text-[#6A3D14] font-semibold',
      cellHover: 'hover:bg-[#7C4718]/15',
      starDot: 'bg-[#6A3D14]',
    },
    slate: {
      container: 'bg-slate-900/40 border-slate-700/50 shadow-2xl',
      boardBg: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border-8 border-slate-700 shadow-inner',
      gridLines: 'border-slate-700/60',
      labelColor: 'text-slate-400 font-semibold',
      cellHover: 'hover:bg-slate-700/30',
      starDot: 'bg-slate-500',
    },
    modern: {
      container: 'bg-white/80 border-slate-200 shadow-xl',
      boardBg: 'bg-gradient-to-br from-slate-50 to-slate-100 border-8 border-slate-300 shadow-inner',
      gridLines: 'border-slate-300',
      labelColor: 'text-slate-500 font-semibold',
      cellHover: 'hover:bg-slate-200/50',
      starDot: 'bg-slate-400',
    },
  };

  const currentTheme = themeStyles[theme];

  return (
    <div className={`relative p-4 sm:p-6 rounded-3xl transition-all duration-300 ${currentTheme.container}`}>
      {/* Top Column Labels */}
      <div className="grid grid-cols-5 pl-7 pr-3 sm:pl-9 sm:pr-4 mb-2 text-center select-none">
        {colLabels.map((col) => (
          <span key={col} className={`text-xs sm:text-sm tracking-widest ${currentTheme.labelColor}`}>
            {col}
          </span>
        ))}
      </div>

      <div className="flex items-center">
        {/* Left Row Labels */}
        <div className="grid grid-rows-5 h-full pr-2 sm:pr-3 text-right select-none justify-between">
          {rowLabels.map((row) => (
            <div key={row} className="h-14 sm:h-18 flex items-center justify-end">
              <span className={`text-xs sm:text-sm w-4 ${currentTheme.labelColor}`}>
                {row}
              </span>
            </div>
          ))}
        </div>

        {/* 5x5 Main Board Grid */}
        <div
          role="grid"
          aria-label="Bàn cờ Caro 5x5"
          className={`grid grid-cols-5 gap-0 relative rounded-2xl overflow-hidden ${currentTheme.boardBg} p-1.5 sm:p-2.5`}
        >
          {/* Subtle Tengen / Center Dot marker on cell C3 (index 12) */}
          <div
            className={`absolute w-2 h-2 rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 ${currentTheme.starDot} opacity-40 z-0`}
          />

          {board.map((cellValue, idx) => {
            const { row, col } = indexToCoord(idx);
            const isWinningCell = winningCells.includes(idx);
            const isLastMove = lastMoveIndex === idx;
            const isHint = hintIndex === idx;
            const notation = indexToNotation(idx);

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onCellClick(idx)}
                disabled={disabled || cellValue !== null}
                aria-label={`Ô ${notation}, ${cellValue ? `Quân ${cellValue}` : 'Còn trống'}`}
                className={`
                  relative w-14 h-14 sm:w-18 sm:h-18 flex items-center justify-center
                  border ${currentTheme.gridLines}
                  transition-all duration-150 outline-none
                  focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:z-20
                  ${!cellValue && !disabled ? currentTheme.cellHover : ''}
                  ${cellValue ? 'cursor-default' : disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                  ${isWinningCell ? 'bg-amber-400/35 ring-2 ring-amber-400 ring-inset z-10' : ''}
                  ${isHint && !cellValue ? 'ring-2 ring-emerald-500 ring-dashed animate-pulse bg-emerald-500/10 z-10' : ''}
                `}
              >
                {/* Visual Stone / Piece */}
                {cellValue === 'X' && (
                  <div className="relative flex items-center justify-center transform transition-transform duration-200 scale-100 animate-in zoom-in-75">
                    <svg
                      viewBox="0 0 100 100"
                      className="w-9 h-9 sm:w-12 sm:h-12 drop-shadow-md text-blue-600 dark:text-blue-400"
                    >
                      <line
                        x1="22"
                        y1="22"
                        x2="78"
                        y2="78"
                        stroke="currentColor"
                        strokeWidth="14"
                        strokeLinecap="round"
                      />
                      <line
                        x1="78"
                        y1="22"
                        x2="22"
                        y2="78"
                        stroke="currentColor"
                        strokeWidth="14"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                )}

                {cellValue === 'O' && (
                  <div className="relative flex items-center justify-center transform transition-transform duration-200 scale-100 animate-in zoom-in-75">
                    <svg
                      viewBox="0 0 100 100"
                      className="w-9 h-9 sm:w-12 sm:h-12 drop-shadow-md text-rose-500 dark:text-rose-400"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="30"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="13"
                      />
                    </svg>
                  </div>
                )}

                {/* Empty Cell Hover Preview for active player */}
                {!cellValue && !disabled && (
                  <div className="opacity-0 hover:opacity-25 transition-opacity duration-150 absolute inset-0 flex items-center justify-center pointer-events-none">
                    {currentPlayer === 'X' ? (
                      <span className="text-2xl sm:text-3xl font-bold text-blue-600">✕</span>
                    ) : (
                      <span className="text-2xl sm:text-3xl font-bold text-rose-500">○</span>
                    )}
                  </div>
                )}

                {/* Last Move Indicator Marker */}
                {isLastMove && (
                  <span className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 shadow-sm animate-ping" />
                )}
                {isLastMove && (
                  <span className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 shadow-sm" />
                )}

                {/* Hint Text Badge */}
                {isHint && !cellValue && (
                  <span className="absolute top-1 left-1 text-[9px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1 rounded-sm shadow-xs pointer-events-none">
                    GỢI Ý
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
