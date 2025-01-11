//  routes/uploadRouter.js
const { Router } = require("express");
const uploadController = require("../controllers/uploadController");
const uploadRouter = Router();
// const { validateMessage } = require("../config/express-validator");
const { isAuth } = require("../config/authMiddleware");

uploadRouter.get("/", isAuth, uploadController.uploadGET);
// uploadRouter.post("/", validateMessage, messageController.messagePOST);

module.exports = uploadRouter;
