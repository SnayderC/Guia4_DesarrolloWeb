const jwt = require('jsonwebtoken');

// Valida el header "Authorization: Bearer <token>"
function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Acceso denegado: token no proporcionado' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch (err) {
    const message =
      err.name === 'TokenExpiredError'
        ? 'Acceso denegado: el token ha expirado'
        : 'Acceso denegado: token inválido';
    return res.status(401).json({ message });
  }
}

module.exports = auth;
