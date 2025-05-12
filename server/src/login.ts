import express from "express";
import { findUserByUsername } from "./users";
import { compare } from "bcrypt";
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, password} = req.body;

    // Find user by username
    findUserByUsername(username, async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: "Failed to find user: " + err });
    }

    // Compare the passwords
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    // Create JWT token to stay logged in (WIP)
    const token = jwt.sign({ userId: user.userId }, 'your-secret-key', { expiresIn: '1h' });
    res.status(200).json({ token });
  });

});

export default router;
