"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/auth.ts
const express_1 = __importDefault(require("express"));
const bcrypt_1 = require("bcrypt");
const sequelize_1 = require("sequelize");
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
        await sequelize.query("INSERT INTO users (username, password) VALUES (:username, :password)", {
            replacements: {
                username: data.username,
                password: securedPassword,
            },
        });
        res.status(200).json({ Message: "Success! " });
    }
    catch (e) {
        if (e instanceof Error) {
            if (e.message === "Validation error") {
                console.log("already exists");
                res.status(412).json({ error: "Email already exists!" });
            }
            else {
                console.log("unknown: " + e);
                res.status(400).json({ error: "Unknown error: " + e });
            }
        }
        else {
            console.log("We blew up");
            res.status(500).json({ error: "How did we get here: " + e });
        }
    }
});
exports.default = router;
