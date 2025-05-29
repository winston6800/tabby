import { Link, useNavigate } from "react-router-dom";
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
    const submitButton = event.currentTarget.querySelector(
      'button[type="submit"]'
    );
    if (submitButton) submitButton.disabled = true;
    let data = {
      username: formData.get("username"),
      password: formData.get("password"),
      verifyPassword: formData.get("verPassword"),
    };

    try {
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

  // Future: Doing email authentication would be nice
  return (
    <main className="auth-wrapper">
      <form className="auth-form" onSubmit={submit} data-testid="signup-form">
        <div className="icon">🐱</div>
        <h2>Welcome to Tabby!</h2>
        <input
          name="username"
          type="text"
          placeholder="Username"
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
        <div className="helper">
          <p>Already a user? <Link to="/login">Log in</Link></p>
        </div>
        <button type="submit">Register</button>
        <Link to="/canvas">
          <button type="button" className="alt-btn">Back to canvas</button>
        </Link>
      </form>
    </main>
  );
} 