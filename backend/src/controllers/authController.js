const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
}

// POST /api/auth/register
async function register(req, res) {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nombre, email y contraseña son obligatorios' });
  }

  const exists = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (exists) {
    return res.status(409).json({ message: 'El email ya está registrado' });
  }

  const user = await User.create({ name, email, password });
  res.status(201).json({ message: 'Usuario registrado correctamente', user });
}

// POST /api/auth/login
async function login(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
  }

  const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select('+password');
  if (!user || !(await user.comparePassword(String(password)))) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  const token = signToken(user);
  res.json({ message: 'Inicio de sesión exitoso', token, user });
}

module.exports = { register, login };
