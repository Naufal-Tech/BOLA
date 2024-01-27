import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useRouteError } from "react-router-dom";
import img from "../assets/images/not-found.svg";
import WrapperError from "../assets/wrappers/ErrorPage";

const Error = () => {
  const error = useRouteError();
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  // Fetch user info when the component mounts
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/info`
        );
        setUserInfo(response.data.user);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  // Cek Status Code (Server)
  if (error.status === 404) {
    return (
      <WrapperError>
        <div>
          <img src={img} alt="img-not-found" />
          <h3>Oops...! Page is Not Found</h3>
          <p>We can&apos;t seem to find the page that you are looking for.</p>
          <div className="button-container">
            {userInfo ? (
              <button
                className="button-link"
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard
              </button>
            ) : (
              <Link className="button-link" to="/">
                Return to Home
              </Link>
            )}
          </div>
        </div>
      </WrapperError>
    );
  }

  return (
    <WrapperError>
      <div>
        <h3>Something Went Wrong</h3>
      </div>
    </WrapperError>
  );
};

export default Error;
