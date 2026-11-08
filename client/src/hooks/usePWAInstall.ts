import { useEffect, useRef, useState } from 'react';
import { checkInstalledHint, checkStandalone, detectPlatform } from '../utils/pwaDetect';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function checkStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function checkInstalledHint(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('kagoj_pwa_installed') === '1';
}

function detectPlatform() {
  if (typeof window === 'undefined') {
    return { isIos: false, isIosSafari: false };
  }
  const ua = window.navigator.userAgent || '';
  const platform = window.navigator.platform || '';
  const maxTouch = window.navigator.maxTouchPoints || 0;

  const isIos = /iPhone|iPad|iPod/i.test(ua) || (platform === 'MacIntel' && maxTouch > 1);
  const isNonSafari = /CriOS|FxiOS|EdgiOS|OPiOS|GSA|Line|FBAN|FBAV|Instagram/i.test(ua);
  const isWebKit = /WebKit/i.test(ua);
  const isIosSafari = isIos && isWebKit && !isNonSafari && !/Chrome|Android/i.test(ua);

  return { isIos, isIosSafari };
}

export function usePwaInstall() {
  const [isInstalled, setIsInstalled] = useState(() => checkStandalone() || checkInstalledHint());
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const promptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const { isIos, isIosSafari } = detectPlatform();

  useEffect(() => {
    promptRef.current = promptEvent;
  }, [promptEvent]);

  useEffect(() => {
    const mql = window.matchMedia('(display-mode: standalone)');
    const onMqlChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsInstalled(true);
        localStorage.setItem('kagoj_pwa_installed', '1');
      }
    };
    mql.addEventListener('change', onMqlChange);

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      localStorage.removeItem('kagoj_pwa_installed');
      setIsInstalled(false);
      setPromptEvent(e as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      setPromptEvent(null);
      setIsInstalled(true);
      localStorage.setItem('kagoj_pwa_installed', '1');
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onAppInstalled);

    return () => {
      mql.removeEventListener('change', onMqlChange);
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (isInstalled) return 'installed';
    if (promptRef.current) {
      const p = promptRef.current;
      await p.prompt();
      const choice = await p.userChoice;
      setPromptEvent(null);
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        localStorage.setItem('kagoj_pwa_installed', '1');
        return 'installed';
      }
      return 'dismissed';
    }
    if (isIosSafari) return 'ios-safari';
    if (isIos) return 'ios-non-safari';
    return 'unsupported';
  };

  const canInstall = !isInstalled && (Boolean(promptEvent) || isIos);

  return { canInstall, isIos, isIosSafari, isInstalled, promptInstall };
}

export { usePwaInstall as usePWAInstall };
