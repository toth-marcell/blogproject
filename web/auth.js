import { User } from "./models.js";
import JWT from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { hash } from "crypto";

function hashPassword(password) {
  const sha256d = hash("sha256", password);
  return bcryptjs.hashSync(sha256d);
}

function comparePassword(userPassword, password) {
  const sha256d = hash("sha256", password);
  return bcryptjs.compareSync(sha256d, userPassword);
}

export const Register = (name, password) => {
  const existingUser = User.findOne({ where: { name: name } });
  if (existingUser) return `A user with name "${name}" already exists!`;
  const newUser = User.create({
    name: name,
    password: hashPassword(password),
  });
  return newUser;
};

export const Login = (name, password) => {
  const existingUser = User.findOne({ where: { name: name } });
  if (!existingUser) return `No user with name "${name}" exists.`;
  if (!comparePassword(existingUser.password, password))
    return "Wrong password!";
  return existingUser;
};

export const ObtainToken = (user) => {
  return JWT.sign({ id: user.id }, process.env.SECRET, { expiresIn: "20y" });
};

export const ValidateToken = (token) => {
  return User.findByPk(JWT.verify(token, process.env.SECRET).id);
};
