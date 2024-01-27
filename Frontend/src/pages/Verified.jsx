import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import img from "../assets/images/not-found.svg";
import VerifiedImage from "../assets/images/verified.png";
import WrapperError from "../assets/wrappers/ErrorPage";
import Wrapper from "../assets/wrappers/VerifiedPage";
import { Loading, Logo } from "../components";

const Verified = () => {
  const [userData, setUserData] = useState(null);
  const [status, setStatus] = useState("loading"); // Default status is "loading"

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/info`
        );
        const user = response.data.user;
        setUserData(user);
        setStatus("success");
      } catch (error) {
        console.error("Error fetching user data:", error);
        setStatus("failed");
      }
    };

    fetchUserData();
  }, []);

  // Render the loading component while waiting for data
  if (status === "loading") {
    return <Loading center />;
  }

  return (
    <>
      {status === "success" && userData && userData.isVerified ? (
        <Wrapper>
          <nav>
            <Logo />
          </nav>
          <div className="container page d-flex justify-content-center align-items-center">
            <div className="text-center">
              <h1 style={{ marginTop: "3rem" }} className="info">
                <span>You are Verified!</span>
              </h1>
              <img
                src={VerifiedImage}
                alt="project-image"
                className="img"
                style={{
                  maxWidth: "400px",
                  margin: "0 auto",
                  marginBottom: "0.5rem",
                }}
              />
              <h1>
                Enjoy <span>Exploring </span> Our App
              </h1>
              <Link
                to="/dashboard"
                className="btn text-center"
                style={{ marginTop: "1.5rem", marginRight: "1rem" }}
              >
                Back to Dashboard
              </Link>
              <Link
                to="/login"
                className="btn text-center"
                style={{ marginTop: "1.5rem" }}
              >
                Back to Login
              </Link>
            </div>
          </div>
        </Wrapper>
      ) : (
        <WrapperError>
          <div>
            <img src={img} alt="img-not-found" />
            <h3>Oops...! Page is Not Found</h3>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            <p>We can't seem to find the page that you are looking for.</p>
            <div className="button-container">
              <Link className="button-link" to="/">
                Return to Home
              </Link>
            </div>
          </div>
        </WrapperError>
      )}
    </>
  );
};

export default Verified;
