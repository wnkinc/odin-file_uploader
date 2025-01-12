// controllers/uploadController.js
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

module.exports = {
  fileDetailsGET,
};
