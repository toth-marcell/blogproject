import express from "express";
import { User, Post } from "./models.js";
import { Login, Register, ObtainToken, ValidateToken } from "./auth.js";

const app = express();
export default app;
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    if (req.body.token) {
      res.locals.user = await ValidateToken(req.body.token);
    } else throw new Error("");
  } catch {
    res.locals.user = null;
  }
  next();
});

function APIError(req, res, msg) {
  res.status(400);
  res.json({ msg: msg });
}

app.get("/posts", async (req, res) => {
  const posts = await Post.findAll({
    include: User,
    order: [["createdAt", "DESC"]],
  });
  const outList = [];
  for (const post of posts) {
    outList.push({
      id: post.id,
      title: post.title,
      text: post.text,
      createdAt: post.createdAt,
      user: {
        id: post.User.id,
        name: post.User.name,
        isAdmin: post.User.isAdmin,
      },
    });
  }
  res.json(outList);
});

app.post("/login", async (req, res) => {
  const result = await Login(req.body.name, req.body.password);
  if (typeof result == "string") {
    APIError(req, res, result);
  } else {
    res.json({
      token: ObtainToken(result),
      id: result.id,
      isAdmin: result.isAdmin,
    });
  }
});

app.post("/register", async (req, res) => {
  const result = await Register(req.body.name, req.body.password);
  if (typeof result == "string") {
    APIError(req, res, result);
  } else {
    res.json({
      token: ObtainToken(result),
      id: result.id,
      isAdmin: result.isAdmin,
    });
  }
});

app.post("/post", async (req, res) => {
  if (!res.locals.user) APIError(req, res, "You must be logged in to do that!");
  else {
    await Post.create({
      title: req.body.title,
      text: req.body.text,
      UserId: res.locals.user.id,
    });
    res.end();
  }
});

app.post("/deletepost", async (req, res) => {
  const post = await Post.findByPk(req.query.id, { include: User });
  if (post.User.id == res.locals.user.id || res.locals.user.isAdmin) {
    await post.destroy();
    res.end();
  } else APIError(req, res, "You aren't allowed to do that!");
});

app.get("/profile", async (req, res) => {
  const user = await User.findByPk(req.query.id);
  if (user)
    res.json({
      name: user.name,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
    });
  else APIError(req, res, "No such user");
});
