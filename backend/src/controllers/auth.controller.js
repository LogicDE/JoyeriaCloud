const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { User } = require('../models');

// ─── Helpers ──────────────────────────────────────────────────────────────────
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

const userPublicFields = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  created_at: user.created_at,
});

// ─── Controllers ──────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 * Registrar un nuevo usuario cliente
 */
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: 'El email ya está registrado.' });
  }

  const salt = await bcrypt.genSalt(12);
  const password_hash = await bcrypt.hash(password, salt);

  const user = await User.create({ name, email, password_hash, role: 'customer' });
  const token = generateToken(user);

  res.status(201).json({
    message: 'Usuario registrado exitosamente.',
    token,
    user: userPublicFields(user),
  });
};

/**
 * POST /api/auth/login
 * Iniciar sesión y obtener JWT
 */
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Credenciales incorrectas.' });
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    return res.status(401).json({ error: 'Credenciales incorrectas.' });
  }

  const token = generateToken(user);

  res.json({
    message: 'Sesión iniciada correctamente.',
    token,
    user: userPublicFields(user),
  });
};

/**
 * GET /api/auth/me
 * Obtener perfil del usuario autenticado
 */
const getMe = async (req, res) => {
  res.json({ user: userPublicFields(req.user) });
};

/**
 * PUT /api/auth/me
 * Actualizar perfil del usuario autenticado
 */
const updateMe = async (req, res) => {
  const { name, password } = req.body;
  const updates = {};

  if (name) updates.name = name;
  if (password) {
    const salt = await bcrypt.genSalt(12);
    updates.password_hash = await bcrypt.hash(password, salt);
  }

  await User.update(updates, { where: { id: req.user.id } });
  const updated = await User.findByPk(req.user.id);

  res.json({ message: 'Perfil actualizado.', user: userPublicFields(updated) });
};

module.exports = { register, login, getMe, updateMe };
