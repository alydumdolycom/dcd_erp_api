import crypto from "crypto";

export function sha1(value) {
  return crypto.createHash("sha1").update(value).digest("hex");
}