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

/**
 * UPDATE: Edits a nodes priority to a new given priority 
 */
function updateNodePriority(nodeId: number, newPriority: Number, callback: (err: Error | null, result?: { message: string }) => void): void {
  const sql = `UPDATE nodes SET priority = ? WHERE nodeId = ?`;
  db.run(sql, [newPriority, nodeId], function (err: Error | null) {
    if (err) return callback(err);
    callback(null, { message: "Node priority updated successfully" });
  });
}

/**
 * UPDATE: Edits a nodes status to a new given status 
 */
function updateNodeStatus(nodeId: number, newStatus: string, callback: (err: Error | null, result?: { message: string }) => void): void {
  const sql = `UPDATE nodes SET status = ? WHERE nodeId = ?`;
  db.run(sql, [newStatus, nodeId], function (err: Error | null) {
    if (err) return callback(err);
    callback(null, { message: "Node status updated successfully" });
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
 * UPDATE: Edits a nodes due date to a new given due date 
 */
function updateNodeDueDate(nodeId: number, newDueDate: string, callback: (err: Error | null, result?: { message: string }) => void): void {
  const sql = `UPDATE nodes SET dueDate = ? WHERE nodeId = ?`;
  db.run(sql, [newDueDate, nodeId], function (err: Error | null) {
    if (err) return callback(err);
    callback(null, { message: "Node due date updated successfully" });
  });
}

/**
 * UPDATE: Edits a nodes complated at time
 */
function updateNodeCompletedAt(nodeId: number, newCompletedAt: string, callback: (err: Error | null, result?: { message: string }) => void): void {
  const sql = `UPDATE nodes SET completedAt = ? WHERE nodeId = ?`;
  db.run(sql, [newCompletedAt, nodeId], function (err: Error | null) {
    if (err) return callback(err);
    callback(null, { message: "Node completion time updated successfully" });
  });
}

export { 
    getNodes,
    createNode, 
    updateNodeName, 
    updateNodeDesc, 
    updateNodePriority, 
    updateNodeStatus, 
    updateNodeTags,
    updateNodeDueDate,
    updateNodeCompletedAt,
    };

