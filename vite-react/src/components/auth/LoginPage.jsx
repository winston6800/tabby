import { Link, useNavigate } from "react-router-dom";
import "./auth.css";

/**
 * LoginPage Component
 * 
 * Handles user authentication and login flow.
 * Currently implements a basic form with:
 * - Username/email input
 * - Password input
 * - Login button
 * - Sign up link
 * - Back to canvas link
 * 
 * TODO: Implement actual authentication with server
 */
export default function LoginPage() {
  const navigate = useNavigate();

  /**
   * Handle form submission
   * Currently just logs the attempt and redirects to canvas
   * TODO: Implement actual authentication logic
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
    };

    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        navigate('/canvas');
      } else {
        alert(`Login failed: ${result.error}`);
      }
    } catch (error) {
      console.log(error);
      alert("Unexpected error occured ");
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  };

  return (
    <main className="auth-wrapper">
      <form className="auth-form" onSubmit={submit} data-testid="login-form">
        <div className="icon">🐱</div>
        <h2>Welcome back!</h2>
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
        <div className="helper">
          <a href="/login">Forgot password?</a>
        </div>
        <button type="submit">Sign in</button>
        <p className="divider">or</p>
        <Link to="/signup">
          <button type="button" className="alt-btn">
            Create account
          </button>
        </Link>
        <Link to="/canvas">
          <button type="button" className="alt-btn">
            Back to canvas
          </button>
        </Link>
      </form>
    </main>
  );
} 