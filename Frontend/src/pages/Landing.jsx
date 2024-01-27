import { Link } from "react-router-dom";
import main from "../assets/images/main.svg";
import Wrapper from "../assets/wrappers/LandingPage";
import { Logo } from "../components";

const Landing = () => {
  return (
    <Wrapper>
      <nav style={{ marginTop: "9vh" }}>
        <Logo />
      </nav>
      <div className="container page">
        <div className="info">
          <h1 style={{ marginTop: "5vh" }}>
            Soccer <span>Standings</span>
          </h1>
          <p style={{ textAlign: "justify" }}>
            Soccer Standings is a comprehensive and user-friendly platform
            dedicated to managing and presenting soccer league standings
            efficiently. This intuitive application provides real-time updates
            on match results, goal differentials, and team standings, offering
            instant insights into the dynamic landscape of soccer competitions.
            With a focus on enhancing the overall soccer experience, Soccer
            Standings emerges as an indispensable tool for staying informed and
            engaged with the latest developments in the soccer standings.
          </p>
          <Link to="/register" className="btn register-link">
            Register
          </Link>
          <Link to="/login" className="btn">
            Login
          </Link>
        </div>
        <img src={main} alt="job-image" className="img main-img" />
      </div>
    </Wrapper>
  );
};

export default Landing;
