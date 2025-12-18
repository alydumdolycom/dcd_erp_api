import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
const app = express();

// Load .env from project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({
    path: path.resolve(__dirname, "../.env")
});

// Import module routers
import usersRoutes from "./modules/users/users.routes.js";
import rolesRoutes from "./modules/roles/roles.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
// import accountRoutes from "./modules/account/index.js";
import employeesRoutes from "./modules/employees/index.js";
import lookupsRoutes from "./modules/lookups/index.js";
import companiesRoutes from "./modules/companies/companies.routes.js";
// Middlewares
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:3000",
  "http://165.232.138.233",
  "http://localhost:5173"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow Postman / server-to-server calls
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


// API base path
app.use("/api/users", usersRoutes);
app.use("/api/roles", rolesRoutes);
app.use("/api/auth", authRoutes);
// app.use("/api/account", accountRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/lookups", lookupsRoutes);
app.use("/api/companies", companiesRoutes);

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "OK", uptime: process.uptime() });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
