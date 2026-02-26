const router = require('express').Router();
const { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } = require('../controllers/category.controller');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post('/', authMiddleware, adminMiddleware, createCategory);
router.put('/:id', authMiddleware, adminMiddleware, updateCategory);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCategory);

module.exports = router;
