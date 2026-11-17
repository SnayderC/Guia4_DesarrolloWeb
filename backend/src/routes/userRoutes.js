const { Router } = require('express');
const auth = require('../middleware/auth');
const { getMe, getUsers } = require('../controllers/userController');

const router = Router();

// Todas las rutas de usuarios están protegidas con JWT
router.use(auth);
router.get('/me', getMe);
router.get('/', getUsers);

module.exports = router;
