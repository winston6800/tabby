import express from "express";
import { findUserByUsername } from "./users";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  findUserByUsername(username, async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: "Failed to find user: " + err });
    }

    // Compare the passwords
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const payload = {
      username: user.userName,
      lastLogin: Date.now(),
    };

    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      throw new Error("Missing JWT_SECRET in environment variables");
    }

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "7d",
    });

    res
      .status(200)
      .json({ message: "Successfully logged in " + username, token });
  });
});

export default router;
