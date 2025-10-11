const express = require("express");
const app = express();

// Routes import
// const users = require("./routes/user.js");
// const posts = require("./routes/post.js");

// Session setup
const session = require("express-session");
app.use(
  session({
    secret: "mysupersecretstring",
  })
);

// Test route
app.get("/test", (req, res) => {
  res.send("test successful!");
});

// Server start
app.listen(3000, () => {
  console.log("server is listening to 3000");
});
