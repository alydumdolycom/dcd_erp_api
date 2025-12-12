export const AuthValidation = {
  register(body) {
    const errors = [];

    if (!body.nume_complet || body.nume_complet.length < 3)
      errors.push("Numele complet este necesar.");

    if (!body.email || !body.email.includes("@"))
      errors.push("Email invalid.");

    if (!body.parola_hash || body.parola_hash.length < 6)
      errors.push("Parola trebuie să aibă minim 6 caractere.");

    return errors;
  },

  login(body) {
    const errors = [];
    if (!body.nume_complet) errors.push(".");
    if (!body.parola_hash) errors.push("Parola necesară.");
    return errors;
  },

  recover(body) {
    const errors = [];
    if (!body.email) errors.push(".");
    return errors;
  },

  reset(body) {
    const errors = [];
    if (!body.token) errors.push("Token invalid.");
    if (!body.parola_hash || body.parola_hash.length < 6)
      errors.push("Parola trebuie să aibă minim 6 caractere.");
    return errors;
  }
};
