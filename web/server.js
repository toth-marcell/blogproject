import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { User, Post } from "./models.js";
import { Login, Register, ObtainToken, ValidateToken } from "./auth.js";
import cookieParser from "cookie-parser";
import apiApp from "./api.js";

const app = express();
app.use("/api", apiApp);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");
app.locals.siteName = "A blog website";

app.use(async (req, res, next) => {
  try {
    if (req.cookies.user) {
      res.locals.user = await ValidateToken(req.cookies.user);
    } else throw new Error("");
  } catch {
    res.clearCookie("user");
    res.locals.user = null;
  }
  next();
});

function adminOnly(req, res, next) {
  if (res.locals.user && res.locals.user.isAdmin) next();
  else res.redirect("/");
}

app.get("/", async (req, res) => {
  const posts = await Post.findAll({
    include: User,
    order: [["createdAt", "DESC"]],
  });
  res.render("index", { posts: posts });
});

app.get("/post", async (req, res) => {
  const post = await Post.findByPk(req.query.id, { include: User });
  if (post) res.render("index", { posts: [post] });
  else res.redirect("/");
});

app.get("/logout", async (req, res) => {
  res.clearCookie("user");
  res.redirect("/");
});

app.get("/newpost", async (req, res) => {
  if (!res.locals.user) res.redirect("/login");
  else {
    res.locals.pageName = "New post";
    res.render("newpost");
  }
});

app.post("/newpost", async (req, res) => {
  if (!res.locals.user) res.redirect("/login");
  else if (req.body.title == "" || req.body.text == "") {
    res.locals.pageName = "New post";
    res.render("newpost", { msg: "You must fill out both fields!" });
  } else {
    await Post.create({
      title: req.body.title,
      text: req.body.text,
      UserId: res.locals.user.id,
    });
    res.redirect("/");
  }
});

app.get("/login", async (req, res) => {
  res.locals.pageName = "Login";
  res.render("login");
});

app.post("/login", async (req, res) => {
  const result = await Login(req.body.name, req.body.password);
  if (typeof result == "string") {
    res.render("login", { msg: result });
  } else {
    res.cookie("user", ObtainToken(result));
    res.redirect("/");
  }
});

app.post("/register", async (req, res) => {
  const result = await Register(req.body.name, req.body.password);
  if (typeof result == "string") {
    res.render("login", { msg: result });
  } else {
    res.cookie("user", ObtainToken(result));
    res.redirect("/");
  }
});

app.get("/deletepost", async (req, res) => {
  const post = await Post.findByPk(req.query.id, { include: User });
  if (post.User.id == res.locals.user.id || res.locals.user.isAdmin) {
    await post.destroy();
  }
  res.redirect("/");
});

app.get("/profile", async (req, res) => {
  const user = await User.findByPk(req.query.id);
  if (user) res.render("profile", { profile: user });
  else res.redirect("/");
});

app.get("/admin", adminOnly, async (req, res) => {
  res.render("admin", { allUsers: await User.findAll() });
});

app.post("/makeadmin", adminOnly, async (req, res) => {
  const newAdmin = await User.findOne({ where: { name: req.body.name } });
  await newAdmin.update({ isAdmin: true });
  res.redirect("/admin");
});

app.post("/rmadmin", adminOnly, async (req, res) => {
  const newAdmin = await User.findOne({ where: { name: req.body.name } });
  if (res.locals.user.id == newAdmin.id) {
    res.render("admin", {
      allUsers: await User.findAll(),
      msg: "You can't remove admin status from yourself!",
    });
  } else {
    await newAdmin.update({ isAdmin: false });
    res.redirect("/admin");
  }
});

if ((await User.findAll()).length == 0) {
  const name = "a";
  const pass = "a";
  const adminUser = await Register(name, pass);
  adminUser.update({ isAdmin: true });
  console.log(
    `The database is empty, so an admin user named "${name}" with the password "${pass}" has been created!`,
  );
}

const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on :${port}`));
