const { BlobServiceClient } = require("@azure/storage-blob");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Initialize the BlobServiceClient with connection string from environment variables
const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

// Get the container client
const containerClient = blobServiceClient.getContainerClient(
  process.env.AZURE_CONTAINER_NAME
);

// The blob URL (make sure to replace with the actual URL of your blob)
const blobUrl =
  "https://odinfileuploaderblob.blob.core.windows.net/odinfileuploader/1736678766250-MAA%20Daily%20Program%20of%20Action%20Meeting%2025-Sept-2024.pdf";

async function testDownload() {
  try {
    // Decode the URL path and get the blob name
    const blobName = decodeURIComponent(
      new URL(blobUrl).pathname.split("/").pop()
    );
    console.log("Decoded Blob Name:", blobName);

    // Get the BlobClient
    const blobClient = containerClient.getBlobClient(blobName);

    // Download the blob (0 means to download the entire blob)
    const downloadBlockBlobResponse = await blobClient.download(0);

    // Check if the download was successful and log the response content type
    console.log(
      "Downloaded Blob Content Type:",
      downloadBlockBlobResponse.contentType
    );

    // Output the content (first 100 bytes for testing purposes)
    const downloadedData = await streamToBuffer(
      downloadBlockBlobResponse.readableStreamBody
    );
    console.log(
      "First 100 bytes of the downloaded file:",
      downloadedData.slice(0, 100)
    );
  } catch (error) {
    console.error("Error during blob download test:", error);
  }
}

// Helper function to convert the readable stream to a buffer
async function streamToBuffer(readableStream) {
  const chunks = [];
  for await (let chunk of readableStream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

// Run the test download
testDownload();
