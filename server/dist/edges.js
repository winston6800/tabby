"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEdge = createEdge;
exports.getEdges = getEdges;
exports.updateEdgeFromNodeId = updateEdgeFromNodeId;
exports.updateEdgeToNodeId = updateEdgeToNodeId;
exports.deleteEdge = deleteEdge;
const database_1 = __importDefault(require("./database"));
/**
 * CREATE: Makes an edge
 */
function createEdge(fromNodeId, toNodeId, callback) {
    const sql = `INSERT INTO edges (fromNodeId, toNodeId) VALUES (?, ?)`;
    database_1.default.run(sql, [fromNodeId, toNodeId], function (err) {
        if (err)
            return callback(err, null);
        callback(null, { message: `edge created successfully from node id ${fromNodeId} to node id ${toNodeId}` });
    });
}
/**
 * READ: Get all edges (optionally filtered by fromNodeId)
 */
function getEdges(fromNodeId, callback) {
    const sql = fromNodeId
        ? `SELECT * FROM edges WHERE fromNodeId = ? ORDER BY edgeId DESC`
        : `SELECT * FROM edges ORDER BY edgeId DESC`;
    database_1.default.all(sql, fromNodeId ? [fromNodeId] : [], (err, rows) => {
        if (err)
            return callback(err);
        callback(null, rows);
    });
}
/**
 * UPDATE: Edits an edges fromNodeId
 */
function updateEdgeFromNodeId(edgeId, fromNodeId, callback) {
    const sql = `UPDATE edges SET fromNodeId = ? WHERE edgeId = ?`;
    database_1.default.run(sql, [fromNodeId, edgeId], function (err) {
        if (err)
            return callback(err);
        callback(null, { message: "Edge fromNodeId updated successfully" });
    });
}
/**
 * UPDATE: Edits an edges toNodeId
 */
function updateEdgeToNodeId(edgeId, toNodeId, callback) {
    const sql = `UPDATE edges SET toNodeId = ? WHERE edgeId = ?`;
    database_1.default.run(sql, [toNodeId, edgeId], function (err) {
        if (err)
            return callback(err);
        callback(null, { message: "Edge toNodeId updated successfully" });
    });
}
/**
 * DELETE: Remove an edge
 */
function deleteEdge(edgeId, callback) {
    const sql = `DELETE FROM edges WHERE edgeId = ?`;
    database_1.default.run(sql, [edgeId], function (err) {
        if (err)
            return callback(err);
        callback(null, { message: "Edge deleted successfully" });
    });
}
