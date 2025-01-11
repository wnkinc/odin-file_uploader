//  routes/indexRouter.js
const { Router } = require("express");
const indexController = require("../controllers/indexController");
const indexRouter = Router();
// const { isAdmin } = require("./authMiddleware");

indexRouter.get("/", indexController.indexGET);
// indexRouter.post("/:id/delete", isAdmin, indexController.deletePOST);

module.exports = indexRouter;
