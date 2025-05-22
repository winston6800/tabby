import express from "express";
import {
  getNodes,
  createNode,
  updateNodeName,
  updateNodeDesc,
  updateNodeColor,
  updateNodeScope,
  updateNodeExpectedOutput,
  updateNodeTags,
  updateNodeSize,
  deleteNode,
} from "./nodes";

const router = express.Router();

router.get("/", async (req, res) => {
  const userId = req.query.userId ? Number(req.query.userId) : null;
  try {
    getNodes(userId, (err, nodes) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: "Nodes: ", nodes });
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/", async (req, res) => {
  const { userId, nodedName, description, expectedOutput, tags, color, size } =
    req.body;
  try {
    createNode(
      userId,
      nodedName,
      description,
      expectedOutput,
      tags,
      color,
      size,
      (err, nodeId) => {
        if (err) {
          return res.status(500).json({ error: +err });
        }
        res
          .status(201)
          .json({ message: "Nodes registered successfully", nodeId });
      }
    );
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

//Give a node id and a newName
router.patch("/:nodeId/name", async (req, res) => {
  const nodeId = Number(req.params.nodeId);
  const { newName } = req.body;
  try {
    updateNodeName(nodeId, newName, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ result });
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

//Give a node id and a newDescription
router.patch("/:nodeId/description", async (req, res) => {
  try {
    const nodeId = Number(req.params.nodeId);
    const { newDesc } = req.body;
    updateNodeColor(nodeId, newDesc, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ result });
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

//Give a node id and a newColor
router.patch("/:nodeId/color", async (req, res) => {
  try {
    const nodeId = Number(req.params.nodeId);
    const { newColor } = req.body;
    updateNodeDesc(nodeId, newColor, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ result });
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

//Give a node id and a newScope
router.patch("/:nodeId/scope", async (req, res) => {
  try {
    const nodeId = Number(req.params.nodeId);
    const { newScope } = req.body;
    updateNodeScope(nodeId, newScope, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ result });
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

//Give a node id and a newExpectedOutput
router.patch("/:nodeId/expectedOutput", async (req, res) => {
  try {
    const nodeId = Number(req.params.nodeId);
    const { newExpectedOutput } = req.body;
    updateNodeExpectedOutput(nodeId, newExpectedOutput, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ result });
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

//Give a node id and a newTags
router.patch("/:nodeId/tags", async (req, res) => {
  try {
    const nodeId = Number(req.params.nodeId);
    const { newTags } = req.body;
    updateNodeTags(nodeId, newTags, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ result });
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

//Give a node id and a newSize
router.patch("/:nodeId/size", async (req, res) => {
  try {
    const nodeId = Number(req.params.nodeId);
    const { newSize } = req.body;
    updateNodeSize(nodeId, newSize, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ result });
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

//Give a node id for what node to remove
router.delete("/:nodeId", async (req, res) => {
  try {
    const nodeId = Number(req.params.nodeId);
    deleteNode(nodeId, (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Node deleted successfully" });
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
