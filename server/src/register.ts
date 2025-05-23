// routes/auth.ts
import express from "express";
import { hash } from "bcrypt";
import { createUser } from "./users";

const router = express.Router();

const saltRounds = 10;

router.post("/", async (req, res) => {
  const data = req.body;
  const securedPassword = await hash(data.password, saltRounds);

  try {
    createUser(data.username, securedPassword, (err, userId) => {
      if (err) {
        return res.status(500).json({ error: +err });
      }
      res.status(201).json({ message: "User registered successfully", userId });
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

export default router;
