// routes/auth.ts
import express from "express";
import { hash } from "bcrypt";
import { Sequelize } from "sequelize";

const router = express.Router();

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "../tabby.db",
  dialectOptions: { multipleStatements: true },
});

const saltRounds = 10;

router.post("/", async (req, res) => {
  const data = req.body;
  const securedPassword = await hash(data.password, saltRounds);

  try {
    await sequelize.query(
      "INSERT INTO users (username, password) VALUES (:username, :password)",
      {
        replacements: {
          username: data.username,
          password: securedPassword,
        },
      }
    );
    res.status(200).json({ Message: "Success! " });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "Validation error") {
        console.log("already exists");
        res.status(412).json({error: "Email already exists!"});
      } else {
        console.log("unknown: " + e);
        res.status(400).json({ error: "Unknown error: " + e });
      }
    } else {
      console.log("We blew up");
      res.status(500).json({ error: "How did we get here: " + e });
    }
  }
});

export default router;
