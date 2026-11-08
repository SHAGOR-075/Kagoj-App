/**
 * Middleware: mobileOnly
 * Restricts WebAuthn registration and login requests to mobile devices.
 *
 * NOTE: User-Agent and client-hints headers can be spoofed by an attacker,
 * so this is a defense-in-depth / best-effort check. The true cryptographic
 * security resides in the platform-authenticator WebAuthn assertion
 * and the signed JWT session.
 */
export function mobileOnly(req, res, next) {
  const ua = req.headers['user-agent'] || '';
  const chMobile = req.headers['sec-ch-ua-mobile'];

  // Sec-CH-UA-Mobile header: ?0 indicates desktop, ?1 indicates mobile
  if (chMobile === '?0') {
    return res.status(403).json({ message: 'Mobile devices only' });
  }

  // Regex for common mobile and tablet user agents
  const isMobileUa =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(
      ua
    );

  // iPad reporting as Macintosh (iPadOS 13+)
  const isIPadMac =
    /Macintosh/i.test(ua) && req.headers['max-touch-points'] > 1;

  if (!isMobileUa && !isIPadMac && chMobile !== '?1') {
    return res.status(403).json({ message: 'Mobile devices only' });
  }

  next();
}

