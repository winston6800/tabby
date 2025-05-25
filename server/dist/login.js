"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("./users");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const router = express_1.default.Router();
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || "secret";
router.post("/", async (req, res) => {
    const { username, password } = req.body;
    // Find user by username
    (0, users_1.findUserByUsername)(username, async (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: "Failed to find user: " + err });
        }
        // Compare the passwords
        const passwordMatch = await (0, bcrypt_1.compare)(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Authentication failed" });
        }
        const payload = {
            username: user.userName,
            lastLogin: Date.now(),
        };
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error("Missing JWT_SECRET in environment variables");
        }
        const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
            expiresIn: "7d",
        });
        res
            .status(200)
            .json({ message: "Successfully logged in " + username, token });
    });
});
exports.default = router;
