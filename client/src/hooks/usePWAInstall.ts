import { useEffect, useRef, useState } from 'react';
import { detectPlatform, isRunningAsInstalledApp } from '../utils/pwaDetect';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePwaInstall() {
  const [isInstalledApp, setIsInstalledApp] = useState(() => isRunningAsInstalledApp());
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const promptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const { isIos, isIosSafari } = detectPlatform();

  useEffect(() => { promptRef.current = promptEvent; }, [promptEvent]);

  useEffect(() => {
    const modes = ['standalone', 'fullscreen', 'minimal-ui', 'browser'];
    const mqls = modes.map((m) => window.matchMedia(`(display-mode: ${m})`));
    const onMqlChange = () => setIsInstalledApp(isRunningAsInstalledApp());
    mqls.forEach((m) => m.addEventListener('change', onMqlChange));

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      localStorage.removeItem('kagoj_pwa_installed');
      setIsInstalledApp(false);
      setPromptEvent(e as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      setPromptEvent(null);
      setIsInstalledApp(true);
      localStorage.setItem('kagoj_pwa_installed', '1');
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onAppInstalled);

    return () => {
      mqls.forEach((m) => m.removeEventListener('change', onMqlChange));
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (isRunningAsInstalledApp()) return 'installed';
    if (promptRef.current) {
      const p = promptRef.current;
      await p.prompt();
      const choice = await p.userChoice;
      setPromptEvent(null);
      if (choice.outcome === 'accepted') {
        setIsInstalledApp(true);
        localStorage.setItem('kagoj_pwa_installed', '1');
        return 'installed';
      }
      return 'dismissed';
    }
    if (isIosSafari) return 'ios-safari';
    if (isIos) return 'ios-non-safari';
    return 'unsupported';
  };

  const canInstall = !isInstalledApp && (Boolean(promptEvent) || isIos);

  return {
    canInstall,
    isIos,
    isIosSafari,
    isInstalledApp,
    isInstalled: isInstalledApp,
    promptInstall,
    isRunningAsInstalledApp,
  };
}

export { usePwaInstall as usePWAInstall };
