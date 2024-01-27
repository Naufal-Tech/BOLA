import { NavLink } from "react-router-dom";
import { useDashboardContext } from "../pages/DashboardLayout";
import Links from "../utils/Links";

// eslint-disable-next-line react/prop-types
const NavLinks = ({ isBigSidebar }) => {
  const { toggleSidebar, user } = useDashboardContext();

  return (
    <div className="nav-links">
      {Links.map((link) => {
        const { id, path, icon, text } = link;
        const { role } = user;
        if (path === "admin" && role !== "Admin") return;
        return (
          <NavLink
            to={path}
            key={id}
            className="nav-link"
            onClick={isBigSidebar ? null : toggleSidebar}
            end
          >
            <span className="icon">{icon}</span>
            {text}
          </NavLink>
        );
      })}
    </div>
  );
};

export default NavLinks;
