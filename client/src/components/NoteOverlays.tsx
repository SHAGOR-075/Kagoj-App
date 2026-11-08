// Container for editor, confirmation dialog, toast, install guide, and lock settings overlays.

import { ConfirmSheet } from './ConfirmSheet';
import { EditorModal } from './EditorModal';
import { InstallGuideSheet } from './InstallGuideSheet';
import { LockSettingsModal } from './LockSettingsModal';
import { Toast } from './Toast';
import { useNotesPage } from '../hooks/useNotesPage';

interface NoteOverlaysProps {
  page: ReturnType<typeof useNotesPage>;
}

export function NoteOverlays({ page }: NoteOverlaysProps) {
  const { modals, lock, pwa, toast, dismissToast, handleSave, handleConfirmDelete } = page;

  return (
    <>
      <EditorModal
        note={modals.activeNote}
        isOpen={modals.isEditorOpen}
        onClose={modals.closeEditor}
        onSave={handleSave}
        onDeleteEmpty={page.handleDeleteEmpty}
        onDelete={modals.requestDelete}
      />
      <ConfirmSheet
        note={modals.deleteCandidate}
        isOpen={!!modals.deleteCandidate}
        onConfirm={handleConfirmDelete}
        onCancel={modals.cancelDelete}
      />
      <Toast toast={toast} onDismiss={dismissToast} />
      <InstallGuideSheet
        isOpen={modals.showInstallGuide}
        onClose={() => modals.setShowInstallGuide(false)}
        isIosSafari={pwa.isIosSafari}
      />
      <LockSettingsModal
        isOpen={page.showLockSettings}
        onClose={() => page.setShowLockSettings(false)}
        isLockEnabled={lock.isLockEnabled}
        hasBiometrics={lock.hasBiometrics}
        onEnableLock={lock.enableLock}
        onDisableLock={lock.disableLock}
      />
    </>
  );
}
