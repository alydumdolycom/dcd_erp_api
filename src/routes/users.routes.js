import { Router } from "express";
import { auth } from "../middleware/auth.middleware.js";
import { getUsers, updateUser, deleteUser } from "../services/users.service.js";
const router = Router();

router.get("/utilizatori", auth, async (req, res) => {

  // listare personal utilizatori
  const utilizatori = await getUsers(req.query.page, req.query.limit, req.query.sortField, req.query.sortBy);
  res.json({ data: utilizatori });
});

router.patch("/utilizatori/:id", auth, async (req, res) => {
  // actualizare personal utilizatori
  const { id } = req.params;
  const { nume_complet, email, parola_hash, activ } = req.body;
  try {
    const utilizator = await updateUser(id, nume_complet, email, parola_hash, activ);
    if (!utilizator) {
      return res.status(404).json({ error: "Utilizatorul nu a fost gasit." });
    }
    res.json({ message: "Utilizatorul actualizat", user: utilizator });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/utilizatori/:id/soft", auth, async (req, res) => {
  // dezactivare personal utilizatori (stergere soft)
  try {
    const userId = req.params.id; 
    await deleteUser(userId);

    res.json({message: "Utilizator dezactivat"});
  } catch (err) {
    res.status(500).json({ error: "Eroare Server 500" });
  }
});

export default router;
