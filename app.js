// app.js
require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");

const signUpRouter = require("./routes/signUpRouter");
const indexRouter = require("./routes/indexRouter");
const loginRouter = require("./routes/loginRouter");
const uploadRouter = require("./routes/uploadRouter");

const session = require("express-session");
var passport = require("passport");

const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const prisma = require("./prisma/prismaClient");

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

/**
 * -------------- SESSION SETUP ----------------
 */

/**
 * The `pgSession` is used to store session data in PostgreSQL. We provide the `pgPool`
 * connection to interact with the database.
 */
app.use(
  session({
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
    secret: process.env.SECRET || "fallback-secret",
    resave: false, // Prevents resaving unchanged sessions
    saveUninitialized: true, // Saves uninitialized sessions
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */
require("./config/passport");

// app.use(passport.initialize()); //not required
app.use(passport.session());

app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

/**
 * -------------- ROUTES ----------------
 */
app.use("/", indexRouter);

app.use("/sign-up", signUpRouter);
app.use("/upload", uploadRouter);

app.use("/login", loginRouter);
app.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send("Logout failed");
    }

    res.redirect("/");
  });
});

/**
 * -------------- Error handling middleware ----------------
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

/**
 * -------------- SERVER ----------------
 */
// Gracefully shutdown server and disconnect from Prisma
process.on("SIGINT", async () => {
  console.log("Server is shutting down...");
  await prisma.$disconnect(); // Disconnect Prisma Client
  process.exit(0); // Exit the process
});
process.on("SIGTERM", async () => {
  console.log("Server is shutting down...");
  await prisma.$disconnect(); // Disconnect Prisma Client
  process.exit(0); // Exit the process
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Express app - listening on port ${PORT}!`);
});
