//  routes/signUpRouter.js
const { Router } = require("express");
const signUpController = require("../controllers/signUpController");
const signUpRouter = Router();
const { validateUser } = require("../config/express-validator");

signUpRouter.get("/", signUpController.signUpGET);
signUpRouter.post("/", validateUser, signUpController.signUpPOST);

module.exports = signUpRouter;
