import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// Load .env from project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({
    path: path.resolve(__dirname, "../.env")
});

// Import module routers
import usersRoutes from "./modules/users/users.routes.js";
// import rolesRoutes from "./modules/roles/roles.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
// import accountRoutes from "./modules/account/index.js";
import employeesRoutes from "./modules/employees/index.js";
import lookupsRoutes from "./modules/lookups/index.js";
const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
}));

// API base path
app.use("/api/users", usersRoutes);
// app.use("/api/roles", rolesRoutes);
app.use("/api/auth", authRoutes);
// app.use("/api/account", accountRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/lookups", lookupsRoutes);

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "OK", uptime: process.uptime() });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
