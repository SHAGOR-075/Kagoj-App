// Device detection utility restricting access to phones and tablets only.

export function isMobileDevice(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  const ua = navigator.userAgent || '';
  const platform = navigator.platform || '';
  const maxTouchPoints = navigator.maxTouchPoints || 0;

  // 1. Mobile/tablet user agent OR iPad reporting as Mac
  const isMobileUA =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(
      ua
    );
  const isIPadOS = platform === 'MacIntel' && maxTouchPoints > 1;
  const isMobilePlatform = isMobileUA || isIPadOS;

  // 2. Touch capability check (also handles installed PWAs on mobile)
  const hasTouch =
    maxTouchPoints > 0 ||
    (typeof window.matchMedia === 'function' &&
      window.matchMedia('(pointer: coarse)').matches);

  return Boolean(isMobilePlatform && hasTouch);
}

