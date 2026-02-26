const router = require('express').Router();
const { body } = require('express-validator');
const {
  getProducts, getProductById, createProduct, updateProduct, deleteProduct,
} = require('../controllers/product.controller');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const productValidation = [
  body('name').trim().notEmpty().withMessage('Nombre requerido.'),
  body('price').isFloat({ min: 0.01 }).withMessage('Precio debe ser mayor a 0.'),
  body('stock').isInt({ min: 0 }).withMessage('Stock debe ser un entero >= 0.'),
  body('category_id').isUUID().withMessage('category_id debe ser un UUID válido.'),
];

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin-only routes
router.post('/', authMiddleware, adminMiddleware, productValidation, createProduct);
router.put('/:id', authMiddleware, adminMiddleware, updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
