require("dotenv").config();
require("express-async-errors");

const express = require("express");
const cors = require("cors");
const path = require("path");

const { sequelize } = require("./models");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const categoryRoutes = require("./routes/category.routes");
const orderRoutes = require("./routes/order.routes");
const reviewRoutes = require("./routes/review.routes");
const uploadRoutes = require("./routes/upload.routes");

const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 8080;

// ─── Middlewares ───────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL || true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ─── Routes ───────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/upload", uploadRoutes);

// Health check — EB lo va a llamar constantemente
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "LuxGem API is running 💎",
    timestamp: new Date(),
  });
});

app.use(errorHandler);

async function startServer() {
  try {
    try {
      await sequelize.authenticate();
      console.log("✅ Database connected");
    } catch (err) {
      console.error("⚠️ Database connection failed:", err.message);
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 LuxGem API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
