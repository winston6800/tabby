// Import necessary testing utilities and the component to test
import React from "react";
import { describe, it, expect, beforeAll } from "vitest"; // Vitest's test functions
import { render, screen } from "@testing-library/react"; // React testing utilities
import "@testing-library/jest-dom"; // Custom DOM matchers
import SignupForm from "./components/auth/SignupForm";
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
describe("SignupForm", () => {
  it("renders form", () => {
    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>
    );
    expect(screen.getByTestId("signup-form")).toBeInTheDocument();
  });

  it("renders username field", () => {
    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>
    );
    expect(
      screen.getByPlaceholderText("Email or Username")
    ).toBeInTheDocument();
  });

  it("renders password field", () => {
    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  it("renders verify password field", () => {
    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText("Verify Password")).toBeInTheDocument();
  });

  it("renders register button", () => {
    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>
    );
    expect(screen.getByRole("button", { name: "Register" })).toBeInTheDocument();
  });

  it("renders canvas button", () => {
    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>
    );
    expect(
      screen.getByRole("button", { name: "Back to canvas" })
    ).toBeInTheDocument();
  });
});
