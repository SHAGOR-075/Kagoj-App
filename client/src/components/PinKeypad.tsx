// Numeric touch keypad for 4-digit PIN verification.

import { Delete } from 'lucide-react';
import { useState } from 'react';

interface PinKeypadProps {
  onComplete: (pin: string) => void;
  error?: string | null;
}

export function PinKeypad({ onComplete, error }: PinKeypadProps) {
  const [pin, setPin] = useState('');

  const handleDigit = (digit: string) => {
    if (pin.length >= 4) return;
    const next = pin + digit;
    setPin(next);
    if (next.length === 4) {
      setTimeout(() => {
        onComplete(next);
        setPin('');
      }, 100);
    }
  };

  const handleDelete = () => setPin((p) => p.slice(0, -1));

  return (
    <div className="flex flex-col items-center max-w-xs mx-auto">
      <div className="flex items-center gap-4 mb-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-3.5 h-3.5 rounded-full transition-all duration-150 ${
              pin.length > i ? 'bg-stone-900 dark:bg-stone-100 scale-110' : 'border-2 border-stone-300 dark:border-stone-700'
            }`}
          />
        ))}
      </div>

      {error && <p className="text-xs text-red-600 dark:text-red-400 font-sans mb-3 text-center">{error}</p>}

      <div className="grid grid-cols-3 gap-3 w-64 pt-2">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <button
            key={d}
            onClick={() => handleDigit(d)}
            className="h-14 rounded-2xl bg-stone-100 dark:bg-stone-800/80 text-lg font-serif font-bold text-stone-900 dark:text-stone-100 hover:bg-stone-200 dark:hover:bg-stone-700 active:scale-90 transition shadow-xs"
          >
            {d}
          </button>
        ))}
        <div />
        <button
          onClick={() => handleDigit('0')}
          className="h-14 rounded-2xl bg-stone-100 dark:bg-stone-800/80 text-lg font-serif font-bold text-stone-900 dark:text-stone-100 hover:bg-stone-200 dark:hover:bg-stone-700 active:scale-90 transition shadow-xs"
        >
          0
        </button>
        <button
          onClick={handleDelete}
          aria-label="Delete digit"
          className="h-14 rounded-2xl flex items-center justify-center text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 active:scale-90 transition"
        >
          <Delete className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
