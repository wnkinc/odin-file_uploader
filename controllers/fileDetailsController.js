const path = require("path");
const fs = require("fs");
const prisma = require("../prisma/prismaClient");

async function fileDetailsGET(req, res) {
  const { id } = req.params; // file ID

  try {
    const file = await prisma.file.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    res.render("fileDetails", {
      title: "File Details",
      user: req.user,
      file: file,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while loading the page.");
  }
}

async function fileDownloadGET(req, res) {
  const { id } = req.params; // file ID

  try {
    const file = await prisma.file.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!file || !file.path) {
      return res.status(404).send("File not found");
    }

    // Directly use the file path from the database
    const filePath = path.resolve(file.path); // Ensure this resolves the correct file path

    console.log(filePath); // Log the final file path to verify it's correct

    if (fs.existsSync(filePath)) {
      res.download(filePath, file.name, (err) => {
        if (err) {
          console.error(err);
          res.status(500).send("An error occurred while downloading the file.");
        }
      });
    } else {
      res.status(404).send("File not found on server.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while processing the download.");
  }
}

module.exports = {
  fileDetailsGET,
  fileDownloadGET,
};
