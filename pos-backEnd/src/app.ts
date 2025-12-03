import express from "express";
import authRoutes from "./routes/auth.routes";
import errorHandler from "./middleware/errorHandler";
import productRoutes from "./routes/products.routes";
import categoryRoutes from "./routes/category.routes";
import cartRoutes from "./routes/cart.routes"
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin); 
    },
    credentials: true,
  })
);
app.options("*", cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes)
app.use(errorHandler);

export default app;
