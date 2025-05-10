import db from './database';

/**
 * CREATE: Makes a node
 */
function createNode(nodeName: string, userId: number, description: string, priority: number, status: string, tags: string, dueDate: string, completedAt: string | null, callback: (err: Error | null, result?: any) => void) {
  const sql = `INSERT INTO nodes (nodeName, userId, description, priority, status, tags, dueDate, completedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(sql, [nodeName, userId, description, priority, status, tags, dueDate, completedAt], function (err: Error | null) {
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

export { getNodes, createNode, updateNodeName, updateNodeDesc };

