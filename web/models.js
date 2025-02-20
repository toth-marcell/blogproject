import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize("sqlite:data/db.sqlite");

export const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export const Post = sequelize.define("Post", {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.hasMany(Post);
Post.belongsTo(User);

await sequelize.sync();
