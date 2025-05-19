import request from "supertest";
import express from "express";
import register from "./register";
import * as users from "./users";
import { hash } from "bcrypt";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Create an Express app for testing
const app = express();
app.use(express.json());
app.use("/register", register);

vi.mock("./users");
vi.mock("bcrypt");


describe("POST /register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registers a new user successfully", async () => {
    hash.mockResolvedValue("mockHashedPassword");

    users.createUser.mockImplementation((username, hashedPassword, cb) => {
      cb(null, 123);
    });

    const response = await request(app).post("/register").send({
      username: "Jordan",
      password: "newpass123",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User registered successfully");
    expect(response.body.userId).toBe(123);
  });

  it("fails to register user if createUser returns an error", async () => {
    hash.mockResolvedValue("mockHashedPassword");

    users.createUser.mockImplementation((username, hashedPassword, cb) => {
      cb(new Error("Insert failed"), null);
    });

    const response = await request(app).post("/register").send({
      username: "failuser",
      password: "pass",
    });

    expect(response.status).toBe(500);
  });

  it("fails if hashing throws an error", async () => {
    hash.mockRejectedValue(new Error("Hashing failed"));

    const response = await request(app).post("/register").send({
      username: "failuser",
      password: "pass",
    });

    expect(response.status).toBe(500);
  });
});