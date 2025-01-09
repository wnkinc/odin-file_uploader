const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const connection = require("../db/pool");
const validPassword = require("./passwordUtils").validPassword;

const customFields = {
  usernameField: "username",
  passwordField: "password",
};

const verifyCallback = (username, password, done) => {
  connection.query(
    "SELECT * FROM users WHERE username = $1",
    [username],
    (err, result) => {
      if (err) {
        return done(err);
      }
      if (result.rows.length === 0) {
        return done(null, false);
      }

      const user = result.rows[0];

      const isValid = validPassword(password, user.hash, user.salt);

      if (isValid) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    }
  );
};
const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  connection.query(
    "SELECT * FROM users WHERE id = $1",
    [userId],
    (err, result) => {
      if (err) {
        return done(err); // Handle database error
      }
      if (result.rows.length === 0) {
        return done(null, false); // No user found
      }

      const user = result.rows[0];
      done(null, user); // Return the user object
    }
  );
});
