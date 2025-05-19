import express from "express";
import {   
    createEdge, 
    getEdges,
    updateEdgeFromNodeId,
    updateEdgeToNodeId,
    deleteEdge
 } from "./edges";

const router = express.Router();

router.get('/', async (req, res) => {
  const fromNodeId = req.query.fromNodeId ? Number(req.query.fromNodeId) : null;

  try {
    getEdges(fromNodeId, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: + err });
      }
      res.status(200).json(rows);
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post('/', async (req, res) => {
  const { fromNodeId, toNodeId } = req.body;

  try {
    createEdge(fromNodeId, toNodeId, (err, result) => {
      if (err) {
        return res.status(500).json({ error: + err });
      }
      res.status(201).json(result);
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.patch('/:edgeId/from', async (req, res) => {
  const edgeId = Number(req.params.edgeId);
  const { fromNodeId } = req.body;

  try {
    updateEdgeFromNodeId(edgeId, fromNodeId, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.status(200).json(result);
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.patch('/:edgeId/to', async (req, res) => {
  const edgeId = Number(req.params.edgeId);
  const { toNodeId } = req.body;

  try {
    updateEdgeToNodeId(edgeId, toNodeId, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.status(200).json(result);
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

// DELETE: Remove an edge
router.delete('/:edgeId', async (req, res) => {
  const edgeId = Number(req.params.edgeId);

  try {
    deleteEdge(edgeId, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.status(200).json(result);
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

export default router;