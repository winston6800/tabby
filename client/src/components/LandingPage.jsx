import { Link } from "react-router-dom";
import catImg from "../images/cat.png";

export default function LandingPage() {
  return (
    <div className="landing-container">
      <nav>
        <img src={catImg} alt="cat logo" className="cat-img" />
        <div className="nav-buttons">
          <Link to="/login">
            <button>Login</button>
          </Link>
          <Link to="/signup">
            <button>Sign Up</button>
          </Link>
        </div>
      </nav>
      <div className="header">
        <img src={catImg} alt="cat logo" className="cat-img" />
        <div className="quote">
          <h3>
            You have ADHD? No more adderall needed. Tabby is your friend.
            <br></br>
            — Laura
          </h3>
        </div>
      </div>
    </div>
  );
}
