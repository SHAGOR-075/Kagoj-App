import { Download } from 'lucide-react';

interface InstallButtonProps {
  canInstall: boolean;
  onInstall: () => void;
}

export function InstallButton({ canInstall, onInstall }: InstallButtonProps) {
  if (!canInstall) return null;

  return (
    <button
      onClick={onInstall}
      aria-label="Install app"
      title="Install Kagoj App"
      className="min-h-[44px] min-w-[44px] w-11 h-11 flex items-center justify-center rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 active:scale-95 transition shrink-0"
    >
      <Download className="w-5 h-5 stroke-[1.8]" />
    </button>
  );
}

