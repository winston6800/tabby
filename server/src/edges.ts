import db from './database';

/**
 * CREATE: Makes an edge
 */
function createEdge(fromNodeId: number, toNodeId: number, callback: (err: Error | null, result?: any) => void) {
  const sql = `INSERT INTO edges (fromNodeId, toNodeId) VALUES (?, ?)`;

  db.run(sql, [fromNodeId, toNodeId], function (err: Error | null) {
    if (err) return callback(err, null);
    callback(null, { message: `edge created successfully from node id ${fromNodeId} to node id ${toNodeId}` });
  });
}

/**
 * READ: Get all edges (optionally filtered by fromNodeId)
 */
function getEdges(fromNodeId: number | null, callback: (err: Error | null, rows?: any[]) => void): void {
  const sql = fromNodeId
    ? `SELECT * FROM edges WHERE fromNodeId = ? ORDER BY edgeId DESC`
    : `SELECT * FROM edges ORDER BY edgeId DESC`;

  db.all(sql, fromNodeId ? [fromNodeId] : [], (err: Error | null, rows: any[]) => {
    if (err) return callback(err);
    callback(null, rows);
  });
}

/**
 * UPDATE: Edits an edges fromNodeId
 */
function updateEdgeFromNodeId(edgeId: number, fromNodeId: number, callback: (err: Error | null, result?: { message: string }) => void): void {
  const sql = `UPDATE edges SET fromNodeId = ? WHERE edgeId = ?`;
  db.run(sql, [fromNodeId, edgeId], function (err: Error | null) {
    if (err) return callback(err);
    callback(null, { message: "Edge fromNodeId updated successfully" });
  });
}

/**
 * UPDATE: Edits an edges toNodeId
 */
function updateEdgeToNodeId(edgeId: number, toNodeId: number, callback: (err: Error | null, result?: { message: string }) => void): void {
  const sql = `UPDATE edges SET toNodeId = ? WHERE edgeId = ?`;
  db.run(sql, [toNodeId, edgeId], function (err: Error | null) {
    if (err) return callback(err);
    callback(null, { message: "Edge toNodeId updated successfully" });
  });
}

/**
 * DELETE: Remove an edge
 */
function deleteEdge(edgeId: number, callback: (err: Error | null, result?: { message: string }) => void): void {
  const sql = `DELETE FROM edges WHERE edgeId = ?`;
  db.run(sql, [edgeId], function (err: Error | null) {
    if (err) return callback(err);
    callback(null, { message: "Edge deleted successfully" });
  });
}


export { 
    createEdge, 
    getEdges,
    updateEdgeFromNodeId,
    updateEdgeToNodeId,
    deleteEdge
    };