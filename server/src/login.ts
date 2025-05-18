import express from "express";
import { findUserByUsername } from "./users";
import { compare } from "bcrypt";

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

    res.status(200).json({message: "Successfully logged in " + username});
  });

});

export default router;
