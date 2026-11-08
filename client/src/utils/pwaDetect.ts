export function isRunningAsInstalledApp(): boolean {
  if (typeof window === 'undefined') return false;

  const isStandalone = window.matchMedia?.('(display-mode: standalone)').matches ?? false;
  const isFullscreen = window.matchMedia?.('(display-mode: fullscreen)').matches ?? false;
  const isMinimalUi = window.matchMedia?.('(display-mode: minimal-ui)').matches ?? false;
  const isIosStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
  const isAndroidTwa = typeof document !== 'undefined' && Boolean(document.referrer?.startsWith('android-app://'));

  const isBrowserMode = window.matchMedia?.('(display-mode: browser)').matches ?? false;
  const hasInstalledHint = localStorage.getItem('kagoj_pwa_installed') === '1';
  const isInstalledNonBrowser = hasInstalledHint && !isBrowserMode;

  return Boolean(
    isStandalone ||
    isFullscreen ||
    isMinimalUi ||
    isIosStandalone ||
    isAndroidTwa ||
    isInstalledNonBrowser
  );
}

export function detectPlatform() {
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
