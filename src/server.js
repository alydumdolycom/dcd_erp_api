import express from "express";
const router = express.Router();
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import dotenv from "dotenv";
dotenv.config({ path: '../.env' });
const app = express();

dotenv.config();

app.use(cors());
app.use(cors());
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api", usersRoutes);

app.get("/api/test", (req, res) => {
  res.send("API is working!");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port ", process.env.PORT || 3000);
});



// Define your routes here
router.get("/login", (req, res) => {
  res.send("Login route");
});

// Export the router as default
export default router;
