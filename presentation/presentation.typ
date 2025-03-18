#import "@preview/pinit:0.2.2": *
#import "@preview/touying:0.6.1": *
#import themes.simple: *
#show: simple-theme.with(aspect-ratio: "4-3")
#let title = "A blog platform"
#let author = "Tóth Marcell"
#set document(title: title, author: author)
#set text(font: "Noto Serif")
#show raw: set text(font: "Hack")
= #title
_ #author _
== Functions
- users can register an account
- create blog posts
- view the profile of an user (list of their posts)
- can delete their own posts
- administrators: can delete any post and see list of users
== Web
- backend
  - runs in `node`
  - uses `ejs` to render pages
- frontend
  - no javascript on frontend
  - the server sends html with everything included
  - uses HTML forms for user input
#image("web.png", width: 100%)
== Desktop
- WPF program
- view, create, and delete posts
- no admin features
- communicates using the API
- Newtonsoft.Json dependency for parsing and sending JSON
#image("desktop.png", width: 100%)
== API
- JSON-based API
- has multiple methods to provide a similar experience to the website
#[
  #set text(19pt)
  #table(
    columns: 4,
    [*Method*], [*Route*], [*Inputs*], [*Outputs*],
    "POST", "/api/login", "username, password", "session token if username exists and password matches",
    "POST",
    "/api/register",
    "username, password",
    "session token if username doesn't already exist and new user was created successfully",

    "POST", "/api/newpost", "post text", "success upon creation of new post, uses logged in user as the post's userId",
    "GET", "/api/posts", "", "all posts",
    "GET", "/api/post?id=", "post id in query", "specific post",
    "GET", "/api/user?id=", "user id in query", "information about user",
  )
]
== Database design
#align(center)[
  #set table.cell(inset: 10pt)
  #set text(30pt)
  #grid(
    columns: 2,
    gutter: 5cm,
    table(
      text(weight: "bold", "User"),
      [id #pin("userId")],
      "name",
      "password",
      "isAdmin"
    ),
    table(
      text(weight: "bold", "Post"),
      "id",
      "title",
      "text",
      [#pinit-arrow(0,"userId", start-dy: 5pt, end-dy: -3pt)#pin(0)UserId],
    ),
  )
]
== Database code
#[
  #set text(20pt)
  #grid(
    columns: 2,
    [```js
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
        isAdmin: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      });
      ```],
    [```js
      export const Post = sequelize.define("Post", {
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        text: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      });
      ```],
  )
  #align(center)[
    ```js
    User.hasMany(Post);
    Post.belongsTo(User);
    ```]
]
== Authentication
- user password are hashed twice
  - once with sha256 to limit length (bcrypt has a max input size)
  - once with bcrypt (salted)
- JWT for sessions
  - website sends the token as a cookie
  - API sends it in the body, so the desktop program can handle storing it
== Authentication code (excerpt)
#text(20pt)[
  ```js
  function hashPassword(password) {
    const sha256d = hash("sha256", password);
    return bcryptjs.hashSync(sha256d);
  }
  function comparePassword(userPassword, password) {
    const sha256d = hash("sha256", password);
    return bcryptjs.compareSync(sha256d, userPassword);
  }
  export const Login = async (name, password) => {
    if (name == "" || password == "")
      return "You can't have an empty name or password!";
    const existingUser = await User.findOne({ where: { name: name } });
    if (!existingUser) return `No user with name "${name}" exists.`;
    if (!comparePassword(existingUser.password, password))
      return "Wrong password!";
    return existingUser;
  };
  ```
]
= End
Any questions?
