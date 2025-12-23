// import jwt from "jsonwebtoken";

// export function auth(req, res, next) {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) return res.status(401).json({ message: "Va rugam sa va autentificati" });

//   try {
//     req.user = jwt.verify(token, process.env.JWT_SECRET);
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Token invalid" });
//   }
// }
import jwt from "jsonwebtoken";

export function auth(req, res, next) {
  const header = req.headers.access_token;

  if (!header) {
    return res.status(401).json({ message: "Lipsă token de acces" });
  }

  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token invalid" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expirat" });
    }
    return res.status(401).json({ message: "Token invalid" });
  }
}
