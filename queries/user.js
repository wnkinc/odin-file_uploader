// src/queries/userService.js
const prisma = require("../prisma/prismaClient");

// Insert user into the database
async function insertUser(
  firstName,
  lastName,
  username,
  email,
  hash,
  salt,
  admin
) {
  try {
    // Check if the username is already taken
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      throw new Error("Username already taken");
    }

    // Check if the email is already taken
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      throw new Error("Email already taken");
    }

    // Create a new user in the database
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        email,
        hash,
        salt,
        admin,
      },
    });

    return newUser.id; // Return the inserted user's ID
  } catch (error) {
    console.error("Error inserting user:", error);
    throw error;
  }
}

module.exports = {
  insertUser,
};
