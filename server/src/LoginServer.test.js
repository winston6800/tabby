import request from "supertest";
import express from "express";
import loginRoute from "./login";
import * as users from "./users";
import { compare } from "bcrypt";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Create an Express app for testing
const app = express();
app.use(express.json());
app.use("/login", loginRoute);

vi.mock("./users");
vi.mock("bcrypt");

describe("POST /login", () => {
  const mockUser = { username: "Jordan", password: "hashedpass" };
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("successful login test", async () => {
    users.findUserByUsername.mockImplementation((username, cb) => {
      cb(null, mockUser);
    });
    compare.mockResolvedValue(true);

    const response = await request(app).post("/login").send({
      username: "Jordan",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Successfully logged in Jordan");
  });

  it("unsuccessful login test, password does not match", async () => {
    users.findUserByUsername.mockImplementation((username, cb) => {
      cb(null, mockUser);
    });

    compare.mockResolvedValue(false);

    const response = await request(app).post("/login").send({
      username: "Jordan",
      password: "wrongPassword",
    });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Authentication failed");
  });

  it("fails when user not found", async () => {
    users.findUserByUsername.mockImplementation((username, cb) => {
      cb(null, null);
    });

    const response = await request(app).post("/login").send({
      username: "NoUser",
      password: "password123",
    });

    expect(response.status).toBe(401);
    expect(response.body.error).toMatch(/Failed to find user/);
  });

  it("fails when findUserByUsername returns error", async () => {
    users.findUserByUsername.mockImplementation((username, cb) => {
      cb(new Error("DB error"), null);
    });

    const response = await request(app).post("/login").send({
      username: "ErrorUser",
      password: "password123",
    });

    expect(response.status).toBe(401);
    expect(response.body.error).toMatch(/Failed to find user: Error: DB error/);
  });

  it("returns JWT token on successful login", async () => {
    users.findUserByUsername.mockImplementation((username, cb) => {
      cb(null, mockUser);
    });

    compare.mockResolvedValue(true);

    const response = await request(app).post("/login").send({
      username: "Jordan",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(typeof response.body.token).toBe("string");
  });
});
