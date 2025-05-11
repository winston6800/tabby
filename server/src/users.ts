import db from './database';

export interface User {
  userId?: number;
  userName: string;
  password: string;
}

/**
 * CREATE: Inserts a new user into the database
 */
function createUser(userName: string, password: string, callback: (err: Error | null, userId?: number) => void): void {
  const sql = `INSERT INTO users (userName, password) VALUES (?, ?)`;
  db.run(sql, [userName, password], function (this: any, err: Error | null) {
    if (err) return callback(err);
    callback(null, this.lastID);
  });
}

/**
 * READ: Find user by userName
 */
function findUserByUsername(userName: string, callback: (err: Error | null, user?: User) => void): void {
  const sql = `SELECT * FROM users WHERE userName = ?`;
  db.get(sql, [userName], (err: Error | null, row: User) => {
    if (err) return callback(err);
    callback(null, row);
  });
}

/**
 * UPDATE: Edits a user's username
 */
function updateUsername(userName: string, newUserName: string, callback: (err: Error | null, result?: { message: string }) => void): void {
  const sql = `UPDATE users SET username = ? WHERE userName = ?`;
  db.run(sql, [newUserName, userName], function (err: Error | null) {
    if (err) return callback(err);
    callback(null, { message: "Username updated successfully" });
  });
}

/**
 * UPDATE: Edits a user's password
 */
function updatePassword(userName: string, newPassword: string, callback: (err: Error | null, result?: { message: string }) => void): void {
  const sql = `UPDATE users SET password = ? WHERE userName = ?`;
  db.run(sql, [newPassword, userName], function (err: Error | null) {
    if (err) return callback(err);
    callback(null, { message: "Password updated successfully" });
  });
}

/**
 * DELETE: remove a user
 */
function deleteUser(userId: number, callback: (err: Error | null, result?: { message: string }) => void): void {
  const sql = `DELETE FROM users WHERE userId = ?`;
  db.run(sql, [userId], function (err: Error | null) {
    if (err) return callback(err);
    callback(null, { message: "User was removed" });
  });
}

export { 
  createUser,
  findUserByUsername,
  updateUsername,
  updatePassword,
  deleteUser
  };