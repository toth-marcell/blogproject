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
#image("desktop.png", width: 100%)
== API
- JSON-based API
- has multiple methods to provide a similar experience to the website
== Database
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
== Authentication
- user password are hashed twice
  - once with sha256 to limit length (bcrypt has a max input size)
  - once with bcrypt (salted)
- JWT for sessions
  - website sends the token as a cookie
  - API sends it in the body, so the desktop program can handle storing it
= End
Any questions?
