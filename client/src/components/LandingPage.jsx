import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div>
      <h1>Landing Page</h1>
      <Link to="/login">
        <button>Login</button>
      </Link>
      <Link to="/signup">
        <button>Sign Up</button>
      </Link>
    </div>
  );
}
