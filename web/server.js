import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { User, Post } from "./models.js";
import { Login, Register, ObtainToken, ValidateToken } from "./auth.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");
app.locals.siteName = "A website";

app.use(async (req, res, next) => {
  try {
    if (req.cookies.user) {
      res.locals.user = ValidateToken(req.cookies.user);
    } else res.locals.user = null;
  } catch {
    res.locals.user = null;
  }
  next();
});

app.get("/", async (req, res) => {
  res.render("index", { posts: await Post.findAll({ include: User }) });
});

app.get("/newpost", async (req, res) => {
  res.render("newpost");
});

app.get("/login", async (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const result = Login(req.body.name, req.body.password);
  if (typeof result == "string") {
    res.render("login", { msg: result });
  } else {
    res.cookie("user", ObtainToken(result));
    res.redirect("/");
  }
});

app.post("/register", async (req, res) => {
  const result = Register(req.body.name, req.body.password);
  if (typeof result == "string") {
    res.render("login", { msg: result });
  } else {
    res.cookie("user", ObtainToken(result));
    res.redirect("/");
  }
});

const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on :${port}`));
