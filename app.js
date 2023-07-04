const express = require("express");
const connectDB = require("./config/db");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const passport = require("passport");

require("./models/User");
require("./models/Post");
require("./models/Comment");

const app = express();

connectDB();
require("./config/passport");

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.json());

app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", require("./routes/auth"));
app.use("/", require("./routes/index"));
app.use("/", require("./routes/profile"));
app.use("/", require("./routes/post"));
app.use("/", require("./routes/comment"));
app.use("/", require("./routes/upload"));

app.get("/*", (req, res) => {
  res.render("error-404");
});

app.listen(3000, () => {
  console.log("Server is running on Port 3000");
});
