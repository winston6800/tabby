const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./tabby.db');

db.serialize(()=> {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        userId INTEGER PRIMARY KEY AUTOINCREMENT, 
        userName TEXT,
        password TEXT
        )`); 

    db.run(`CREATE TABLE IF NOT EXISTS nodes (
        nodeId INTEGER PRIMARY KEY AUTOINCREMENT,
        nodeName TEXT,
        userId INTEGER,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
        )`); 

    db.run(`CREATE TABLE IF NOT EXISTS edges (
        edgeId INTEGER PRIMARY KEY AUTOINCREMENT,
        fromNodeId INTEGER,
        toNodeId INTEGER,
        FOREIGN KEY (fromNodeId) REFERENCES nodes(nodeId) ON DELETE CASCADE,
        FOREIGN KEY (toNodeId) REFERENCES nodes(nodeId) ON DELETE CASCADE
        )`); 


    })