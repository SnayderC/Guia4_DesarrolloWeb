// Manejo centralizado de errores
function errorHandler(err, _req, res, _next) {
  // Errores de validación de Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((e) => e.message).join('. ');
    return res.status(400).json({ message });
  }

  // Email duplicado (índice único)
  if (err.code === 11000) {
    return res.status(409).json({ message: 'El email ya está registrado' });
  }

  // ID con formato inválido
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Identificador inválido' });
  }

  // JSON mal formado en el body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'El cuerpo de la petición no es un JSON válido' });
  }

  console.error(err);
  res.status(500).json({ message: 'Error interno del servidor' });
}

module.exports = errorHandler;
