"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("./users");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
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
            return res.status(401).json({ error: 'Authentication failed' });
        }
        // Create JWT token to stay logged in (WIP)
        const token = jsonwebtoken_1.default.sign({ userId: user.userId }, 'your-secret-key', { expiresIn: '1h' });
        res.status(200).json({ token });
    });
});
exports.default = router;
