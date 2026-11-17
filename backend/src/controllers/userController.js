const User = require('../models/User');

// GET /api/users/me
async function getMe(req, res) {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }
  res.json({ user });
}

// GET /api/users
async function getUsers(_req, res) {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ total: users.length, users });
}

module.exports = { getMe, getUsers };
