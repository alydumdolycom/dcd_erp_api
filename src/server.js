const app = require("express");
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";

dotenv.config();

const app = express();
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
