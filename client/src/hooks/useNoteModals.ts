// Hook managing editor, deletion confirmation, and PWA modal states.

import { useState } from 'react';
import { Note } from '../types/note';

export function useNoteModals() {
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<Note | null>(null);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  const openNewNote = () => {
    setActiveNote(null);
    setIsEditorOpen(true);
  };

  const openEditNote = (note: Note) => {
    setActiveNote(note);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setActiveNote(null);
  };

  const requestDelete = (note: Note) => {
    setDeleteCandidate(note);
  };

  const cancelDelete = () => {
    setDeleteCandidate(null);
  };

  return {
    activeNote,
    isEditorOpen,
    openNewNote,
    openEditNote,
    closeEditor,
    deleteCandidate,
    requestDelete,
    cancelDelete,
    showInstallGuide,
    setShowInstallGuide,
  };
}
