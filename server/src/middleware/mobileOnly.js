/**
 * Middleware: mobileOnly
 * Restricts WebAuthn registration and login requests to mobile and tablet devices.
 */
export function mobileOnly(req, res, next) {
  if (process.env.NODE_ENV === 'test') {
    return next();
  }

  const ua = req.headers['user-agent'] || '';
  const chMobile = req.headers['sec-ch-ua-mobile'];

  if (chMobile === '?0') {
    return res.status(403).json({ message: 'Mobile devices only' });
  }

  const isMobileUa =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(
      ua
    );

  const isIPadMac =
    /Macintosh/i.test(ua) && req.headers['max-touch-points'] > 1;

  if (!isMobileUa && !isIPadMac && chMobile !== '?1') {
    return res.status(403).json({ message: 'Mobile devices only' });
  }

  next();
}
