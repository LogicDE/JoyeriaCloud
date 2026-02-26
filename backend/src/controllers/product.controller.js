const { Op } = require('sequelize');
const { validationResult } = require('express-validator');
const { Product, Category, Review, sequelize } = require('../models');

// ─── FUNCIÓN 1: Catálogo de Joyas ─────────────────────────────────────────────

/**
 * GET /api/products
 * Listar productos con filtros, búsqueda y paginación
 * Query params: category, material, minPrice, maxPrice, search, page, limit, sortBy, sortOrder
 */
const getProducts = async (req, res) => {
  const {
    category,
    material,
    minPrice,
    maxPrice,
    search,
    page = 1,
    limit = 12,
    sortBy = 'created_at',
    sortOrder = 'DESC',
  } = req.query;

  const where = { is_active: true };
  const allowedSort = ['price', 'created_at', 'name'];
  const allowedOrder = ['ASC', 'DESC'];

  // Filtro por búsqueda de texto
  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
      { material: { [Op.iLike]: `%${search}%` } },
    ];
  }

  // Filtro por material
  if (material) {
    where.material = { [Op.iLike]: `%${material}%` };
  }

  // Filtro por rango de precios
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
    if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
  }

  // Include para filtrar por categoría
  const categoryInclude = {
    model: Category,
    as: 'category',
    attributes: ['id', 'name', 'slug'],
    ...(category && { where: { slug: category } }),
  };

  const offset = (parseInt(page) - 1) * parseInt(limit);

  const { rows: products, count: total } = await Product.findAndCountAll({
    where,
    include: [categoryInclude],
    attributes: {
      include: [
        [
          sequelize.literal(`(
            SELECT ROUND(AVG(r.rating)::numeric, 1)
            FROM reviews r WHERE r.product_id = "Product".id
          )`),
          'avg_rating',
        ],
        [
          sequelize.literal(`(
            SELECT COUNT(*) FROM reviews r WHERE r.product_id = "Product".id
          )`),
          'review_count',
        ],
      ],
    },
    order: [[allowedSort.includes(sortBy) ? sortBy : 'created_at', allowedOrder.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC']],
    limit: Math.min(parseInt(limit), 50),
    offset,
    distinct: true,
  });

  res.json({
    products,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    },
  });
};

/**
 * GET /api/products/:id
 * Detalle completo de un producto
 */
const getProductById = async (req, res) => {
  const product = await Product.findOne({
    where: { id: req.params.id, is_active: true },
    include: [
      { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
      {
        model: Review,
        as: 'reviews',
        limit: 10,
        order: [['created_at', 'DESC']],
        include: [{ association: 'user', attributes: ['id', 'name'] }],
      },
    ],
    attributes: {
      include: [
        [
          sequelize.literal(`(SELECT ROUND(AVG(r.rating)::numeric, 1) FROM reviews r WHERE r.product_id = "Product".id)`),
          'avg_rating',
        ],
        [
          sequelize.literal(`(SELECT COUNT(*) FROM reviews r WHERE r.product_id = "Product".id)`),
          'review_count',
        ],
      ],
    },
  });

  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado.' });
  }

  res.json({ product });
};

/**
 * POST /api/products  (Admin)
 * Crear un nuevo producto
 */
const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, price, stock, material, weight_grams, category_id, image_url } = req.body;

  const category = await Category.findByPk(category_id);
  if (!category) {
    return res.status(400).json({ error: 'Categoría no encontrada.' });
  }

  const product = await Product.create({
    name, description, price, stock, material, weight_grams, category_id, image_url,
  });

  const full = await Product.findByPk(product.id, {
    include: [{ model: Category, as: 'category' }],
  });

  res.status(201).json({ message: 'Producto creado exitosamente.', product: full });
};

/**
 * PUT /api/products/:id  (Admin)
 * Actualizar un producto existente
 */
const updateProduct = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado.' });
  }

  const fields = ['name', 'description', 'price', 'stock', 'material', 'weight_grams', 'category_id', 'image_url', 'images', 'is_active'];
  const updates = {};
  fields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

  await product.update(updates);
  res.json({ message: 'Producto actualizado.', product });
};

/**
 * DELETE /api/products/:id  (Admin)
 * Soft delete — desactivar producto
 */
const deleteProduct = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado.' });
  }

  await product.update({ is_active: false });
  res.json({ message: 'Producto desactivado correctamente.' });
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
