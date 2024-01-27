import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { Outlet, redirect, useLoaderData, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { checkDefaultTheme } from "../App";
import Wrapper from "../assets/wrappers/Dashboard";
import { BigSidebar, Loading, Navbar, SmallSidebar } from "../components";
import baseAPI from "../utils/baseAPI";

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async () => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/users/info`
    );
    return data;
  } catch (error) {
    return redirect("/");
  }
};

const DashboardContext = createContext();

// eslint-disable-next-line react/prop-types
const DashboardLayout = () => {
  const { user } = useLoaderData();

  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme());

  const toggleDarkTheme = () => {
    const newDarkTheme = !isDarkTheme;
    setIsDarkTheme(newDarkTheme);
    document.body.classList.toggle("dark-theme", newDarkTheme);
    localStorage.setItem("darkTheme", newDarkTheme);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const logoutUser = async () => {
    try {
      navigate("/");
      const response = await baseAPI.get("/users/logout");
      toast.success(response.data.message);
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error(error.response.data.message);
    }
  };

  // When data is loaded, set isPageLoading to false
  useEffect(() => {
    setIsPageLoading(false);
  }, []);

  // Add an Axios interceptor to handle 401 responses
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );

  return (
    <DashboardContext.Provider
      value={{
        user,
        showSidebar,
        isDarkTheme,
        toggleDarkTheme,
        toggleSidebar,
        logoutUser,
      }}
    >
      <Wrapper>
        <main className="dashboard">
          <SmallSidebar />
          <BigSidebar />
          <div>
            <Navbar />
            <div className="dashboard-page">
              {isPageLoading ? <Loading /> : <Outlet context={{ user }} />}
            </div>
          </div>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDashboardContext = () => useContext(DashboardContext);

export default DashboardLayout;
