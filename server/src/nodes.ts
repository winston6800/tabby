import db from './database';

/**
 * CREATE: Makes a node
 */
function createNode(userId: Number, nodedName: string, description: string, expectedOutput: string, tags: string, color: string, size: number, completedAt: string | null, callback: (err: Error | null, result?: any) => void) {
  const sql = `INSERT INTO nodes (userId, nodedName, description, expectedOutput, tags, color, size) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.run(sql, [userId, nodedName, description, expectedOutput, tags, color, size], function (err: Error | null) {
    if (err) return callback(err, null);
    callback(null, { message: "Node created successfully" });
  });
}

/**
 * READ: Get all nodes (optionally filtered by userId)
 */
function getNodes(userId: number | null, callback: (err: Error | null, rows?: Node[]) => void) {
  const sql = userId
    ? `SELECT * FROM nodes WHERE userId = ? ORDER BY createdAt DESC`
    : `SELECT * FROM nodes ORDER BY createdAt DESC`;

  db.all(sql, userId ? [userId] : [], (err: Error | null, rows: Node[]) => {
    if (err) return callback(err, []);
    callback(null, rows);
  });
}

/**
 * UPDATE: Edits a nodes name to a new given name
 */
function updateNodeName(nodeId: number, newName: string, callback: (err: Error | null, result?: { message: string }) => void): void {
  const sql = `UPDATE nodes SET nodeName = ? WHERE nodeId = ?`;
  db.run(sql, [newName, nodeId], function (err: Error | null) {
    if (err) return callback(err);
    callback(null, { message: "Node name updated successfully" });
  });
}

/**
 * UPDATE: Edits a nodes description to a new given description 
 */
function updateNodeDesc(nodeId: number, newDesc: string, callback: (err: Error | null, result?: { message: string }) => void): void {
  const sql = `UPDATE nodes SET description = ? WHERE nodeId = ?`;
  db.run(sql, [newDesc, nodeId], function (err: Error | null) {
    if (err) return callback(err);
    callback(null, { message: "Node description updated successfully" });
  });
}

/**
 * UPDATE: Edits a nodes scope to a new given scope 
 */
function updateNodeScope(nodeId: number, newScope: string, callback: (err: Error | null, result?: { message: string }) => void): void {
  const sql = `UPDATE nodes SET scope = ? WHERE nodeId = ?`;
  db.run(sql, [newScope, nodeId], function (err: Error | null) {
    if (err) return callback(err);
    callback(null, { message: "Node scope updated successfully" });
  });
}

/**
 * UPDATE: Edits a nodes expectedOutput to a new given expectedOutput 
 */
function updateNodeExpectedOutput(nodeId: number, newExpectedOutput: string, callback: (err: Error | null, result?: { message: string }) => void): void {
  const sql = `UPDATE nodes SET expectedOutput = ? WHERE nodeId = ?`;
  db.run(sql, [newExpectedOutput, nodeId], function (err: Error | null) {
    if (err) return callback(err);
    callback(null, { message: "Node expectedOutput updated successfully" });
  });
}

/**
 * UPDATE: Edits a nodes tags to a new given tags 
 */
function updateNodeTags(nodeId: number, newTags: string, callback: (err: Error | null, result?: { message: string }) => void): void {
  const sql = `UPDATE nodes SET tags = ? WHERE nodeId = ?`;
  db.run(sql, [newTags, nodeId], function (err: Error | null) {
    if (err) return callback(err);
    callback(null, { message: "Node tags updated successfully" });
  });
}

/**
 * UPDATE: Edits a nodes color to a new given color 
 */
function updateNodeColor(nodeId: number, newColor: string, callback: (err: Error | null, result?: { message: string }) => void): void {
  const sql = `UPDATE nodes SET color = ? WHERE nodeId = ?`;
  db.run(sql, [newColor, nodeId], function (err: Error | null) {
    if (err) return callback(err);
    callback(null, { message: "Node color updated successfully" });
  });
}

/**
 * UPDATE: Edits a nodes size to a new given size
 */
function updateNodeSize(nodeId: number, newSize: number, callback: (err: Error | null, result?: { message: string }) => void): void {
  const sql = `UPDATE nodes SET size = ? WHERE nodeId = ?`;
  db.run(sql, [newSize, nodeId], function (err: Error | null) {
    if (err) return callback(err);
    callback(null, { message: "Node size updated successfully" });
  });
}

/**
 * DELETE: Remove a node
 */
function deleteNode(nodeId: number, callback: (err: Error | null, result?: { message: string }) => void): void {
  const sql = `DELETE FROM nodes WHERE nodeId = ?`;
  db.run(sql, [nodeId], function (err: Error | null) {
    if (err) return callback(err);
    callback(null, { message: "Node deleted successfully" });
  });
}

export { 
    getNodes,
    createNode, 
    updateNodeName, 
    updateNodeDesc, 
    updateNodeColor, 
    updateNodeScope,
    updateNodeExpectedOutput, 
    updateNodeTags,
    updateNodeSize,
    deleteNode
    };

