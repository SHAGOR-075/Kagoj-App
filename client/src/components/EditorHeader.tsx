// Header bar for the note editor with navigation and action triggers.

import { ArrowLeft, Trash2 } from 'lucide-react';
import { PinButton } from './PinButton';
import { SaveIndicator, SaveStatus } from './SaveIndicator';

interface EditorHeaderProps {
  isNew: boolean;
  pinned: boolean;
  saveStatus: SaveStatus;
  onBack: () => void;
  onManualSave: () => void;
  onTogglePin: (e: React.MouseEvent) => void;
  onDelete?: () => void;
}

export function EditorHeader({
  isNew,
  pinned,
  saveStatus,
  onBack,
  onManualSave,
  onTogglePin,
  onDelete,
}: EditorHeaderProps) {
  return (
    <div className="h-14 px-4 flex items-center justify-between border-b border-stone-200/70 dark:border-stone-800/80 bg-inherit shrink-0">
      <div className="flex items-center gap-1">
        <button
          onClick={onBack}
          aria-label="Back to notes"
          className="min-h-[44px] min-w-[44px] -ml-2 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 rounded-xl active:scale-95 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-serif text-sm font-medium text-stone-600 dark:text-stone-300">
          {isNew ? 'New Note' : 'Edit Note'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <SaveIndicator status={saveStatus} />
        <button
          onClick={onManualSave}
          aria-label="Save note"
          className="px-3.5 py-1.5 text-xs font-medium rounded-xl bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 hover:opacity-90 active:scale-95 transition min-h-[36px]"
        >
          Save
        </button>
        <PinButton pinned={pinned} onToggle={onTogglePin} />
        {!isNew && onDelete && (
          <button
            onClick={onDelete}
            aria-label="Delete note"
            title="Delete note"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-400 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
