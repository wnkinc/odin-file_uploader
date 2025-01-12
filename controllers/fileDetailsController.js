const { BlobServiceClient } = require("@azure/storage-blob");
const prisma = require("../prisma/prismaClient");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);
const containerClient = blobServiceClient.getContainerClient(
  process.env.AZURE_CONTAINER_NAME
);

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

    // Use the file path (URL) stored in the database
    const blobUrl = file.path; // Full URL of the blob in Azure

    console.log("Blob URL from DB:", blobUrl); // Debugging

    // Extract raw blob name from URL without decoding it
    const blobName = decodeURIComponent(
      new URL(blobUrl).pathname.split("/").pop()
    );
    console.log("Blob Name (Raw):", blobName);

    // Create a blob client using the encoded blob name
    const blobClient = containerClient.getBlobClient(blobName);
    console.log("BlobClient URL:", blobClient.url);

    const downloadBlockBlobResponse = await blobClient.download(0);

    // Set the correct headers and pipe the file content to the response
    res.setHeader("Content-Disposition", `attachment; filename=${file.name}`);
    res.setHeader("Content-Type", downloadBlockBlobResponse.contentType);

    downloadBlockBlobResponse.readableStreamBody.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while processing the download.");
  }
}

module.exports = {
  fileDetailsGET,
  fileDownloadGET,
};
