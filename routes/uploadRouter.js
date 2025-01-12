//  routes/uploadRouter.js
const { Router } = require("express");
const uploadController = require("../controllers/uploadController");
const fileDetailsController = require("../controllers/fileDetailsController");
const uploadRouter = Router();
const multer = require("multer");

const { isAuth } = require("../config/authMiddleware");

// Configure Multer to store file data in memory (as a buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

uploadRouter.get("/file/:id", isAuth, fileDetailsController.fileDetailsGET);
uploadRouter.get(
  "/file/:id/download",
  isAuth,
  fileDetailsController.fileDownloadGET
);

uploadRouter.post("/folder", isAuth, uploadController.createFolder);
uploadRouter.post("/folder/:id/delete", isAuth, uploadController.deleteFolder);
uploadRouter.post("/folder/:id/edit", isAuth, uploadController.editFolder);

uploadRouter.get("/:id?", isAuth, uploadController.uploadGET);
uploadRouter.post(
  "/:id?",
  isAuth,
  upload.single("file"),
  uploadController.uploadPOST
);

module.exports = uploadRouter;
