const db = require("./db");
const { User } = require("./index");

const seed = async () => {
  try {
    db.logging = false;
    await db.sync({ force: true }); // Drop and recreate tables

    const users = await User.bulkCreate([
      { email: "admin", 
        passwordHash: User.hashPassword("admin123"), 
        firstname: "Admin", 
        lastname: "User",
      },
      { email: "user1", 
        passwordHash: User.hashPassword("user111"), 
        firstname: "User", 
        lastname: "One",
      },
      { email: "user2", 
        passwordHash: User.hashPassword("user222"), 
        firstname: "User", 
        lastname: "Two",
      },
    ]);

    console.log(`👤 Created ${users.length} users`);

    // Create more seed data here once you've created your models
    // Seed files are a great way to test your database schema!

    console.log("🌱 Seeded the database");
  } catch (error) {
    console.error("Error seeding database:", error);
    if (error.message.includes("does not exist")) {
      console.log("\n🤔🤔🤔 Have you created your database??? 🤔🤔🤔");
    }
  }
  db.close();
};

seed();
