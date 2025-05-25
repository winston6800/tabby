"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/auth.ts
const express_1 = __importDefault(require("express"));
const bcrypt_1 = require("bcrypt");
const users_1 = require("./users");
const router = express_1.default.Router();
const saltRounds = 10;
router.post("/", async (req, res) => {
    const data = req.body;
    const securedPassword = await (0, bcrypt_1.hash)(data.password, saltRounds);
    try {
        (0, users_1.createUser)(data.username, securedPassword, (err, userId) => {
            if (err) {
                return res.status(500).json({ error: +err });
            }
            res.status(201).json({ message: "User registered successfully", userId });
        });
    }
    catch (e) {
        res.status(500).json({ error: e });
    }
});
exports.default = router;
