-- ============================================================
--  LuxGem Jewelry Store — Base de Datos Inicial
--  PostgreSQL 15
-- ============================================================

-- Extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Enums ────────────────────────────────────────────────────────────────────
CREATE TYPE user_role AS ENUM ('customer', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');

-- ─── Tabla: users ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         VARCHAR(100) NOT NULL,
  email        VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role         user_role DEFAULT 'customer',
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── Tabla: categories ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(80) NOT NULL UNIQUE,
  description TEXT,
  slug        VARCHAR(100) UNIQUE,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── Tabla: products ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         VARCHAR(200) NOT NULL,
  description  TEXT,
  price        NUMERIC(10, 2) NOT NULL CHECK (price > 0),
  stock        INTEGER DEFAULT 0 CHECK (stock >= 0),
  material     VARCHAR(100),
  weight_grams NUMERIC(8, 2),
  image_url    VARCHAR(500),
  images       JSONB DEFAULT '[]',
  is_active    BOOLEAN DEFAULT TRUE,
  category_id  UUID NOT NULL REFERENCES categories(id),
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);

-- ─── Tabla: orders ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES users(id),
  total            NUMERIC(10, 2) NOT NULL,
  status           order_status DEFAULT 'pending',
  shipping_address JSONB NOT NULL,
  notes            TEXT,
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- ─── Tabla: order_items ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id   UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity   INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10, 2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

-- ─── Tabla: reviews ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id),
  rating     SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment    TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_user_product_review UNIQUE (product_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);

-- ============================================================
--  SEED DATA — Datos iniciales de prueba
-- ============================================================

-- Admin user (password: admin123)
INSERT INTO users (id, name, email, password_hash, role) VALUES
  ('00000000-0000-0000-0000-000000000001',
   'Administrador LuxGem',
   'admin@luxgem.com',
   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5o1N8YFuFu', -- admin123
   'admin')
ON CONFLICT (email) DO NOTHING;

-- Demo customer (password: customer123)
INSERT INTO users (id, name, email, password_hash, role) VALUES
  ('00000000-0000-0000-0000-000000000002',
   'María García',
   'maria@example.com',
   '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- customer123
   'customer')
ON CONFLICT (email) DO NOTHING;

-- Categories
INSERT INTO categories (id, name, description, slug) VALUES
  ('10000000-0000-0000-0000-000000000001', 'Anillos', 'Anillos para todas las ocasiones', 'anillos'),
  ('10000000-0000-0000-0000-000000000002', 'Collares', 'Collares y cadenas finas', 'collares'),
  ('10000000-0000-0000-0000-000000000003', 'Pulseras', 'Pulseras elegantes y casuales', 'pulseras'),
  ('10000000-0000-0000-0000-000000000004', 'Aretes', 'Aretes para toda ocasión', 'aretes'),
  ('10000000-0000-0000-0000-000000000005', 'Broches', 'Broches y prendedores exclusivos', 'broches')
ON CONFLICT (slug) DO NOTHING;

-- Products
INSERT INTO products (id, name, description, price, stock, material, weight_grams, category_id, image_url) VALUES
  ('20000000-0000-0000-0000-000000000001',
   'Anillo Solitario Diamante',
   'Elegante anillo solitario con diamante natural de 0.5 quilates en oro blanco 18k. Perfecto para compromiso.',
   1850.00, 10, 'Oro Blanco 18k',  4.2,
   '10000000-0000-0000-0000-000000000001',
   'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400'),

  ('20000000-0000-0000-0000-000000000002',
   'Anillo Banda Eternity',
   'Banda eternity en oro amarillo 18k con diamantes de 1.2 quilates totales. Símbolo de amor eterno.',
   2400.00, 7, 'Oro Amarillo 18k', 5.8,
   '10000000-0000-0000-0000-000000000001',
   'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400'),

  ('20000000-0000-0000-0000-000000000003',
   'Collar Cadena Veneciana',
   'Cadena veneciana en plata de ley 925 con baño de rodio. Longitud 45cm. Elegante y versátil.',
   185.00, 25, 'Plata 925', 6.5,
   '10000000-0000-0000-0000-000000000002',
   'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400'),

  ('20000000-0000-0000-0000-000000000004',
   'Collar Perla Cultivada',
   'Collar de perlas cultivadas de agua dulce con cierre en oro amarillo 14k. Diámetro de perlas: 8-9mm.',
   650.00, 12, 'Plata y Perla', 18.0,
   '10000000-0000-0000-0000-000000000002',
   'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?w=400'),

  ('20000000-0000-0000-0000-000000000005',
   'Pulsera Tennis Diamantes',
   'Pulsera tennis en oro blanco 18k con 28 diamantes brillantes de 0.05ct cada uno. Longitud 18cm.',
   3200.00, 5, 'Oro Blanco 18k', 9.1,
   '10000000-0000-0000-0000-000000000003',
   'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400'),

  ('20000000-0000-0000-0000-000000000006',
   'Pulsera Charm Plata',
   'Pulsera de plata 925 con 5 charms intercambiables: corazón, estrella, flor, luna y llave.',
   120.00, 30, 'Plata 925', 12.5,
   '10000000-0000-0000-0000-000000000003',
   'https://images.unsplash.com/photo-1573408301185-9519f94815d5?w=400'),

  ('20000000-0000-0000-0000-000000000007',
   'Aretes Gota Esmeralda',
   'Aretes tipo gota con esmeraldas naturales de Colombia de 1.8 quilates totales en oro amarillo 18k.',
   980.00, 8, 'Oro Amarillo 18k', 3.4,
   '10000000-0000-0000-0000-000000000004',
   'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400'),

  ('20000000-0000-0000-0000-000000000008',
   'Aretes Aro Diamantados',
   'Aros en oro rosa 14k con pavé de diamantes. Diámetro 20mm. Cierre seguro de palanca.',
   720.00, 15, 'Oro Rosa 14k', 4.8,
   '10000000-0000-0000-0000-000000000004',
   'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400'),

  ('20000000-0000-0000-0000-000000000009',
   'Broche Mariposa Rubí',
   'Broche mariposa con rubíes naturales tailandeses y diamantes en plata 925 con baño de rodio.',
   450.00, 6, 'Plata 925', 8.2,
   '10000000-0000-0000-0000-000000000005',
   'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400'),

  ('20000000-0000-0000-0000-000000000010',
   'Anillo Zafiro Azul',
   'Anillo clásico con zafiro azul natural de Sri Lanka de 2 quilates rodeado de diamantes en platino.',
   4500.00, 3, 'Platino 950', 6.9,
   '10000000-0000-0000-0000-000000000001',
   'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400')
ON CONFLICT DO NOTHING;

-- Sample reviews
INSERT INTO reviews (product_id, user_id, rating, comment) VALUES
  ('20000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000002',
   5,
   'Increíblemente hermoso. Mi novia quedó sin palabras. La calidad es excepcional y el diamante brilla perfectamente.'),
  ('20000000-0000-0000-0000-000000000003',
   '00000000-0000-0000-0000-000000000002',
   4,
   'Muy elegante y bien terminado. El empaque también es muy bonito. Lo recomiendo totalmente.')
ON CONFLICT DO NOTHING;

DO $$
BEGIN
  RAISE NOTICE 'LuxGem DB inicializada con datos de prueba.';
END $$;