"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("./users");
const bcrypt_1 = require("bcrypt");
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
        res.status(200).json({ message: "Successfully logged in " + username });
    });
});
exports.default = router;
