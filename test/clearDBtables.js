const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function clearDatabase() {
  // Delete all records from all models
  await prisma.file.deleteMany(); // Replace `model1` with your model name
  await prisma.folder.deleteMany();
  await prisma.user.deleteMany();
  await prisma.session.deleteMany(); // Replace `model2` with your model name
  // Repeat for all models
  console.log("All tables have been cleared.");
}

clearDatabase()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
