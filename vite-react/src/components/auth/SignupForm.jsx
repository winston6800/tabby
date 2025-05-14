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
      username: formData.get("username"),
      password: formData.get("password"),
      verifyPassword: formData.get("verPassword"),
    };

    try {
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
    </div>
  );
} 