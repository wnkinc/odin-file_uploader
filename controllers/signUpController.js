// signUpController.js
// const db = require("../db/queries");
const passport = require("../config/passport");
const genPassword = require("../config/passwordUtils").genPassword;
const { validationResult } = require("../config/express-validator");

async function signUpGET(req, res) {
  res.render("sign-up", {
    title: "Sign Up",
    user: req.user,
    data: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    }, // Empty fields for initial load
  });
}

async function signUpPOST(req, res) {
  const errors = validationResult(req);

  const { firstName, lastName, username, email, password, admin } = req.body;

  if (!errors.isEmpty()) {
    return res.render("sign-up", {
      title: "Sign Up",
      user: req.user,
      errors: errors.array(),
      data: { firstName, lastName, username, email },
    });
  }

  try {
    // Generate the salt and hash for the password
    const saltHash = genPassword(password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    // Insert the user into the database and get their id
    const userId = await db.insertUser(
      firstName,
      lastName,
      username,
      email,
      hash,
      salt,
      admin
    );

    // Authenticate the user immediately after signup
    req.login({ id: userId, username }, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Login failed after sign up." });
      }
      // Redirect to the join page or dashboard
      res.redirect("/join");
    });
  } catch (error) {
    // Handle the error, e.g., send a response indicating the username is taken
    if (error.message === "Username already taken") {
      return res.render("sign-up", {
        title: "Sign Up",
        user: req.user,
        errors: [
          { msg: "Username is already taken, please choose another one." },
        ],
        data: { firstName, lastName, username, email },
      });
    }

    if (error.message === "Email already taken") {
      return res.render("sign-up", {
        title: "Sign Up",
        user: req.user,
        errors: [{ msg: "Email is already taken, please choose another one." }],
        data: { firstName, lastName, username, email },
      });
    }

    // Handle other errors
    console.error(error);
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
}

module.exports = {
  signUpGET,
  signUpPOST,
};
