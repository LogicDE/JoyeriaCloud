const { validationResult } = require('express-validator');
const { sequelize, Order, OrderItem, Product, User } = require('../models');

// ─── FUNCIÓN 4: Gestión de Órdenes / Checkout ─────────────────────────────────

/**
 * POST /api/orders
 * Crear una nueva orden (checkout). Valida stock y descuenta inventario.
 * Body: { items: [{product_id, quantity}], shipping_address, notes }
 */
const createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { items, shipping_address, notes } = req.body;
  const userId = req.user.id;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'El carrito no puede estar vacío.' });
  }

  // Transacción para garantizar consistencia ACID
  const result = await sequelize.transaction(async (t) => {
    // 1. Cargar todos los productos de una sola vez
    const productIds = items.map(i => i.product_id);
    const products = await Product.findAll({
      where: { id: productIds, is_active: true },
      transaction: t,
      lock: t.LOCK.UPDATE, // Bloquear filas para evitar race conditions de stock
    });

    // 2. Validar existencia y stock de cada item
    const productMap = {};
    products.forEach(p => { productMap[p.id] = p; });

    let total = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = productMap[item.product_id];
      if (!product) {
        throw { statusCode: 400, message: `Producto ${item.product_id} no encontrado.` };
      }
      if (product.stock < item.quantity) {
        throw { statusCode: 400, message: `Stock insuficiente para "${product.name}". Disponible: ${product.stock}.` };
      }

      const lineTotal = parseFloat(product.price) * item.quantity;
      total += lineTotal;

      orderItemsData.push({
        product_id: product.id,
        quantity: item.quantity,
        unit_price: product.price,
      });

      // 3. Descontar stock
      await product.decrement('stock', { by: item.quantity, transaction: t });
    }

    // 4. Crear la orden
    const order = await Order.create({
      user_id: userId,
      total: total.toFixed(2),
      status: 'pending',
      shipping_address,
      notes,
    }, { transaction: t });

    // 5. Crear los items de la orden
    const createdItems = await OrderItem.bulkCreate(
      orderItemsData.map(i => ({ ...i, order_id: order.id })),
      { transaction: t }
    );

    return { order, items: createdItems };
  });

  // Cargar la orden completa con relaciones para la respuesta
  const fullOrder = await Order.findByPk(result.order.id, {
    include: [{
      association: 'items',
      include: [{ association: 'product', attributes: ['id', 'name', 'image_url', 'price'] }],
    }],
  });

  res.status(201).json({
    message: 'Orden creada exitosamente. 🎉',
    order: fullOrder,
  });
};

/**
 * GET /api/orders
 * Listar órdenes del usuario autenticado
 */
const getMyOrders = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const { rows: orders, count: total } = await Order.findAndCountAll({
    where: { user_id: req.user.id },
    include: [{
      association: 'items',
      include: [{ association: 'product', attributes: ['id', 'name', 'image_url'] }],
    }],
    order: [['created_at', 'DESC']],
    limit: parseInt(limit),
    offset,
    distinct: true,
  });

  res.json({
    orders,
    pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) },
  });
};

/**
 * GET /api/orders/:id
 * Detalle de una orden específica (solo dueño o admin)
 */
const getOrderById = async (req, res) => {
  const where = { id: req.params.id };
  if (req.user.role !== 'admin') where.user_id = req.user.id;

  const order = await Order.findOne({
    where,
    include: [
      { association: 'user', attributes: ['id', 'name', 'email'] },
      {
        association: 'items',
        include: [{ association: 'product', attributes: ['id', 'name', 'image_url', 'material'] }],
      },
    ],
  });

  if (!order) {
    return res.status(404).json({ error: 'Orden no encontrada.' });
  }

  res.json({ order });
};

/**
 * PATCH /api/orders/:id/status  (Admin)
 * Actualizar el estado de una orden
 */
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Estado inválido. Valores permitidos: ${validStatuses.join(', ')}` });
  }

  const order = await Order.findByPk(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Orden no encontrada.' });
  }

  // Si se cancela, restaurar stock
  if (status === 'cancelled' && order.status !== 'cancelled') {
    await sequelize.transaction(async (t) => {
      const items = await OrderItem.findAll({ where: { order_id: order.id }, transaction: t });
      for (const item of items) {
        await Product.increment('stock', { by: item.quantity, where: { id: item.product_id }, transaction: t });
      }
      await order.update({ status }, { transaction: t });
    });
  } else {
    await order.update({ status });
  }

  res.json({ message: `Orden actualizada a estado: ${status}`, order });
};

/**
 * GET /api/orders/all  (Admin)
 * Listar todas las órdenes del sistema
 */
const getAllOrders = async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const where = status ? { status } : {};
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const { rows: orders, count: total } = await Order.findAndCountAll({
    where,
    include: [
      { association: 'user', attributes: ['id', 'name', 'email'] },
      { association: 'items' },
    ],
    order: [['created_at', 'DESC']],
    limit: parseInt(limit),
    offset,
    distinct: true,
  });

  res.json({
    orders,
    pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) },
  });
};

module.exports = { createOrder, getMyOrders, getOrderById, updateOrderStatus, getAllOrders };
