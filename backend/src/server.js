import cors from "cors";
import express from "express";
import {
  alerts,
  buildDashboardData,
  createAlert,
  findProduct,
} from "./data/catalog.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, service: "shopsmart-backend" });
});

app.get("/api/products/search", (request, response) => {
  const query = typeof request.query.q === "string" ? request.query.q : "";
  const dashboard = buildDashboardData(query);

  if (!dashboard) {
    response.status(404).json({ message: "No matching product found." });
    return;
  }

  response.json(dashboard);
});

app.get("/api/products/:productId/history", (request, response) => {
  const product = findProduct(request.params.productId);

  if (!product) {
    response.status(404).json({ message: "Product not found." });
    return;
  }

  response.json({
    product: {
      id: product.id,
      name: product.name,
    },
    history: product.priceHistory,
  });
});

app.get("/api/alerts", (_request, response) => {
  response.json({ alerts });
});

app.post("/api/alerts", (request, response) => {
  const { productId, email, threshold } = request.body ?? {};

  if (!productId || !email || typeof threshold !== "number") {
    response.status(400).json({
      message: "productId, email, and numeric threshold are required.",
    });
    return;
  }

  try {
    const alert = createAlert({ productId, email, threshold });
    response.status(201).json({ alert });
  } catch (error) {
    response.status(404).json({ message: error.message });
  }
});

app.use((_request, response) => {
  response.status(404).json({ message: "Route not found." });
});

app.listen(port, () => {
  console.log(`ShopSmart API running on http://localhost:${port}`);
});
