// src/server.ts
import dotenv from "dotenv";
import { setupSwagger } from './swagger';

dotenv.config();

import app from "./app";
import { connectDB } from "./config/database";

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

async function startServer() {
  try {
    // Connect to DB
    await connectDB();
setupSwagger(app);

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
