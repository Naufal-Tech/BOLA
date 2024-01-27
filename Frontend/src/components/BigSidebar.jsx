import logo from "../assets/images/sidebar-logo.svg";
import Wrapper from "../assets/wrappers/BigSidebar";
import { useDashboardContext } from "../pages/DashboardLayout";
import NavLinks from "./NavLinks";

const BigSidebar = () => {
  const { showSidebar } = useDashboardContext();

  return (
    <Wrapper>
      <div
        className={
          showSidebar ? "sidebar-container" : "sidebar-container show-sidebar"
        }
      >
        <div className="content">
          <header>
            <img
              src={logo}
              alt="Logo"
              style={{
                width: "30vw",
                height: "15vh",
                marginTop: "7vh",
                display: "block",
                marginLeft: "-3vw",
                marginRight: "auto",
              }}
            />
          </header>
          <NavLinks isBigSidebar />
        </div>
      </div>
    </Wrapper>
  );
};

export default BigSidebar;
