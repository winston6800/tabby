"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNodes = getNodes;
exports.createNode = createNode;
exports.updateNodeName = updateNodeName;
exports.updateNodeDesc = updateNodeDesc;
exports.updateNodePriority = updateNodePriority;
exports.updateNodeStatus = updateNodeStatus;
exports.updateNodeTags = updateNodeTags;
exports.updateNodeDueDate = updateNodeDueDate;
exports.updateNodeCompletedAt = updateNodeCompletedAt;
exports.deleteNode = deleteNode;
const database_1 = __importDefault(require("./database"));
/**
 * CREATE: Makes a node
 */
function createNode(nodeName, userId, description, priority, status, tags, dueDate, completedAt, callback) {
    const sql = `INSERT INTO nodes (nodeName, userId, description, priority, status, tags, dueDate, completedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    database_1.default.run(sql, [nodeName, userId, description, priority, status, tags, dueDate, completedAt], function (err) {
        if (err)
            return callback(err, null);
        callback(null, { message: "Node created successfully" });
    });
}
/**
 * READ: Get all nodes (optionally filtered by userId)
 */
function getNodes(userId, callback) {
    const sql = userId
        ? `SELECT * FROM nodes WHERE userId = ? ORDER BY createdAt DESC`
        : `SELECT * FROM nodes ORDER BY createdAt DESC`;
    database_1.default.all(sql, userId ? [userId] : [], (err, rows) => {
        if (err)
            return callback(err, []);
        callback(null, rows);
    });
}
/**
 * UPDATE: Edits a nodes name to a new given name
 */
function updateNodeName(nodeId, newName, callback) {
    const sql = `UPDATE nodes SET nodeName = ? WHERE nodeId = ?`;
    database_1.default.run(sql, [newName, nodeId], function (err) {
        if (err)
            return callback(err);
        callback(null, { message: "Node name updated successfully" });
    });
}
/**
 * UPDATE: Edits a nodes description to a new given description
 */
function updateNodeDesc(nodeId, newDesc, callback) {
    const sql = `UPDATE nodes SET description = ? WHERE nodeId = ?`;
    database_1.default.run(sql, [newDesc, nodeId], function (err) {
        if (err)
            return callback(err);
        callback(null, { message: "Node description updated successfully" });
    });
}
/**
 * UPDATE: Edits a nodes priority to a new given priority
 */
function updateNodePriority(nodeId, newPriority, callback) {
    const sql = `UPDATE nodes SET priority = ? WHERE nodeId = ?`;
    database_1.default.run(sql, [newPriority, nodeId], function (err) {
        if (err)
            return callback(err);
        callback(null, { message: "Node priority updated successfully" });
    });
}
/**
 * UPDATE: Edits a nodes status to a new given status
 */
function updateNodeStatus(nodeId, newStatus, callback) {
    const sql = `UPDATE nodes SET status = ? WHERE nodeId = ?`;
    database_1.default.run(sql, [newStatus, nodeId], function (err) {
        if (err)
            return callback(err);
        callback(null, { message: "Node status updated successfully" });
    });
}
/**
 * UPDATE: Edits a nodes tags to a new given tags
 */
function updateNodeTags(nodeId, newTags, callback) {
    const sql = `UPDATE nodes SET tags = ? WHERE nodeId = ?`;
    database_1.default.run(sql, [newTags, nodeId], function (err) {
        if (err)
            return callback(err);
        callback(null, { message: "Node tags updated successfully" });
    });
}
/**
 * UPDATE: Edits a nodes due date to a new given due date
 */
function updateNodeDueDate(nodeId, newDueDate, callback) {
    const sql = `UPDATE nodes SET dueDate = ? WHERE nodeId = ?`;
    database_1.default.run(sql, [newDueDate, nodeId], function (err) {
        if (err)
            return callback(err);
        callback(null, { message: "Node due date updated successfully" });
    });
}
/**
 * UPDATE: Edits a nodes complated at time
 */
function updateNodeCompletedAt(nodeId, newCompletedAt, callback) {
    const sql = `UPDATE nodes SET completedAt = ? WHERE nodeId = ?`;
    database_1.default.run(sql, [newCompletedAt, nodeId], function (err) {
        if (err)
            return callback(err);
        callback(null, { message: "Node completion time updated successfully" });
    });
}
/**
 * DELETE: Remove a node
 */
function deleteNode(nodeId, callback) {
    const sql = `DELETE FROM nodes WHERE nodeId = ?`;
    database_1.default.run(sql, [nodeId], function (err) {
        if (err)
            return callback(err);
        callback(null, { message: "Node deleted successfully" });
    });
}
