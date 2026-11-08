// Deprecated local storage simulation replaced by server-authoritative WebAuthn session.

export function useAppLock() {
  return {
    isLocked: false,
    isLockEnabled: true,
    hasBiometrics: true,
    useBio: true,
    error: null,
    clearError: () => {},
    lockNow: () => {},
    unlockWithBiometrics: async () => true,
    unlockWithPin: () => true,
    enableLock: async () => {},
    disableLock: () => {},
  };
}
