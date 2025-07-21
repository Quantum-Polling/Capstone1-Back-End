const db = require("./db");
const { User, Poll, PollOption, PollVote } = require("./index");

const seed = async () => {
  try {
    db.logging = false;
    await db.sync({ force: true }); // Drop and recreate tables

    const users = await User.bulkCreate([
      {
        email: "Mohammed@example.com",
        passwordHash: User.hashPassword("user111"),
        firstName: "Mohammed",
        lastName: "Islam",
        role: "Admin",
      },
      {
        email: "Joseph@example.com",
        passwordHash: User.hashPassword("user222"),
        firstName: "Joseph",
        lastName: "Collado",
        role: "Admin",
      },
      {
        email: "Pedro@example.com",
        passwordHash: User.hashPassword("user333"),
        firstName: "Pedro",
        lastName: "Ortega",
        role: "Admin",
      },
        email: "Michaelangelo@example.com",
        passwordHash: User.hashPassword("user444"),
        firstName: "Michaelangelo",
        lastName: "Javier",
        role: "Admin",
      },
      {
        email: "Test@example.com",
        passwordHash: User.hashPassword("user555"),
        firstName: "Test",
        lastName: "Testerson",
        role: "User",
      }
    ]);

    console.log(`👤 Created ${users.length} users`);

    const polls = await Poll.bulkCreate([
      {
        title: "What to watch",
        description: "It's movie night! What should we watch?",
        status: "Open",
        close_date: "2025-07-25",
        creatorId: 1,
      },
      {
        title: "What to eat",
        description: "Help us decided what to get for dinner!",
        status: "Open",
        close_date: null,
        creatorId: 2,
      },
      {
        title: "Example Poll",
        description: "This is a sample draft poll",
        status: "Draft",
        close_date: null,
        creatorId: 5,
      },
    ]);

    console.log(`📄 Created ${polls.length} polls`);

    const options = await PollOption.bulkCreate([
      { pollId: 1, text: "Wick is Pain" },
      { pollId: 1, text: "Last Breath" },
      { pollId: 1, text: "Until Dawn" },
      { pollId: 1, text: "Bring Her Back" },
      { pollId: 1, text: "A Working Man" },
      { pollId: 1, text: "Room Six" },
      { pollId: 1, text: "Karate Kid: Legends" },

      { pollId: 2, text: "Thai" },
      { pollId: 2, text: "Ramen" },
      { pollId: 2, text: "Mexican" },
      { pollId: 2, text: "Pizza" },
      { pollId: 2, text: "Wings" },
      { pollId: 2, text: "KBBQ" },
      { pollId: 2, text: "Venezuelan" },

      { pollId: 3, text: "Example Option #1" },
      { pollId: 3, text: "Example Option #2" },
    ]);

    console.log(`📑 Created ${options.length} poll options`);

    const votes = await PollVote.bulkCreate([
      { userId: 1, pollId: 1, optionId: 1, rank: 1, submitted: true },
      { userId: 1, pollId: 1, optionId: 2, rank: 6, submitted: true },
      { userId: 1, pollId: 1, optionId: 3, rank: 3, submitted: true },
      { userId: 1, pollId: 1, optionId: 4, rank: 5, submitted: true },
      { userId: 1, pollId: 1, optionId: 5, rank: 7, submitted: true },
      { userId: 1, pollId: 1, optionId: 6, rank: 4, submitted: true },
      { userId: 1, pollId: 1, optionId: 7, rank: 2, submitted: true },

      { userId: 2, pollId: 1, optionId: 1, rank: 5, submitted: true },
      { userId: 2, pollId: 1, optionId: 2, rank: 7, submitted: true },
      { userId: 2, pollId: 1, optionId: 3, rank: 1, submitted: true },
      { userId: 2, pollId: 1, optionId: 4, rank: 4, submitted: true },
      { userId: 2, pollId: 1, optionId: 5, rank: 3, submitted: true },
      { userId: 2, pollId: 1, optionId: 6, rank: 6, submitted: true },
      { userId: 2, pollId: 1, optionId: 7, rank: 2, submitted: true },

      { userId: 3, pollId: 1, optionId: 1, rank: 4 },
      { userId: 3, pollId: 1, optionId: 3, rank: 2 },
      { userId: 3, pollId: 1, optionId: 6, rank: 3 },
      { userId: 3, pollId: 1, optionId: 7, rank: 1 },

      { userId: 4, pollId: 1, optionId: 4, rank: 1 },
      { userId: 4, pollId: 1, optionId: 5, rank: 2 },

      { userId: 1, pollId: 2, optionId: 8, rank: 5, submitted: true },
      { userId: 1, pollId: 2, optionId: 9, rank: 1, submitted: true },
      { userId: 1, pollId: 2, optionId: 10, rank: 2, submitted: true },
      { userId: 1, pollId: 2, optionId: 12, rank: 3, submitted: true },
      { userId: 1, pollId: 2, optionId: 13, rank: 4, submitted: true },

      { userId: 2, pollId: 2, optionId: 10, rank: 2, submitted: true },
      { userId: 2, pollId: 2, optionId: 12, rank: 3, submitted: true },
      { userId: 2, pollId: 2, optionId: 14, rank: 1, submitted: true },

      { userId: 4, pollId: 2, optionId: 8, rank: 7, submitted: true },
      { userId: 4, pollId: 2, optionId: 9, rank: 5, submitted: true },
      { userId: 4, pollId: 2, optionId: 10, rank: 2, submitted: true },
      { userId: 4, pollId: 2, optionId: 11, rank: 1, submitted: true },
      { userId: 4, pollId: 2, optionId: 12, rank: 4, submitted: true },
      { userId: 4, pollId: 2, optionId: 13, rank: 3, submitted: true },
      { userId: 4, pollId: 2, optionId: 14, rank: 6, submitted: true },
    ]);

    console.log(`🗳 Created ${votes.length} poll votes`);

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
