/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorComponent } from "./components";
import {
  Admin,
  CreateMatch,
  DashboardLayout,
  Error,
  ForgetPassword,
  HomeLayout,
  InvalidLink,
  Landing,
  Login,
  Profile,
  Register,
  ResetPassword,
  Standings,
  Verified,
} from "./pages";

import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { loader as adminLoader } from "./pages/Admin";
import { loader as dashboardLoader } from "./pages/DashboardLayout";
import { standingsData as standingsLoader } from "./pages/Standings";

export const checkDefaultTheme = () => {
  const isDarkTheme = localStorage.getItem("darkTheme") === "true";
  document.body.classList.toggle("dark-theme", isDarkTheme);
  return isDarkTheme;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

export const isDarkThemeEnabled = checkDefaultTheme();

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forget-password",
        element: <ForgetPassword />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "verified",
        element: <Verified />,
      },
      {
        path: "invalid",
        element: <InvalidLink />,
      },
      {
        path: "dashboard",
        element: <DashboardLayout isDarkThemeEnabled={isDarkThemeEnabled} />,
        loader: dashboardLoader,
        errorElement: <ErrorComponent />,
        children: [
          {
            path: "create-match",
            element: <CreateMatch />,
            errorElement: <ErrorComponent />,
          },
          {
            path: "standings",
            loader: standingsLoader ? standingsLoader : undefined,
            element: <Standings />,
            errorElement: <ErrorComponent />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "admin",
            element: <Admin />,
            loader: adminLoader,
            errorElement: <ErrorComponent />,
          },
        ],
      },
    ],
  },
]);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
