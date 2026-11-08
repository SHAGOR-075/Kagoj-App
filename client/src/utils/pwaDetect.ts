export function checkStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export function checkInstalledHint(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('kagoj_pwa_installed') === '1';
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

