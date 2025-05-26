"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNodes = getNodes;
exports.createNode = createNode;
exports.updateNodeName = updateNodeName;
exports.updateNodeDesc = updateNodeDesc;
exports.updateNodeColor = updateNodeColor;
exports.updateNodeScope = updateNodeScope;
exports.updateNodeExpectedOutput = updateNodeExpectedOutput;
exports.updateNodeTags = updateNodeTags;
exports.updateNodeSize = updateNodeSize;
exports.deleteNode = deleteNode;
const database_1 = __importDefault(require("./database"));
/**
 * CREATE: Makes a node
 */
function createNode(userId, nodedName, description, expectedOutput, tags, color, size, callback) {
    const sql = `INSERT INTO nodes (userId, nodedName, description, expectedOutput, tags, color, size) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    database_1.default.run(sql, [userId, nodedName, description, expectedOutput, tags, color, size], function (err) {
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
 * UPDATE: Edits a nodes scope to a new given scope
 */
function updateNodeScope(nodeId, newScope, callback) {
    const sql = `UPDATE nodes SET scope = ? WHERE nodeId = ?`;
    database_1.default.run(sql, [newScope, nodeId], function (err) {
        if (err)
            return callback(err);
        callback(null, { message: "Node scope updated successfully" });
    });
}
/**
 * UPDATE: Edits a nodes expectedOutput to a new given expectedOutput
 */
function updateNodeExpectedOutput(nodeId, newExpectedOutput, callback) {
    const sql = `UPDATE nodes SET expectedOutput = ? WHERE nodeId = ?`;
    database_1.default.run(sql, [newExpectedOutput, nodeId], function (err) {
        if (err)
            return callback(err);
        callback(null, { message: "Node expectedOutput updated successfully" });
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
 * UPDATE: Edits a nodes color to a new given color
 */
function updateNodeColor(nodeId, newColor, callback) {
    const sql = `UPDATE nodes SET color = ? WHERE nodeId = ?`;
    database_1.default.run(sql, [newColor, nodeId], function (err) {
        if (err)
            return callback(err);
        callback(null, { message: "Node color updated successfully" });
    });
}
/**
 * UPDATE: Edits a nodes size to a new given size
 */
function updateNodeSize(nodeId, newSize, callback) {
    const sql = `UPDATE nodes SET size = ? WHERE nodeId = ?`;
    database_1.default.run(sql, [newSize, nodeId], function (err) {
        if (err)
            return callback(err);
        callback(null, { message: "Node size updated successfully" });
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
