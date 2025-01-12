//  routes/uploadRouter.js
const { Router } = require("express");
const uploadController = require("../controllers/uploadController");
const fileDetailsController = require("../controllers/fileDetailsController");
const uploadRouter = Router();
const multer = require("multer");
const { isAuth } = require("../config/authMiddleware");

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files to the "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});
const upload = multer({ storage });

uploadRouter.get("/file/:id", isAuth, fileDetailsController.fileDetailsGET);

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
