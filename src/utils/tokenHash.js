// ESM
import { createHash } from "crypto";

export function hashToken(token) {
  if (typeof token !== "string") {
    throw new TypeError("token must be a string");
  }

  return createHash("sha256")
    .update(token, "utf8")
    .digest("hex");
}
