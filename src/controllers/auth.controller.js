import { checkUser } from "../services/users.service.js";

export async function login(nume_complet, parola_hash) {

  const utilizator = await checkUser(nume_complet, parola_hash);

  if (!utilizator) {
    return false;
  }
  return utilizator;
}
