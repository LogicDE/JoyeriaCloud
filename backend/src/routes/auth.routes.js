const router = require('express').Router();
const { body } = require('express-validator');
const { register, login, getMe, updateMe } = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth');

// Validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('El nombre es requerido.').isLength({ min: 2, max: 100 }),
  body('email').isEmail().withMessage('Email inválido.').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Email inválido.').normalizeEmail(),
  body('password').notEmpty().withMessage('Contraseña requerida.'),
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', authMiddleware, getMe);
router.put('/me', authMiddleware, updateMe);

module.exports = router;
