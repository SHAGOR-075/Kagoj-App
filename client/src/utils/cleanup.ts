/**
 * Data cleanup utility: Purges in-memory and local storage data on logout, lock, or 401.
 */

export function clearAppData(): void {
  try {
    // Clear known keys
    const keysToRemove = [
      'kagoj_notes_data',
      'kagoj_editor_draft',
      'kagoj_search_query',
      'kagoj_lock_pin',
      'kagoj_lock_bio',
      'kagoj_lock_enabled',
    ];

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    // Also purge IndexedDB if present
    if (typeof window !== 'undefined' && window.indexedDB) {
      try {
        window.indexedDB.deleteDatabase('kagoj_notes_db');
      } catch {
        // Ignore
      }
    }
  } catch (err) {
    console.warn('Error clearing app data:', err);
  }
}

