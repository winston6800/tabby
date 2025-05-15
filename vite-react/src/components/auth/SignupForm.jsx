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
    </div>
  );
} 