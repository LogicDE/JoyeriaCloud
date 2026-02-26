const { ValidationError, UniqueConstraintError } = require('sequelize');

const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  // Sequelize validation errors
  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: 'Error de validación',
      details: err.errors.map(e => ({ field: e.path, message: e.message })),
    });
  }

  // Unique constraint (email duplicado, etc.)
  if (err instanceof UniqueConstraintError) {
    return res.status(409).json({
      error: 'El recurso ya existe',
      details: err.errors.map(e => e.message),
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Token inválido' });
  }

  // Custom app errors
  if (err.statusCode) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Default server error
  res.status(500).json({
    error: 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { details: err.message }),
  });
};

module.exports = errorHandler;
