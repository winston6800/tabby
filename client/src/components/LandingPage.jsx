import { Link } from "react-router-dom";
import catImg from "../images/cat.png";
import placeholder from "../images/31343C.svg"

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
      <div className="productInfo">
        <h2>What Is Our Product?</h2>
        <p>Tabby is a service that lets people do what they want at a higher velocity</p>
        <img src={placeholder} alt="placeholder" className="placeholder"></img>

      </div>
      <div className="why">
  <div className="why-left">
    <div className="why-box">
      <h4>Why?</h4>
    </div>
  </div>
  <div className="why-right">
    <p>
      Modern digital workflows are filled with context switches that derail focus. Tabby is a lightweight
      assistant that helps users preserve and restore context so they can stay in flow. It detects distraction
      symptoms and reminds users of what they were doing, why, and what’s next.
    </p>
  </div>
</div>

<div className="creators">
  <h3>Creators</h3>
  <div className="creator-grid">
    <div className="creator-placeholder"></div>
    <div className="creator-placeholder"></div>
    <div className="creator-placeholder"></div>
    <div className="creator-placeholder"></div>
    <div className="creator-placeholder"></div>
    <div className="creator-placeholder"></div>
  </div>
</div>

    </div>
  );
}
