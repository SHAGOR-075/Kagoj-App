import { Smartphone } from 'lucide-react';

export function DesktopBlockScreen() {
  return (
    <div className="min-h-screen bg-[#fbfbfa] dark:bg-[#18181b] flex items-center justify-center p-6 text-[#1c1917] dark:text-[#f4efe8]">
      <div className="max-w-sm w-full bg-[#FAF8F5] dark:bg-[#1E1D1C] border border-stone-300/80 dark:border-stone-800 rounded-3xl p-8 text-center shadow-sm">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 flex items-center justify-center">
          <Smartphone className="w-8 h-8" strokeWidth={1.5} />
        </div>
        <h1 className="text-xl font-bold font-serif mb-2 text-stone-900 dark:text-stone-100">
          Mobile Only App
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-sans mb-6">
          This app works on phones and tablets only. Please open it on your mobile device.
        </p>
        <div className="text-xs text-stone-600 dark:text-stone-400 font-mono tracking-wide">
          কাগজ • Kagoj Quick Notes
        </div>
      </div>
    </div>
  );
}

