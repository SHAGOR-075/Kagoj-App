// Quick formatting toolbar for inserting lists, checkboxes, and timestamps.

import { Calendar, CheckSquare, Hash, List, Minus } from 'lucide-react';

interface EditorToolbarProps {
  onInsertSnippet: (snippet: string) => void;
}

export function EditorToolbar({ onInsertSnippet }: EditorToolbarProps) {
  const tools = [
    { label: 'Checklist', icon: CheckSquare, snippet: '\n[ ] ' },
    { label: 'Bullet list', icon: List, snippet: '\n• ' },
    { label: 'Numbered', icon: Hash, snippet: '\n1. ' },
    { label: 'Date', icon: Calendar, snippet: `\n${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ` },
    { label: 'Divider', icon: Minus, snippet: '\n---\n' },
  ];

  return (
    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1.5 px-3 bg-stone-100/70 dark:bg-stone-900/50 rounded-xl border border-stone-200/50 dark:border-stone-800/50">
      <span className="text-[11px] font-medium text-stone-400 dark:text-stone-500 mr-1 shrink-0 uppercase tracking-wider">Quick:</span>
      {tools.map((t) => {
        const Icon = t.icon;
        return (
          <button
            key={t.label}
            type="button"
            onClick={() => onInsertSnippet(t.snippet)}
            title={t.label}
            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 active:scale-95 transition shrink-0 min-h-[36px]"
          >
            <Icon className="w-3.5 h-3.5 opacity-80" />
            <span className="text-[11px] font-sans font-medium">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
