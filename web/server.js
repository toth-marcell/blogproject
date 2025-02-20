import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { User, Post } from "./models.js";

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.locals.siteName = "A website";

app.get("/", async (req, res) => {
  res.render("index", { posts: await Post.findAll({ include: User }) });
});

app.get("/newpost", async (req, res) => {
  res.render("newpost");
});

const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on :${port}`));
