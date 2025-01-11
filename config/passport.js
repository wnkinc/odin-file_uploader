const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const prisma = require("../prisma/prismaClient");
const validPassword = require("./passwordUtils").validPassword;

const customFields = {
  usernameField: "username",
  passwordField: "password",
};

const verifyCallback = async (username, password, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      return done(null, false); // No user found
    }

    const isValid = validPassword(password, user.hash, user.salt);

    if (isValid) {
      return done(null, user);
    } else {
      return done(null, false); // Invalid password
    }
  } catch (err) {
    return done(err); // Handle error
  }
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return done(null, false); // No user found
    }

    done(null, user); // Return the user object
  } catch (err) {
    done(err); // Handle error
  }
});
