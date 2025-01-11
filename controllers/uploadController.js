// controllers/uploadController.js

async function uploadGET(req, res) {
  res.render("upload", {
    title: "Upload File",
    user: req.user,
    errors: [],
  });
}

async function uploadPOST(req, res) {
  try {
    if (!req.file) {
      // Handle the case where no file was uploaded
      return res.render("upload", {
        title: "Upload File",
        user: req.user,
        errors: ["No file was uploaded. Please try again."],
      });
    }

    // File upload successful
    return res.render("upload", {
      title: "Upload File",
      user: req.user,
      errors: [],
      message: "File uploaded successfully!",
    });
  } catch (err) {
    console.error("Error uploading file:", err);

    // Handle errors
    return res.render("upload", {
      title: "Upload File",
      user: req.user,
      errors: ["An error occurred while uploading the file. Please try again."],
    });
  }
}

module.exports = {
  uploadGET,
  uploadPOST,
};
