"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/auth.ts
const express_1 = __importDefault(require("express"));
const bcrypt_1 = require("bcrypt");
const sequelize_1 = require("sequelize");
const users_1 = require("./users");
const router = express_1.default.Router();
const sequelize = new sequelize_1.Sequelize({
    dialect: "sqlite",
    storage: "../tabby.db",
    dialectOptions: { multipleStatements: true },
});
const saltRounds = 10;
router.post("/", async (req, res) => {
    const data = req.body;
    const securedPassword = await (0, bcrypt_1.hash)(data.password, saltRounds);
    try {
        (0, users_1.createUser)(data.username, securedPassword, (err, userId) => {
            if (err) {
                return res.status(500).json({ error: "Error registering user: " + err });
            }
            console.log(data.username + " successful");
            res.status(201).json({ message: 'User registered successfully', userId });
        });
    }
    catch (e) {
        res.status(500).json({ error: 'Error: ' + e });
    }
});
exports.default = router;
