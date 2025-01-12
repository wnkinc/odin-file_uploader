// controllers/uploadController.js
const prisma = require("../prisma/prismaClient");

async function uploadGET(req, res) {
  const { id } = req.params; // Folder ID (optional)

  try {
    // Fetch folders belonging to the logged-in user
    const folders = await prisma.folder.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Fetch files in the selected folder, if a folder ID is provided
    let files = [];
    let currentFolder = null;

    if (id) {
      currentFolder = await prisma.folder.findUnique({
        where: {
          id: parseInt(id),
        },
      });

      if (currentFolder && currentFolder.userId === req.user.id) {
        files = await prisma.file.findMany({
          where: {
            folderId: parseInt(id),
          },
        });
      }
    }

    res.render("upload", {
      title: "Upload File",
      user: req.user,
      errors: [],
      folders: folders,
      currentFolder: currentFolder, // Pass current folder
      files: files, // Pass files in the folder
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while loading the page.");
  }
}

async function uploadPOST(req, res) {
  let { id } = req.params; // Folder ID (optional)
  const userId = req.user.id;

  // Default id to 1 (aka Main Folder) if not provided
  id = id || "1";

  try {
    // Check if the folder exists if an ID is provided
    const folderId = parseInt(id, 10);
    if (isNaN(folderId)) {
      return res.status(400).send("Invalid folder ID....");
    }

    let folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    if (!folder) {
      // If folder doesn't exist, you can handle creating it or return an error
      return res.status(404).send("Folder not found.");
    }

    if (folder.userId !== userId) {
      return res.status(403).send("Invalid folder or access denied.");
    }

    // Save file details to the database
    const file = await prisma.file.create({
      data: {
        name: req.file.originalname,
        path: req.file.path,
        folderId: folderId, // Use the parsed folder ID
        userId: userId, // Associate file with the logged-in user
      },
    });

    res.redirect(`/upload/${folderId}`); // Redirect to the folder's page
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while uploading the file.");
  }
}

async function createFolder(req, res) {
  const { name } = req.body;

  try {
    const folder = await prisma.folder.create({
      data: {
        name,
        userId: req.user.id,
      },
    });
    res.redirect("/upload");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while creating the folder.");
  }
}

async function deleteFolder(req, res) {
  const { id } = req.params;

  try {
    const folder = await prisma.folder.findUnique({
      where: { id: parseInt(id) },
    });

    if (!folder || folder.userId !== req.user.id) {
      return res.status(403).send("Invalid folder or access denied.");
    }

    await prisma.folder.delete({
      where: { id: parseInt(id) },
    });

    res.redirect("/upload");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while deleting the folder.");
  }
}

async function editFolder(req, res) {
  const { id } = req.params; // Folder ID from the route parameter
  const { name } = req.body; // New folder name from the form input

  try {
    // Fetch the folder to ensure it exists and belongs to the user
    const folder = await prisma.folder.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!folder || folder.userId !== req.user.id) {
      return res.status(403).send("Invalid folder or access denied.");
    }

    // Update the folder name
    await prisma.folder.update({
      where: { id: parseInt(id, 10) },
      data: { name: name },
    });

    // Redirect to the upload page after editing the folder
    res.redirect("/upload");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while editing the folder.");
  }
}

module.exports = {
  uploadGET,
  uploadPOST,
  createFolder,
  deleteFolder,
  editFolder,
};
