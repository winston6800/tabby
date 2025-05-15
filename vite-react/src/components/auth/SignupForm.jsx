<<<<<<< HEAD
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './auth.css';

/**
 * SignupForm Component
 * 
 * Handles new user registration.
 * Implements a form with:
 * - Username/email input
 * - Password input
 * - Password verification input
 * - Register button
 * - Login link
 * - Back to canvas link
 * 
 * TODO: Implement actual registration with server
 */
export default function SignupForm() {
  const navigate = useNavigate();

  /**
   * Handle form submission
   * Currently just logs the attempt and redirects to canvas
   * TODO: Implement actual registration logic
   */
  const submit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const submitButton = event.currentTarget.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;

    const data = {
=======
import { Link, useNavigate } from "react-router-dom";
import './Signupform.css';

export default function SignupForm() {
  const navigate = useNavigate();
  const submit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const submitButton = event.currentTarget.querySelector(
      'button[type="submit"]'
    );
    if (submitButton) submitButton.disabled = true;
    let data = {
>>>>>>> main
      username: formData.get("username"),
      password: formData.get("password"),
      verifyPassword: formData.get("verPassword"),
    };

    try {
<<<<<<< HEAD
      // TODO: Implement actual signup logic with the server
      console.log('Signup attempt:', data);
      
      // For now, just redirect to canvas
      navigate('/canvas');
    } catch (error) {
      console.error('Signup failed:', error);
      if (submitButton) submitButton.disabled = false;
    }
  };

  return (
    <div className="auth-wrapper">
      <form className="auth-form" onSubmit={submit}>
        {/* App Icon */}
        <div className="icon">🐱</div>
        
        {/* Form Header */}
        <h2>Welcome to Tabby!</h2>
        
        {/* Registration Form Fields */}
        <input
          name="username"
          type="text"
          placeholder="Email or Username"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
        />
        <input
          name="verPassword"
          type="password"
          placeholder="Verify Password"
          required
        />
        
        {/* Helper Links */}
        <div className="helper">
          <p>Already a user? <Link to="/login">Log in</Link></p>
        </div>
        
        {/* Submit Button */}
        <button type="submit">Register</button>
        
        {/* Back to Canvas Link */}
        <Link to="/canvas">
          <button type="button" className="alt-btn">Back to canvas</button>
        </Link>
      </form>
=======
      const { username, password, verifyPassword } = data;

      if (password !== verifyPassword) {
        alert("Passwords do not match.");
        return;
      }

      const payload = {
        username,
        password,
      };

      const response = await fetch("http://localhost:4000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Signup successful! Please sign in");
        // optionally redirect to login or dashboard
        navigate('/login');
      } else {
        alert(`Signup failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An unexpected error occurred.");
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  };
  return (
    <div className="signup-wrapper">
      <div>
        <form onSubmit={submit}>
          <h2> Welcome To Tabby! </h2> <br />
          <input
            name="username"
            type="text"
            placeholder="Email or Username"
            required
          />{" "}
          <br />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
          />{" "}
          <br />
          <input
            name="verPassword"
            type="password"
            placeholder="Verify Password"
            required
          />{" "}
          <br />
          <div>
            <p>
              Already a user? <a href="/login">Log in</a>
            </p>
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
      <Link to="/login">
        <button>Test Link to Login</button>
      </Link>
      <Link to="/canvas">
        <button>Test Link to canvas</button>
      </Link>
>>>>>>> main
    </div>
  );
} 