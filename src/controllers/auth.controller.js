import jwt from "jsonwebtoken";
import { checkUser } from "../services/users.service.js";

export async function login(req, res) {
  const { utilizator, parola } = req.body;

  const user = await checkUser(utilizator, parola);

  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, utilizator: user.utilizator },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return res.json({ success: true, token });
}
