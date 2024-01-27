import { GiToggles } from "react-icons/gi";
// import logo from "../assets/images/logo.svg";
import Wrapper from "../assets/wrappers/Navbar";
import { useDashboardContext } from "../pages/DashboardLayout";
import LogoNavbar from "./LogoNavbar";
import LogoutContainer from "./LogoutContainer";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { toggleSidebar } = useDashboardContext();

  return (
    <Wrapper>
      <div className="nav-center">
        <button type="button" className="toggle-btn" onClick={toggleSidebar}>
          <GiToggles />
        </button>
        <div>
          <LogoNavbar className="logo-container" />
          {/* <img src={logo} alt="Logo" className="logo-navbar" /> */}
          <h3 className="logo-text">Dashboard</h3>
        </div>
        <div className="btn-container">
          <ThemeToggle />
          <LogoutContainer />
        </div>
      </div>
    </Wrapper>
  );
};

export default Navbar;
