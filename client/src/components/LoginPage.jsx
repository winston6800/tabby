import { Link } from 'react-router-dom';

export default function LoginPage() {
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
      };
      console.log(data)
    };
    return (
      <div>
        <div>
          <form onSubmit={submit}>
            <h2> Cat Icon </h2> <br />
            <input name="username" type="text" placeholder="Email or Username"/> <br />
            <input name="password" type="text" placeholder="Password"/> <br />
            <div>
              <p>
                <a href="/login">Forgot password?</a>
              </p>
            </div>
            <button type="submit">Sign in</button>
          </form>
        </div>
        <Link to="/signup">
        <button>Test Link to Signup</button>
      </Link>
      <Link to="/">
        <button>Test Link to landing</button>
      </Link>
      </div>
    );
  }
  