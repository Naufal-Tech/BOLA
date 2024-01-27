import { useState } from "react";
import { FaCaretDown, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Wrapper from "../assets/wrappers/LogoutContainer";
import { useDashboardContext } from "../pages/DashboardLayout";

const LogoutContainer = () => {
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();
  const { user, logoutUser } = useDashboardContext();

  const redirectToProfile = () => {
    navigate("/dashboard/profile");
  };

  return (
    <Wrapper>
      <button
        type="button"
        className="btn logout-btn"
        onClick={() => setShowLogout(!showLogout)}
      >
        {user.img_profile ? (
          <img src={user.img_profile} alt="avatar" className="img" />
        ) : (
          <FaUserCircle />
        )}

        {user?.username}
        <FaCaretDown />
      </button>
      <div className={showLogout ? "dropdown show-dropdown" : "dropdown"}>
        <button
          type="button"
          className="dropdown-btn"
          onClick={redirectToProfile}
        >
          Profile
        </button>
        <div className="divider" />
        <button type="button" className="dropdown-btn" onClick={logoutUser}>
          Logout
        </button>
      </div>
    </Wrapper>
  );
};

export default LogoutContainer;
