const router = require('express').Router();
const { body } = require('express-validator');
const { getProductReviews, createReview, updateReview, deleteReview } = require('../controllers/review.controller');
const { authMiddleware } = require('../middleware/auth');

const reviewValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('El rating debe ser entre 1 y 5.'),
  body('comment').optional().trim().isLength({ max: 1000 }),
];

// GET reviews de un producto → se registra en product.routes también, aquí como alias
router.get('/products/:productId/reviews', getProductReviews);
router.post('/products/:productId/reviews', authMiddleware, reviewValidation, createReview);
router.put('/:id', authMiddleware, reviewValidation, updateReview);
router.delete('/:id', authMiddleware, deleteReview);

module.exports = router;
