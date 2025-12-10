import { Router } from "express";
import { auth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/utilizatori", auth, async (req, res) => {
  const result = await pool.query(`SELECT * FROM admin.utilizatori ORDER BY id ASC`);
  res.json(result.rows);
});

export default router;
