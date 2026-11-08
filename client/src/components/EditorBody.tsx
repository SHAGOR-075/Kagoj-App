// Body area of the note editor with title, formatting toolbar, and content area.

import { useEffect, useRef } from 'react';
import { ColorPicker } from './ColorPicker';
import { EditorToolbar } from './EditorToolbar';

interface EditorBodyProps {
  title: string;
  content: string;
  color: string;
  isNew: boolean;
  onTitleChange: (v: string) => void;
  onContentChange: (v: string) => void;
  onColorChange: (v: string) => void;
}

export function EditorBody({
  title,
  content,
  color,
  isNew,
  onTitleChange,
  onContentChange,
  onColorChange,
}: EditorBodyProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isNew && !title) textareaRef.current?.focus();
  }, [isNew, title]);

  const handleInsert = (snippet: string) => {
    const el = textareaRef.current;
    if (!el) { onContentChange(content + snippet); return; }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    onContentChange(content.substring(0, start) + snippet + content.substring(end));
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + snippet.length, start + snippet.length);
    }, 0);
  };

  const words = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto no-scrollbar">
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Note title…"
        aria-label="Note title"
        className="w-full font-serif text-2xl sm:text-3xl font-semibold bg-transparent text-stone-900 dark:text-stone-50 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none mb-3 tracking-tight"
      />
      <div className="flex flex-col gap-2 pb-3 mb-3 border-b border-stone-200/50 dark:border-stone-800/60">
        <ColorPicker selectedColor={color} onSelectColor={onColorChange} />
        <EditorToolbar onInsertSnippet={handleInsert} />
      </div>
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="Write your note here… (English or বাংলা)"
        aria-label="Note content"
        className="flex-1 w-full font-sans text-base leading-relaxed bg-transparent text-stone-800 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 resize-none focus:outline-none min-h-[300px]"
      />
      <div className="pt-2 text-[11px] text-stone-500 dark:text-stone-400 font-sans flex justify-between items-center">
        <span>{words} {words === 1 ? 'word' : 'words'} · {content.length} chars</span>
        <span>Auto-saves on typing</span>
      </div>
    </div>
  );
}
