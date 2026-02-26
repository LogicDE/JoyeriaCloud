const router = require('express').Router();
const { body } = require('express-validator');
const {
  createOrder, getMyOrders, getOrderById, updateOrderStatus, getAllOrders,
} = require('../controllers/order.controller');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const orderValidation = [
  body('items').isArray({ min: 1 }).withMessage('Se requiere al menos un producto.'),
  body('items.*.product_id').isUUID().withMessage('product_id inválido.'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('La cantidad debe ser al menos 1.'),
  body('shipping_address').isObject().withMessage('Dirección de envío requerida.'),
  body('shipping_address.street').notEmpty().withMessage('Calle requerida.'),
  body('shipping_address.city').notEmpty().withMessage('Ciudad requerida.'),
  body('shipping_address.country').notEmpty().withMessage('País requerido.'),
];

// Customer routes (requieren autenticación)
router.post('/', authMiddleware, orderValidation, createOrder);
router.get('/', authMiddleware, getMyOrders);
router.get('/:id', authMiddleware, getOrderById);

// Admin routes
router.get('/admin/all', authMiddleware, adminMiddleware, getAllOrders);
router.patch('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);

module.exports = router;
