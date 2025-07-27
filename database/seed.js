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
      {
        email: "Michelangelo@example.com",
        passwordHash: User.hashPassword("1234567890"),
        firstName: "Michaelangelo",
        lastName: "Javier",
        role: "Admin",
      },
      {
        email: "user01@example.com",
        passwordHash: User.hashPassword("password01"),
        firstName: "Olivia",
        lastName: "Bennett",
      },
      {
        email: "user02@example.com",
        passwordHash: User.hashPassword("password02"),
        firstName: "Liam",
        lastName: "Ramirez",
      },
      {
        email: "user03@example.com",
        passwordHash: User.hashPassword("password03"),
        firstName: "Emma",
        lastName: "Wong",
      },
      {
        email: "user04@example.com",
        passwordHash: User.hashPassword("password04"),
        firstName: "Noah",
        lastName: "Khan",
      },
      {
        email: "user05@example.com",
        passwordHash: User.hashPassword("password05"),
        firstName: "Ava",
        lastName: "Smith",
      },
      {
        email: "user06@example.com",
        passwordHash: User.hashPassword("password06"),
        firstName: "Elijah",
        lastName: "Nguyen",
      },
      {
        email: "user07@example.com",
        passwordHash: User.hashPassword("password07"),
        firstName: "Isabella",
        lastName: "Martinez",
      },
      {
        email: "user08@example.com",
        passwordHash: User.hashPassword("password08"),
        firstName: "James",
        lastName: "Walker",
      },
      {
        email: "user09@example.com",
        passwordHash: User.hashPassword("password09"),
        firstName: "Sophia",
        lastName: "Patel",
      },
      {
        email: "user10@example.com",
        passwordHash: User.hashPassword("password10"),
        firstName: "Benjamin",
        lastName: "Kim",
      },
      {
        email: "user11@example.com",
        passwordHash: User.hashPassword("password11"),
        firstName: "Mia",
        lastName: "Clark",
      },
      {
        email: "user12@example.com",
        passwordHash: User.hashPassword("password12"),
        firstName: "Lucas",
        lastName: "Lewis",
      },
      {
        email: "user13@example.com",
        passwordHash: User.hashPassword("password13"),
        firstName: "Charlotte",
        lastName: "Robinson",
      },
      {
        email: "user14@example.com",
        passwordHash: User.hashPassword("password14"),
        firstName: "Henry",
        lastName: "Adams",
      },
      {
        email: "user15@example.com",
        passwordHash: User.hashPassword("password15"),
        firstName: "Amelia",
        lastName: "Turner",
      },
      {
        email: "user16@example.com",
        passwordHash: User.hashPassword("password16"),
        firstName: "Alexander",
        lastName: "Torres",
      },
      {
        email: "user17@example.com",
        passwordHash: User.hashPassword("password17"),
        firstName: "Harper",
        lastName: "Hernandez",
      },
      {
        email: "user18@example.com",
        passwordHash: User.hashPassword("password18"),
        firstName: "Sebastian",
        lastName: "Lopez",
      },
      {
        email: "user19@example.com",
        passwordHash: User.hashPassword("password19"),
        firstName: "Evelyn",
        lastName: "Hill",
      },
      {
        email: "user20@example.com",
        passwordHash: User.hashPassword("password20"),
        firstName: "Jackson",
        lastName: "Scott",
      },
      {
        email: "user21@example.com",
        passwordHash: User.hashPassword("password21"),
        firstName: "Abigail",
        lastName: "Green",
      },
      {
        email: "user22@example.com",
        passwordHash: User.hashPassword("password22"),
        firstName: "Daniel",
        lastName: "Evans",
      },
      {
        email: "user23@example.com",
        passwordHash: User.hashPassword("password23"),
        firstName: "Ella",
        lastName: "Baker",
      },
      {
        email: "user24@example.com",
        passwordHash: User.hashPassword("password24"),
        firstName: "Matthew",
        lastName: "Mitchell",
      },
      {
        email: "user25@example.com",
        passwordHash: User.hashPassword("password25"),
        firstName: "Scarlett",
        lastName: "Perez",
      },
      {
        email: "user26@example.com",
        passwordHash: User.hashPassword("password26"),
        firstName: "David",
        lastName: "Carter",
      },
      {
        email: "user27@example.com",
        passwordHash: User.hashPassword("password27"),
        firstName: "Victoria",
        lastName: "Phillips",
      },
      {
        email: "user28@example.com",
        passwordHash: User.hashPassword("password28"),
        firstName: "Joseph",
        lastName: "Price",
      },
      {
        email: "user29@example.com",
        passwordHash: User.hashPassword("password29"),
        firstName: "Grace",
        lastName: "Reed",
      },
      {
        email: "user30@example.com",
        passwordHash: User.hashPassword("password30"),
        firstName: "Samuel",
        lastName: "Morgan",
      },
      {
        email: "user31@example.com",
        passwordHash: User.hashPassword("password31"),
        firstName: "Nora",
        lastName: "Sullivan",
      },
      {
        email: "user32@example.com",
        passwordHash: User.hashPassword("password32"),
        firstName: "Logan",
        lastName: "Foster",
      },
      {
        email: "user33@example.com",
        passwordHash: User.hashPassword("password33"),
        firstName: "Chloe",
        lastName: "Barnes",
      },
      {
        email: "user34@example.com",
        passwordHash: User.hashPassword("password34"),
        firstName: "Wyatt",
        lastName: "Wells",
      },
      {
        email: "user35@example.com",
        passwordHash: User.hashPassword("password35"),
        firstName: "Zoe",
        lastName: "Fisher",
      },
      {
        email: "user36@example.com",
        passwordHash: User.hashPassword("password36"),
        firstName: "Levi",
        lastName: "Griffin",
      },
      {
        email: "user37@example.com",
        passwordHash: User.hashPassword("password37"),
        firstName: "Hazel",
        lastName: "Henderson",
      },
      {
        email: "user38@example.com",
        passwordHash: User.hashPassword("password38"),
        firstName: "Isaac",
        lastName: "Graham",
      },
      {
        email: "user39@example.com",
        passwordHash: User.hashPassword("password39"),
        firstName: "Lily",
        lastName: "Wallace",
      },
      {
        email: "user40@example.com",
        passwordHash: User.hashPassword("password40"),
        firstName: "Owen",
        lastName: "Warren",
      },
      {
        email: "user41@example.com",
        passwordHash: User.hashPassword("password41"),
        firstName: "Ellie",
        lastName: "Hunter",
      },
      {
        email: "user42@example.com",
        passwordHash: User.hashPassword("password42"),
        firstName: "Gabriel",
        lastName: "Ford",
      },
      {
        email: "user43@example.com",
        passwordHash: User.hashPassword("password43"),
        firstName: "Aria",
        lastName: "Wagner",
      },
      {
        email: "user44@example.com",
        passwordHash: User.hashPassword("password44"),
        firstName: "Carter",
        lastName: "Stevens",
      },
      {
        email: "user45@example.com",
        passwordHash: User.hashPassword("password45"),
        firstName: "Lillian",
        lastName: "Payne",
      },
      {
        email: "user46@example.com",
        passwordHash: User.hashPassword("password46"),
        firstName: "Julian",
        lastName: "Pierce",
      },
      {
        email: "user47@example.com",
        passwordHash: User.hashPassword("password47"),
        firstName: "Natalie",
        lastName: "Woods",
      },
      {
        email: "user48@example.com",
        passwordHash: User.hashPassword("password48"),
        firstName: "Grayson",
        lastName: "Black",
      },
      {
        email: "user49@example.com",
        passwordHash: User.hashPassword("password49"),
        firstName: "Addison",
        lastName: "Cole",
      },
      {
        email: "user50@example.com",
        passwordHash: User.hashPassword("password50"),
        firstName: "Maverick",
        lastName: "Reynolds",
      },
      {
        email: "user51@example.com",
        passwordHash: User.hashPassword("password51"),
        firstName: "Audrey",
        lastName: "Hanson",
      },
      {
        email: "user52@example.com",
        passwordHash: User.hashPassword("password52"),
        firstName: "Lincoln",
        lastName: "Ellis",
      },
      {
        email: "user53@example.com",
        passwordHash: User.hashPassword("password53"),
        firstName: "Brooklyn",
        lastName: "Fox",
      },
      {
        email: "user54@example.com",
        passwordHash: User.hashPassword("password54"),
        firstName: "Jaxon",
        lastName: "Dean",
      },
      {
        email: "user55@example.com",
        passwordHash: User.hashPassword("password55"),
        firstName: "Claire",
        lastName: "Gibson",
      },
      {
        email: "user56@example.com",
        passwordHash: User.hashPassword("password56"),
        firstName: "Nathan",
        lastName: "Lane",
      },
      {
        email: "user57@example.com",
        passwordHash: User.hashPassword("password57"),
        firstName: "Savannah",
        lastName: "Harper",
      },
      {
        email: "user58@example.com",
        passwordHash: User.hashPassword("password58"),
        firstName: "Aaron",
        lastName: "Peters",
      },
      {
        email: "user59@example.com",
        passwordHash: User.hashPassword("password59"),
        firstName: "Stella",
        lastName: "Knight",
      },
      {
        email: "user60@example.com",
        passwordHash: User.hashPassword("password60"),
        firstName: "Eli",
        lastName: "Austin",
      },
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
        status: "Closed",
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
      { userId: 1, pollId: 1, optionId: 7, rank: 2, submitted: true },
      { userId: 1, pollId: 1, optionId: 3, rank: 3, submitted: true },
      { userId: 1, pollId: 1, optionId: 6, rank: 4, submitted: true },
      { userId: 1, pollId: 1, optionId: 4, rank: 5, submitted: true },
      { userId: 1, pollId: 1, optionId: 2, rank: 6, submitted: true },
      { userId: 1, pollId: 1, optionId: 5, rank: 7, submitted: true },

      { userId: 2, pollId: 1, optionId: 3, rank: 1, submitted: true },
      { userId: 2, pollId: 1, optionId: 7, rank: 2, submitted: true },
      { userId: 2, pollId: 1, optionId: 5, rank: 3, submitted: true },
      { userId: 2, pollId: 1, optionId: 4, rank: 4, submitted: true },
      { userId: 2, pollId: 1, optionId: 1, rank: 5, submitted: true },
      { userId: 2, pollId: 1, optionId: 6, rank: 6, submitted: true },
      { userId: 2, pollId: 1, optionId: 2, rank: 7, submitted: true },

      { userId: 3, pollId: 1, optionId: 7, rank: 1 },
      { userId: 3, pollId: 1, optionId: 3, rank: 2 },
      { userId: 3, pollId: 1, optionId: 6, rank: 3 },
      { userId: 3, pollId: 1, optionId: 1, rank: 4 },

      { userId: 4, pollId: 1, optionId: 4, rank: 1 },
      { userId: 4, pollId: 1, optionId: 5, rank: 2 },

      { userId: 1, pollId: 2, optionId: 14, rank: 1, submitted: true },
      { userId: 1, pollId: 2, optionId: 10, rank: 2, submitted: true },
      { userId: 1, pollId: 2, optionId: 12, rank: 3, submitted: true },
      { userId: 1, pollId: 2, optionId: 13, rank: 4, submitted: true },
      { userId: 1, pollId: 2, optionId: 8, rank: 5, submitted: true },

      { userId: 2, pollId: 2, optionId: 14, rank: 1, submitted: true },
      { userId: 2, pollId: 2, optionId: 10, rank: 2, submitted: true },
      { userId: 2, pollId: 2, optionId: 12, rank: 3, submitted: true },

      { userId: 3, pollId: 2, optionId: 10, rank: 1, submitted: true },
      { userId: 3, pollId: 2, optionId: 14, rank: 2, submitted: true },
      { userId: 3, pollId: 2, optionId: 12, rank: 3, submitted: true },

      { userId: 4, pollId: 2, optionId: 11, rank: 1, submitted: true },
      { userId: 4, pollId: 2, optionId: 10, rank: 2, submitted: true },
      { userId: 4, pollId: 2, optionId: 13, rank: 3, submitted: true },
      { userId: 4, pollId: 2, optionId: 12, rank: 4, submitted: true },
      { userId: 4, pollId: 2, optionId: 9, rank: 5, submitted: true },
      { userId: 4, pollId: 2, optionId: 14, rank: 6, submitted: true },
      { userId: 4, pollId: 2, optionId: 8, rank: 7, submitted: true },

      { userId: 5, pollId: 2, optionId: 10, rank: 1, submitted: true },
      { userId: 5, pollId: 2, optionId: 12, rank: 2, submitted: true },
      { userId: 5, pollId: 2, optionId: 9, rank: 3, submitted: true },

      { userId: 6, pollId: 2, optionId: 14, rank: 1, submitted: true },
      { userId: 6, pollId: 2, optionId: 11, rank: 2, submitted: true },
      { userId: 6, pollId: 2, optionId: 8, rank: 3, submitted: true },
      { userId: 6, pollId: 2, optionId: 13, rank: 4, submitted: true },
      { userId: 6, pollId: 2, optionId: 12, rank: 5, submitted: true },

      { userId: 7, pollId: 2, optionId: 9, rank: 1, submitted: true },
      { userId: 7, pollId: 2, optionId: 8, rank: 2, submitted: true },

      { userId: 8, pollId: 2, optionId: 10, rank: 1, submitted: true },
      { userId: 8, pollId: 2, optionId: 11, rank: 2, submitted: true },
      { userId: 8, pollId: 2, optionId: 9, rank: 3, submitted: true },
      { userId: 8, pollId: 2, optionId: 13, rank: 4, submitted: true },

      { userId: 9, pollId: 2, optionId: 8, rank: 1, submitted: true },
      { userId: 9, pollId: 2, optionId: 12, rank: 2, submitted: true },
      { userId: 9, pollId: 2, optionId: 10, rank: 3, submitted: true },
      { userId: 9, pollId: 2, optionId: 11, rank: 4, submitted: true },

      { userId: 10, pollId: 2, optionId: 14, rank: 1, submitted: true },
      { userId: 10, pollId: 2, optionId: 13, rank: 2, submitted: true },
      { userId: 10, pollId: 2, optionId: 12, rank: 3, submitted: true },
      { userId: 10, pollId: 2, optionId: 11, rank: 4, submitted: true },
      { userId: 10, pollId: 2, optionId: 10, rank: 5, submitted: true },

      { userId: 11, pollId: 2, optionId: 9, rank: 1, submitted: true },

      { userId: 12, pollId: 2, optionId: 8, rank: 1, submitted: true },
      { userId: 12, pollId: 2, optionId: 9, rank: 2, submitted: true },
      { userId: 12, pollId: 2, optionId: 10, rank: 3, submitted: true },

      { userId: 13, pollId: 2, optionId: 12, rank: 1, submitted: true },
      { userId: 13, pollId: 2, optionId: 14, rank: 2, submitted: true },
      { userId: 13, pollId: 2, optionId: 9, rank: 3, submitted: true },
      { userId: 13, pollId: 2, optionId: 11, rank: 4, submitted: true },
      { userId: 13, pollId: 2, optionId: 13, rank: 5, submitted: true },
      { userId: 13, pollId: 2, optionId: 8, rank: 6, submitted: true },
      { userId: 13, pollId: 2, optionId: 10, rank: 7, submitted: true },

      { userId: 14, pollId: 2, optionId: 11, rank: 1, submitted: true },
      { userId: 14, pollId: 2, optionId: 13, rank: 2, submitted: true },

      { userId: 15, pollId: 2, optionId: 8, rank: 1, submitted: true },
      { userId: 15, pollId: 2, optionId: 9, rank: 2, submitted: true },
      { userId: 15, pollId: 2, optionId: 10, rank: 3, submitted: true },
      { userId: 15, pollId: 2, optionId: 11, rank: 4, submitted: true },
      { userId: 15, pollId: 2, optionId: 12, rank: 5, submitted: true },

      { userId: 16, pollId: 2, optionId: 10, rank: 1, submitted: true },
      { userId: 16, pollId: 2, optionId: 11, rank: 2, submitted: true },
      { userId: 16, pollId: 2, optionId: 12, rank: 3, submitted: true },

      { userId: 17, pollId: 2, optionId: 13, rank: 1, submitted: true },
      { userId: 17, pollId: 2, optionId: 14, rank: 2, submitted: true },

      { userId: 18, pollId: 2, optionId: 9, rank: 1, submitted: true },
      { userId: 18, pollId: 2, optionId: 8, rank: 2, submitted: true },
      { userId: 18, pollId: 2, optionId: 12, rank: 3, submitted: true },

      { userId: 19, pollId: 2, optionId: 11, rank: 1, submitted: true },
      { userId: 19, pollId: 2, optionId: 10, rank: 2, submitted: true },
      { userId: 19, pollId: 2, optionId: 9, rank: 3, submitted: true },
      { userId: 19, pollId: 2, optionId: 8, rank: 4, submitted: true },

      { userId: 20, pollId: 2, optionId: 13, rank: 1, submitted: true },
      { userId: 20, pollId: 2, optionId: 12, rank: 2, submitted: true },

      { userId: 21, pollId: 2, optionId: 8, rank: 1, submitted: true },
      { userId: 21, pollId: 2, optionId: 9, rank: 2, submitted: true },
      { userId: 21, pollId: 2, optionId: 10, rank: 3, submitted: true },
      { userId: 21, pollId: 2, optionId: 11, rank: 4, submitted: true },
      { userId: 21, pollId: 2, optionId: 12, rank: 5, submitted: true },
      { userId: 21, pollId: 2, optionId: 13, rank: 6, submitted: true },
      { userId: 21, pollId: 2, optionId: 14, rank: 7, submitted: true },

      { userId: 22, pollId: 2, optionId: 9, rank: 1, submitted: true },
      { userId: 22, pollId: 2, optionId: 11, rank: 2, submitted: true },

      { userId: 23, pollId: 2, optionId: 10, rank: 1, submitted: true },
      { userId: 23, pollId: 2, optionId: 12, rank: 2, submitted: true },
      { userId: 23, pollId: 2, optionId: 14, rank: 3, submitted: true },

      { userId: 24, pollId: 2, optionId: 13, rank: 1, submitted: true },
      { userId: 24, pollId: 2, optionId: 11, rank: 2, submitted: true },

      { userId: 25, pollId: 2, optionId: 8, rank: 1, submitted: true },
      { userId: 25, pollId: 2, optionId: 10, rank: 2, submitted: true },

      { userId: 26, pollId: 2, optionId: 14, rank: 1, submitted: true },
      { userId: 26, pollId: 2, optionId: 12, rank: 2, submitted: true },
      { userId: 26, pollId: 2, optionId: 10, rank: 3, submitted: true },

      { userId: 27, pollId: 2, optionId: 8, rank: 1, submitted: true },
      { userId: 27, pollId: 2, optionId: 9, rank: 2, submitted: true },

      { userId: 28, pollId: 2, optionId: 12, rank: 1, submitted: true },
      { userId: 28, pollId: 2, optionId: 14, rank: 2, submitted: true },
      { userId: 28, pollId: 2, optionId: 11, rank: 3, submitted: true },

      { userId: 29, pollId: 2, optionId: 10, rank: 1, submitted: true },
      { userId: 29, pollId: 2, optionId: 13, rank: 2, submitted: true },

      { userId: 30, pollId: 2, optionId: 8, rank: 1, submitted: true },

      { userId: 31, pollId: 2, optionId: 9, rank: 1, submitted: true },
      { userId: 31, pollId: 2, optionId: 11, rank: 2, submitted: true },
      { userId: 31, pollId: 2, optionId: 13, rank: 3, submitted: true },

      { userId: 32, pollId: 2, optionId: 14, rank: 1, submitted: true },

      { userId: 33, pollId: 2, optionId: 10, rank: 1, submitted: true },
      { userId: 33, pollId: 2, optionId: 9, rank: 2, submitted: true },
      { userId: 33, pollId: 2, optionId: 8, rank: 3, submitted: true },

      { userId: 34, pollId: 2, optionId: 12, rank: 1, submitted: true },
      { userId: 34, pollId: 2, optionId: 13, rank: 2, submitted: true },
      { userId: 34, pollId: 2, optionId: 14, rank: 3, submitted: true },

      { userId: 35, pollId: 2, optionId: 13, rank: 1, submitted: true },
      { userId: 35, pollId: 2, optionId: 9, rank: 2, submitted: true },
      { userId: 35, pollId: 2, optionId: 10, rank: 3, submitted: true },
      { userId: 35, pollId: 2, optionId: 14, rank: 4, submitted: true },

      { userId: 36, pollId: 2, optionId: 8, rank: 1, submitted: true },
      { userId: 36, pollId: 2, optionId: 9, rank: 2, submitted: true },
      { userId: 36, pollId: 2, optionId: 12, rank: 3, submitted: true },

      { userId: 37, pollId: 2, optionId: 14, rank: 1, submitted: true },
      { userId: 37, pollId: 2, optionId: 10, rank: 2, submitted: true },
      { userId: 37, pollId: 2, optionId: 11, rank: 3, submitted: true },

      { userId: 38, pollId: 2, optionId: 13, rank: 1, submitted: true },
      { userId: 38, pollId: 2, optionId: 14, rank: 2, submitted: true },
      { userId: 38, pollId: 2, optionId: 8, rank: 3, submitted: true },
      { userId: 38, pollId: 2, optionId: 12, rank: 4, submitted: true },
      { userId: 38, pollId: 2, optionId: 9, rank: 5, submitted: true },

      { userId: 39, pollId: 2, optionId: 11, rank: 1, submitted: true },
      { userId: 39, pollId: 2, optionId: 14, rank: 2, submitted: true },
      { userId: 39, pollId: 2, optionId: 13, rank: 3, submitted: true },
      { userId: 39, pollId: 2, optionId: 9, rank: 4, submitted: true },
      { userId: 39, pollId: 2, optionId: 10, rank: 5, submitted: true },
      { userId: 39, pollId: 2, optionId: 12, rank: 6, submitted: true },

      { userId: 40, pollId: 2, optionId: 10, rank: 1, submitted: true },
      { userId: 40, pollId: 2, optionId: 8, rank: 2, submitted: true },
      { userId: 40, pollId: 2, optionId: 14, rank: 3, submitted: true },
      { userId: 40, pollId: 2, optionId: 11, rank: 4, submitted: true },

      { userId: 41, pollId: 2, optionId: 9, rank: 1, submitted: true },
      { userId: 41, pollId: 2, optionId: 12, rank: 2, submitted: true },
      { userId: 41, pollId: 2, optionId: 14, rank: 3, submitted: true },

      { userId: 42, pollId: 2, optionId: 13, rank: 1, submitted: true },

      { userId: 43, pollId: 2, optionId: 8, rank: 1, submitted: true },
      { userId: 43, pollId: 2, optionId: 14, rank: 2, submitted: true },
      { userId: 43, pollId: 2, optionId: 9, rank: 3, submitted: true },
      { userId: 43, pollId: 2, optionId: 12, rank: 4, submitted: true },

      { userId: 44, pollId: 2, optionId: 10, rank: 1, submitted: true },
      { userId: 44, pollId: 2, optionId: 13, rank: 2, submitted: true },

      { userId: 45, pollId: 2, optionId: 8, rank: 1, submitted: true },
      { userId: 45, pollId: 2, optionId: 9, rank: 2, submitted: true },
      { userId: 45, pollId: 2, optionId: 10, rank: 3, submitted: true },
      { userId: 45, pollId: 2, optionId: 11, rank: 4, submitted: true },

      { userId: 46, pollId: 2, optionId: 12, rank: 1, submitted: true },
      { userId: 46, pollId: 2, optionId: 9, rank: 2, submitted: true },
      { userId: 46, pollId: 2, optionId: 13, rank: 3, submitted: true },

      { userId: 47, pollId: 2, optionId: 14, rank: 1, submitted: true },
      { userId: 47, pollId: 2, optionId: 11, rank: 2, submitted: true },

      { userId: 48, pollId: 2, optionId: 8, rank: 1, submitted: true },
      { userId: 48, pollId: 2, optionId: 10, rank: 2, submitted: true },
      { userId: 48, pollId: 2, optionId: 12, rank: 3, submitted: true },

      { userId: 49, pollId: 2, optionId: 9, rank: 1, submitted: true },
      { userId: 49, pollId: 2, optionId: 11, rank: 2, submitted: true },
      { userId: 49, pollId: 2, optionId: 13, rank: 3, submitted: true },

      { userId: 50, pollId: 2, optionId: 14, rank: 1, submitted: true },
      { userId: 50, pollId: 2, optionId: 12, rank: 2, submitted: true },

      { userId: 51, pollId: 2, optionId: 8, rank: 1, submitted: true },
      { userId: 51, pollId: 2, optionId: 9, rank: 2, submitted: true },
      { userId: 51, pollId: 2, optionId: 10, rank: 3, submitted: true },
      { userId: 51, pollId: 2, optionId: 11, rank: 4, submitted: true },

      { userId: 52, pollId: 2, optionId: 13, rank: 1, submitted: true },
      { userId: 52, pollId: 2, optionId: 14, rank: 2, submitted: true },
      { userId: 52, pollId: 2, optionId: 10, rank: 3, submitted: true },

      { userId: 53, pollId: 2, optionId: 12, rank: 1, submitted: true },

      { userId: 54, pollId: 2, optionId: 9, rank: 1, submitted: true },
      { userId: 54, pollId: 2, optionId: 11, rank: 2, submitted: true },
      { userId: 54, pollId: 2, optionId: 14, rank: 3, submitted: true },

      { userId: 55, pollId: 2, optionId: 10, rank: 1, submitted: true },
      { userId: 55, pollId: 2, optionId: 13, rank: 2, submitted: true },

      { userId: 56, pollId: 2, optionId: 8, rank: 1, submitted: true },
      { userId: 56, pollId: 2, optionId: 9, rank: 2, submitted: true },
      { userId: 56, pollId: 2, optionId: 12, rank: 3, submitted: true },

      { userId: 57, pollId: 2, optionId: 14, rank: 1, submitted: true },

      { userId: 58, pollId: 2, optionId: 11, rank: 1, submitted: true },
      { userId: 58, pollId: 2, optionId: 10, rank: 2, submitted: true },
      { userId: 58, pollId: 2, optionId: 12, rank: 3, submitted: true },

      { userId: 59, pollId: 2, optionId: 9, rank: 1, submitted: true },

      { userId: 60, pollId: 2, optionId: 13, rank: 1, submitted: true },
      { userId: 60, pollId: 2, optionId: 14, rank: 2, submitted: true },
      { userId: 60, pollId: 2, optionId: 12, rank: 3, submitted: true },
      { userId: 60, pollId: 2, optionId: 10, rank: 4, submitted: true },

      { userId: 61, pollId: 2, optionId: 8, rank: 1, submitted: true },
      { userId: 61, pollId: 2, optionId: 9, rank: 2, submitted: true },
      { userId: 61, pollId: 2, optionId: 11, rank: 3, submitted: true },

      { userId: 62, pollId: 2, optionId: 14, rank: 1, submitted: true },
      { userId: 62, pollId: 2, optionId: 13, rank: 2, submitted: true },

      { userId: 63, pollId: 2, optionId: 12, rank: 1, submitted: true },
      { userId: 63, pollId: 2, optionId: 8, rank: 2, submitted: true },

      { userId: 64, pollId: 2, optionId: 9, rank: 1, submitted: true },
      { userId: 64, pollId: 2, optionId: 14, rank: 2, submitted: true },
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
