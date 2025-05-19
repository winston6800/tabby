import db from "./database";

/**
 * CREATE: Makes an edge
 */
function addToHisotry(
  userId: number,
  nodeId: number,
  title: string,
  description: string,
  expectedOutput: string,
  timeSpent: string,
  tags: string,
  callback: (err: Error | null, result?: any) => void
) {
  const sql = `INSERT INTO edges (userId, nodeId, title, description, expectedOutput, timeSpent, tags) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.run(
    sql,
    [userId, nodeId, title, description, expectedOutput, timeSpent, tags],
    function (err: Error | null) {
      if (err) return callback(err, null);
      callback(null, { message: `added to history}` });
    }
  );
}

/**
 * READ: Get all history records, optionally filtered by userId
 */
function getHistory(
  userId: number | null,
  callback: (err: Error | null, rows?: any[]) => void
): void {
  const sql = userId
    ? `SELECT * FROM history WHERE userId = ? ORDER BY historyId DESC`
    : `SELECT * FROM history ORDER BY historyId DESC`;

  db.all(sql, userId ? [userId] : [], (err: Error | null, rows: any[]) => {
    if (err) return callback(err);
    callback(null, rows);
  });
}

export { addToHisotry, getHistory };
