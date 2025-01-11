const prisma = require("../prisma/prismaClient");

async function testInsertUser() {
  try {
    // Verify if Prisma can fetch data
    const users = await prisma.User.findMany(); // Try to fetch users from the User table
    console.log("Current users in the database:", users);
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    // Disconnect Prisma Client
    await prisma.$disconnect();
  }
}

// Run the test
testInsertUser();
