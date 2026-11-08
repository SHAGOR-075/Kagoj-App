// Full-screen note editor modal with soft paper background.

import { getColorConfig } from '../constants/colors';
import { useEditorState } from '../hooks/useEditorState';
import { Note } from '../types/note';
import { EditorBody } from './EditorBody';
import { EditorHeader } from './EditorHeader';

interface EditorModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; content: string; color: string; pinned: boolean; clientId: string; noteId?: string }) => Promise<Note | void>;
  onDeleteEmpty?: (noteId: string) => Promise<void>;
  onDelete?: (note: Note) => void;
}

export function EditorModal({ note, isOpen, onClose, onSave, onDeleteEmpty, onDelete }: EditorModalProps) {
  const editor = useEditorState(note, isOpen, onSave, onDeleteEmpty);
  if (!isOpen) return null;
  const colorCfg = getColorConfig(editor.color);

  return (
    <div className={`fixed inset-0 z-40 flex flex-col ${colorCfg.classes} transition-colors duration-200`}>
      <EditorHeader
        isNew={!note}
        pinned={editor.pinned}
        saveStatus={editor.saveStatus}
        onBack={onClose}
        onManualSave={() => editor.manualSave(onClose)}
        onTogglePin={(e) => {
          e.stopPropagation();
          editor.togglePin();
        }}
        onDelete={note && onDelete ? () => onDelete(note) : undefined}
      />
      <EditorBody
        title={editor.title}
        content={editor.content}
        color={editor.color}
        isNew={!note}
        onTitleChange={editor.setTitle}
        onContentChange={editor.setContent}
        onColorChange={editor.setColor}
      />
    </div>
  );
}
