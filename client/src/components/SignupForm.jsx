import { Link } from 'react-router-dom';

export default function SignupForm() {
  const submit = (event) => {
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
    console.log(data);
  };
  return (
    <div>
      <div>
        <form onSubmit={submit}>
          <h2> Welcome To Tabby! </h2> <br />
          <input
            name="username"
            type="text"
            placeholder="Email or Username"
          />{" "}
          <br />
          <input name="password" type="text" placeholder="Password" /> <br />
          <input
            name="verPassword"
            type="text"
            placeholder="Verify Password"
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
      <Link to="/">
        <button>Test Link to landing</button>
      </Link>
    </div>
  );
}
