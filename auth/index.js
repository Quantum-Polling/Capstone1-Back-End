const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../database");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware to authenticate JWT tokens
const authenticateJWT = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    console.log("We found it");
    console.log(req.cookies);
    return res.status(401).send({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send({ error: "Invalid or expired token" });
    }
    req.user = user;
    console.log(req.user);
    next();
  });
};

// isAdmin MiddleWare

// Auth0 authentication route
router.post("/auth0", async (req, res) => {
  try {

    const { auth0Id, firstName, lastName, email, username } = req.body;

    if (!auth0Id) {
      return res.status(400).send({ error: "Auth0 ID is required" });
    }

    // Try to find existing user by auth0Id first
    let user = await User.findOne({ where: { auth0Id } });

    if (!user && email) {
      // If no user found by auth0Id, try to find by email
      user = await User.findOne({ where: { email } });

      if (user) {
        // Update existing user with auth0Id
        user.auth0Id = auth0Id;
        await user.save();
      }
    }

    if (!user) {
      // Create new user if not found
      const userData = {
        auth0Id,
        email: email || null,
        username: username || email?.split("@")[0] || `user_${Date.now()}`, // Use email prefix as username if no username provided
        passwordHash: null, // Auth0 users don't have passwords
        firstName: firstName,
        lastName: lastName,
      };
      // Ensure username is unique
      let finalUsername = userData.username;
      let counter = 1;
      while (await User.findOne({ where: { username: finalUsername } })) {
        finalUsername = `${userData.username}_${counter}`;
        counter++;
      }
      userData.username = finalUsername;

      user = await User.create(userData);
    }

    // Generate JWT token with auth0Id included
    const token = jwt.sign(
      {
        id: user.id,
        auth0Id: user.auth0Id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarURL: user.avatarURL,
        role: user.role,
        disabled: user.disabled,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.send({
      message: "Auth0 authentication successful",
      user: {
        id: user.id,
        auth0Id: user.auth0Id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarURL: user.avatarURL,
        role: user.role,
        disabled: user.disabled,
      },
    });
  } catch (error) {
    console.error("Auth0 authentication error:", error);
    res.sendStatus(500);
  }
});

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { email, password, firstname, lastname, avatarurl } = req.body;

    if (!email || !password || !firstname || !lastname) {
      return res.status(400).send({ error: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .send({ error: "Password must be at least 6 characters long" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).send({ error: "Email already exists" });
    }

    const passwordHash = User.hashPassword(password);

    const user = await User.create({
      email,
      passwordHash,
      firstName: firstname,
      lastName: lastname,
      avatarURL: avatarurl, // Default avatar
      role: "User", // Default role
    });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarURL: user.avatarURL,
        role: user.role,
        disabled: user.disabled,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.send({
      message: "User created successfully",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarURL: user.avatarURL,
        role: user.role,
        disabled: user.disabled,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.sendStatus(500);
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ error: "All fields are required" });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).send({ error: "Invalid credentials" });
    }

    // Check if user is disabled
    if (user.disabled) {
      return res
        .status(403)
        .json({ message: "This account has been disabled." });
    }

    // Check password
    if (!user.checkPassword(password)) {
      return res.status(401).send({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        auth0Id: user.auth0Id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarURL: user.avatarURL,
        role: user.role,
        disabled: user.disabled,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.send({
      message: "Login successful",
      user: {
        id: user.id,
        auth0Id: user.auth0Id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarURL: user.avatarURL,
        role: user.role,
        disabled: user.disabled,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.sendStatus(500);
  }
});

// Logout route
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.send({ message: "Logout successful" });
});

// Get current user route (protected)
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.send({});
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).send({ error: "Invalid or expired token" });
      }
      // console.log("user", user);
      res.send({
        user: user,
        auth0Id: user.auth0Id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarURL: user.avatarURL,
        role: user.role,
        disabled: user.disabled,
      });
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Get all users if user isAdmin
router.get("/users", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.sendStatus(401);
    }

    // check token
    let user;
    try {
      user = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    // check if user isadmin
    if (user.role.toLowerCase() !== "admin") {
      return res.sendStatus(403);
    }

    const users = await User.findAll({
      attributes: [
        "id",
        "firstName",
        "lastName",
        "email",
        "avatarURL",
        "role",
        "disabled",
      ],
    });
    res.status(200).send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.patch("/:id/disable", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.sendStatus(401);

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role.toLowerCase() !== "admin") {
      return res.sendStatus(403);
    }

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.disabled = true;
    await user.save();

    res.status(200).json({ message: "User has been disabled" });
  } catch (error) {
    console.error("Disable error:", error);
    res.status(500).json({ error: "Failed to disable user" });
  }
});

router.patch("/:id/enable", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.sendStatus(401);

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role.toLowerCase() !== "admin") {
      return res.sendStatus(403);
    }

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.disabled = false;
    await user.save();

    res.status(200).json({ message: "User has been enabled" });
  } catch (error) {
    console.error("Enable error:", error);
    res.status(500).json({ error: "Failed to enable user" });
  }
});

//Disable user

module.exports = { router, authenticateJWT };
