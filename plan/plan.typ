#import "@preview/pinit:0.2.2": *
#show heading.where(level: 1): set heading(numbering: "1.")
#let title = "A simple messageboard/blog"
#let author = "Tóth Marcell"
#set document(title: title, author: author)
#set text(10pt, font: "Noto Serif")
#set page(
  footer: context [
    #align(center)[
      \- #here().page() / #counter(page).final().first() \-
    ]
  ],
)
#align(center)[
  #text(1.3em, weight: "bold", title)

  #author
]
Git repository of project: https://github.com/toth-marcell/blogproject
= Function
Users can register or log in and publish posts.
The website's frontpage shows all posts.
Each post can also be viewed separately by clicking on its title, and the author's profile can be viewed by clicking on their name.

Creating a post requires the user to log in first, since each post has an author. Other functions (like reading posts) can be done without an account.
= Web and desktop
The desktop program has only basic features (view and create posts), while the website features the admin page, the ability to view a user's profile and more.
There is a backend which exposes an HTTP API and connects to the database.
= UI design
#image("ui.svg")
#image("ui_login.svg")
#image("ui_loggedin.svg")
#image("ui_newpost.svg")

= Events
- login
- register
- post

= Database
#grid(
  columns: 2,
  gutter: 2cm,
  table(
    [*User*],
    [id #pin("userId")],
    "name",
    "password",
    "admin?"
  ),
  table(
    [*Post*],
    "id",
    "title",
    "text",
    [#pinit-arrow(0,"userId", start-dy: 5pt, end-dy: -3pt)#pin(0)UserId],
  ),
)
= Website routes
#table(
  columns: 2,
  column-gutter: 1cm,
  stroke: none,
  "/", "front page, where all posts are visible",
  "/login", "login and register forms",
  "/newpost", "form to create new post",
  "/post?id=", "view a specific post",
  "/user?id=", "view information about specific user",
  "/admin", "admin page (only for admin users)",
)
= API routes
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
