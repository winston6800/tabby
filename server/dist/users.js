"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.findUserByUsername = findUserByUsername;
exports.updateUsername = updateUsername;
exports.updatePassword = updatePassword;
exports.deleteUser = deleteUser;
const database_1 = __importDefault(require("./database"));
/**
 * CREATE: Inserts a new user into the database
 */
function createUser(userName, password, callback) {
    const sql = `INSERT INTO users (userName, password) VALUES (?, ?)`;
    database_1.default.run(sql, [userName, password], function (err) {
        if (err)
            return callback(err);
        callback(null, this.lastID);
    });
}
/**
 * READ: Find user by userName
 */
function findUserByUsername(userName, callback) {
    const sql = `SELECT * FROM users WHERE userName = ?`;
    database_1.default.get(sql, [userName], (err, row) => {
        if (err)
            return callback(err);
        callback(null, row);
    });
}
/**
 * UPDATE: Edits a user's username
 */
function updateUsername(userName, newUserName, callback) {
    const sql = `UPDATE users SET username = ? WHERE userName = ?`;
    database_1.default.run(sql, [newUserName, userName], function (err) {
        if (err)
            return callback(err);
        callback(null, { message: "Username updated successfully" });
    });
}
/**
 * UPDATE: Edits a user's password
 */
function updatePassword(userName, newPassword, callback) {
    const sql = `UPDATE users SET password = ? WHERE userName = ?`;
    database_1.default.run(sql, [newPassword, userName], function (err) {
        if (err)
            return callback(err);
        callback(null, { message: "Password updated successfully" });
    });
}
/**
 * DELETE: remove a user
 */
function deleteUser(userId, callback) {
    const sql = `DELETE FROM users WHERE userId = ?`;
    database_1.default.run(sql, [userId], function (err) {
        if (err)
            return callback(err);
        callback(null, { message: "User was removed" });
    });
}
