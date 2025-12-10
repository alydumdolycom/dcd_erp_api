import { Router } from "express";
import { auth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/utilizatori", auth, async (req, res) => {
  // listare personal utilizatori
  const result = await pool.query(`SELECT id_utilizator, nume_complet, email, activ FROM admin.utilizatori ORDER BY id ASC`);
  res.json(result.rows);
});

export default router;
