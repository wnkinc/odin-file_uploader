//  express-validator.js
const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 15 characters.";

const validateUser = [
  body("username")
    .trim()
    .notEmpty()
    .isAlpha()
    .withMessage(`Username ${alphaErr}`)
    .isLength({ min: 1, max: 15 })
    .withMessage(`Username ${lengthErr}`),
  body("email")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("Email must be a valid email address.")
    .normalizeEmail(),
  body("password")
    .trim()
    .notEmpty()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      returnScore: false,
    })
    .withMessage(
      "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one symbol."
    ),
  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("Confirm Password cannot be empty.")
    .bail()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match."),
];

const validatePasscode = [
  body("passcode")
    .trim()
    .notEmpty()
    .withMessage("Passcode cannot be empty.")
    .custom((value) => {
      if (value.toLowerCase() !== "piano") {
        throw new Error("Incorrect passcode.");
      }
      return true;
    }),
];

const validateMessage = [
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message cannot be empty.")
    .isLength({ min: 15, max: 280 })
    .withMessage("Message must be between 15 and 280 characters."),
];

module.exports = {
  validateUser,
  validatePasscode,
  validationResult,
  validateMessage,
};
