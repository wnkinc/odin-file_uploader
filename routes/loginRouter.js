// routes/loginRouter.js
const { Router } = require("express");
const loginController = require("../controllers/loginController");
const loginRouter = Router();
const passport = require("passport");

loginRouter.get("/", loginController.loginGET);
loginRouter.post(
  "/",
  passport.authenticate("local", {
    failureRedirect: "/sign-up",
    successRedirect: "/",
  })
);

module.exports = loginRouter;
