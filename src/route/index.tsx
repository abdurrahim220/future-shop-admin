
import MainLayout from "@/layout/Layout";
import DashboardPage from "@/pages/Dashboard/page";
import LoginPage from "@/pages/login/page";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/dashboard",
        element: <DashboardPage />,
      }
    ],
  },
]);


export default router;