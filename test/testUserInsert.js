const { insertUser } = require("../queries/user");
const prisma = require("../prisma/prismaClient");

async function testInsertUser() {
  try {
    // Sample user data for testing
    const firstName = "John";
    const lastName = "Doe";
    const username = "johndoe";
    const email = "johndoe@example.com";
    const hash = "somehashedpassword";
    const salt = "somepasswordsalt";
    const admin = false;

    // Call the insertUser function
    const userId = await insertUser(
      firstName,
      lastName,
      username,
      email,
      hash,
      salt,
      admin
    );

    console.log("User inserted with ID:", userId);

    // Optionally, you can verify the data in the database to confirm the insert
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    console.log("Inserted user details:", user);
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    // Disconnect Prisma Client
    await prisma.$disconnect();
  }
}

// Run the test
testInsertUser();
