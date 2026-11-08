// Main notes screen coordinating search, color filtering, install banner, and overlays.

import { FloatingActionButton } from '../components/FloatingActionButton';
import { Header } from '../components/Header';
import { InstallBanner } from '../components/InstallBanner';
import { NoteOverlays } from '../components/NoteOverlays';
import { NotesContent } from '../components/NotesContent';
import { SearchBar } from '../components/SearchBar';
import { useFilteredNotes } from '../hooks/useFilteredNotes';
import { useNotes } from '../hooks/useNotes';
import { useNotesPage } from '../hooks/useNotesPage';
import { useTheme } from '../hooks/useTheme';

interface NotesPageProps {
  onLockNow?: () => void;
  onOpenSettings?: () => void;
}

export function NotesPage({ onLockNow, onOpenSettings }: NotesPageProps) {
  const notesHook = useNotes();
  const page = useNotesPage(notesHook);
  const search = useFilteredNotes(notesHook.notes);
  const { isDark, toggleTheme } = useTheme();

  const pinnedCount = notesHook.notes.filter((n) => n.pinned).length;

  const handleInstall = async () => {
    const result = await page.pwa.promptInstall();
    if (result === 'installed') {
      page.showToast('App installed');
    } else if (result === 'ios-safari' || result === 'ios-non-safari') {
      page.modals.setShowInstallGuide(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors">
      <Header
        totalNotes={notesHook.notes.length}
        pinnedCount={pinnedCount}
        viewMode={page.viewMode}
        onToggleView={page.toggleView}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        canInstall={page.pwa.canInstall}
        onInstall={handleInstall}
        isLockEnabled={true}
        onOpenLockSettings={onOpenSettings || (() => {})}
        onLockNow={onLockNow || (() => {})}
      />
      <SearchBar
        value={search.searchQuery}
        onChange={search.setSearchQuery}
        selectedColor={search.colorFilter}
        onSelectColor={search.setColorFilter}
      />
      <InstallBanner canInstall={page.pwa.canInstall} onInstall={handleInstall} />
      <main className="flex-1 w-full pt-1">
        <NotesContent
          loading={notesHook.loading}
          error={notesHook.error}
          notes={search.filteredNotes}
          isSearching={search.isSearching}
          viewMode={page.viewMode}
          onRetry={notesHook.fetchNotes}
          onClearSearch={() => { search.setSearchQuery(''); search.setColorFilter(null); }}
          onNewNote={page.modals.openNewNote}
          onSelectNote={page.modals.openEditNote}
          onTogglePin={page.togglePin}
          onRequestDelete={page.modals.requestDelete}
        />
      </main>
      <FloatingActionButton onClick={page.modals.openNewNote} />
      <NoteOverlays page={page} />
    </div>
  );
}
