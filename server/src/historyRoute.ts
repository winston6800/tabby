import express from "express";
import { addToHisotry, getHistory } from "./history";

const router = express.Router();

router.post("/", async (req, res) => {
  const {
    userId,
    nodeId,
    title,
    description,
    expectedOutput,
    timeSpent,
    tags,
  } = req.body;
  try {
    addToHisotry(
      userId,
      nodeId,
      title,
      description,
      expectedOutput,
      timeSpent,
      tags,
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: + err });
        }
        res
          .status(201)
          .json({ message: "history registered successfully", result });
      }
    );
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.get("/", async (req, res) => {
  const userId = req.query.userId ? Number(req.query.userId) : null;
  try {
    getHistory(userId, (err, history) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: "history: ", history });
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

export default router;
