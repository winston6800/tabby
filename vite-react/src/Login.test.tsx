// Import necessary testing utilities and the component to test
import React from "react";
import { describe, it, expect, beforeAll } from "vitest"; // Vitest's test functions
import { render, screen } from "@testing-library/react"; // React testing utilities
import "@testing-library/jest-dom"; // Custom DOM matchers
import LoginPage from "./components/auth/LoginPage";
import { MemoryRouter } from "react-router-dom";

// Mock ResizeObserver to prevent errors in JSDOM (used by Vitest) which doesn't support it
beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

// Test suite for the login component
describe("LoginPage", () => {
  it("renders form", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });

  it("renders username field", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    expect(
      screen.getByPlaceholderText("Email or Username")
    ).toBeInTheDocument();
  });

  it("renders password field", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  it("renders signin button", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  it("renders create acc button", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    expect(
      screen.getByRole("button", { name: "Create account" })
    ).toBeInTheDocument();
  });

  it("renders canvas button", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    expect(
      screen.getByRole("button", { name: "Back to canvas" })
    ).toBeInTheDocument();
  });
});
