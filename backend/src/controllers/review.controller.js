const { Op } = require('sequelize');
const { validationResult } = require('express-validator');
const { Review, Product, Order, OrderItem, User, sequelize } = require('../models');

// ─── FUNCIÓN 6: Reseñas y Valoraciones ────────────────────────────────────────

/**
 * GET /api/products/:productId/reviews
 * Listar reseñas de un producto con rating promedio
 */
const getProductReviews = async (req, res) => {
  const { productId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const product = await Product.findByPk(productId);
  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado.' });
  }

  const { rows: reviews, count: total } = await Review.findAndCountAll({
    where: { product_id: productId },
    include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
    order: [['created_at', 'DESC']],
    limit: parseInt(limit),
    offset,
  });

  // Calcular estadísticas de rating
  const stats = await Review.findOne({
    where: { product_id: productId },
    attributes: [
      [sequelize.fn('AVG', sequelize.col('rating')), 'avg_rating'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'total_reviews'],
      [sequelize.literal(`COUNT(CASE WHEN rating = 5 THEN 1 END)`), 'five_star'],
      [sequelize.literal(`COUNT(CASE WHEN rating = 4 THEN 1 END)`), 'four_star'],
      [sequelize.literal(`COUNT(CASE WHEN rating = 3 THEN 1 END)`), 'three_star'],
      [sequelize.literal(`COUNT(CASE WHEN rating = 2 THEN 1 END)`), 'two_star'],
      [sequelize.literal(`COUNT(CASE WHEN rating = 1 THEN 1 END)`), 'one_star'],
    ],
    raw: true,
  });

  res.json({
    reviews,
    stats: {
      avg_rating: stats ? parseFloat(stats.avg_rating || 0).toFixed(1) : '0.0',
      total_reviews: parseInt(stats?.total_reviews || 0),
      distribution: {
        5: parseInt(stats?.five_star || 0),
        4: parseInt(stats?.four_star || 0),
        3: parseInt(stats?.three_star || 0),
        2: parseInt(stats?.two_star || 0),
        1: parseInt(stats?.one_star || 0),
      },
    },
    pagination: {
      total, page: parseInt(page), limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    },
  });
};

/**
 * POST /api/products/:productId/reviews
 * Crear reseña. El usuario debe haber comprado el producto.
 */
const createReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { productId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id;

  // Verificar que el producto existe
  const product = await Product.findByPk(productId);
  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado.' });
  }

  // Verificar que el usuario haya comprado el producto (orden entregada)
  const hasPurchased = await OrderItem.findOne({
    where: { product_id: productId },
    include: [{
      model: Order,
      as: 'order',
      where: { user_id: userId, status: 'delivered' },
    }],
  });

  if (!hasPurchased) {
    return res.status(403).json({
      error: 'Solo puedes reseñar productos que hayas comprado y recibido.',
    });
  }

  // Verificar que no haya reseñado ya
  const existing = await Review.findOne({ where: { product_id: productId, user_id: userId } });
  if (existing) {
    return res.status(409).json({ error: 'Ya has reseñado este producto.' });
  }

  const review = await Review.create({ product_id: productId, user_id: userId, rating, comment });
  const full = await Review.findByPk(review.id, {
    include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
  });

  res.status(201).json({ message: 'Reseña publicada exitosamente.', review: full });
};

/**
 * PUT /api/reviews/:id
 * Editar una reseña propia
 */
const updateReview = async (req, res) => {
  const review = await Review.findOne({
    where: { id: req.params.id, user_id: req.user.id },
  });

  if (!review) {
    return res.status(404).json({ error: 'Reseña no encontrada o no tienes permiso para editarla.' });
  }

  const { rating, comment } = req.body;
  if (rating) review.rating = rating;
  if (comment !== undefined) review.comment = comment;
  await review.save();

  res.json({ message: 'Reseña actualizada.', review });
};

/**
 * DELETE /api/reviews/:id
 * Eliminar reseña (dueño o admin)
 */
const deleteReview = async (req, res) => {
  const where = { id: req.params.id };
  if (req.user.role !== 'admin') where.user_id = req.user.id;

  const review = await Review.findOne({ where });
  if (!review) {
    return res.status(404).json({ error: 'Reseña no encontrada o sin permisos.' });
  }

  await review.destroy();
  res.json({ message: 'Reseña eliminada.' });
};

module.exports = { getProductReviews, createReview, updateReview, deleteReview };
