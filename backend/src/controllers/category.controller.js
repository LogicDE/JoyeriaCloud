const { Category, Product, sequelize } = require('../models');

/**
 * GET /api/categories
 * Listar todas las categorías con conteo de productos activos
 */
const getCategories = async (req, res) => {
  const categories = await Category.findAll({
    attributes: {
      include: [
        [
          sequelize.literal(`(SELECT COUNT(*) FROM products p WHERE p.category_id = "Category".id AND p.is_active = true)`),
          'product_count',
        ],
      ],
    },
    order: [['name', 'ASC']],
  });

  res.json({ categories });
};

/**
 * GET /api/categories/:id
 */
const getCategoryById = async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) return res.status(404).json({ error: 'Categoría no encontrada.' });
  res.json({ category });
};

/**
 * POST /api/categories (Admin)
 */
const createCategory = async (req, res) => {
  const { name, description } = req.body;
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const category = await Category.create({ name, description, slug });
  res.status(201).json({ message: 'Categoría creada.', category });
};

/**
 * PUT /api/categories/:id (Admin)
 */
const updateCategory = async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) return res.status(404).json({ error: 'Categoría no encontrada.' });

  const { name, description } = req.body;
  if (name) {
    category.name = name;
    category.slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
  if (description !== undefined) category.description = description;
  await category.save();

  res.json({ message: 'Categoría actualizada.', category });
};

/**
 * DELETE /api/categories/:id (Admin)
 */
const deleteCategory = async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) return res.status(404).json({ error: 'Categoría no encontrada.' });

  const productCount = await Product.count({ where: { category_id: req.params.id, is_active: true } });
  if (productCount > 0) {
    return res.status(400).json({ error: `No se puede eliminar. Tiene ${productCount} producto(s) activos.` });
  }

  await category.destroy();
  res.json({ message: 'Categoría eliminada.' });
};

module.exports = { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
