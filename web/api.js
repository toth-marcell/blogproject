import express from "express";
import { User, Post } from "./models.js";
import { Login, Register, ObtainToken, ValidateToken } from "./auth.js";

const app = express();
export default app;

app.get("/test", async (req, res) => {
  res.end();
});
