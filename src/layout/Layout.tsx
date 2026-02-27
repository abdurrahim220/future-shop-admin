
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
const MainLayout = () => {
  return (
    <div className="">
      <Outlet />
      <ToastContainer />
    </div>
  );
};

export default MainLayout;
