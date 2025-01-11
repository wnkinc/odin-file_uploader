//  routes/uploadRouter.js
const { Router } = require("express");
const uploadController = require("../controllers/uploadController");
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

uploadRouter.post("/folder", isAuth, uploadController.createFolder);
uploadRouter.delete("/folder/:id", isAuth, uploadController.deleteFolder);

uploadRouter.get("/:id?", isAuth, uploadController.uploadGET);
uploadRouter.post("/:id?", upload.single("file"), uploadController.uploadPOST);

module.exports = uploadRouter;
