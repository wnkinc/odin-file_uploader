//  routes/indexRouter.js
const { Router } = require("express");
const indexController = require("../controllers/indexController");
const indexRouter = Router();

indexRouter.get("/", indexController.indexGET);

module.exports = indexRouter;
