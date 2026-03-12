import MainLayout from "@/layout/Layout";
import AddressPage from "@/pages/address/page";
import BrancesPage from "@/pages/branches/page";
import BranchInventoryPage from "@/pages/branchinventory/page";
import BrandsPage from "@/pages/brands/page";
import CampaignPage from "@/pages/campaign/page";
import CategoriesPage from "@/pages/categories/page";
import ComboOffersPage from "@/pages/combooffers/page";
import CuponsPage from "@/pages/cupons/page";
import DashboardPage from "@/pages/Dashboard/page";
import LoginPage from "@/pages/login/page";
import NotificationsPage from "@/pages/notifications/page";
import OrderPage from "@/pages/order/page";
import PayoutPage from "@/pages/payout/page";
import ProductPage from "@/pages/product/page";
import ProfilePage from "@/pages/profile/page";
import ReviewsPage from "@/pages/reviews/page";
import SellerPage from "@/pages/seller/page";
import SellerWalletPage from "@/pages/sellerwallet/page";
import SettingsPage from "@/pages/settings/page";
import StockMovementPage from "@/pages/stockmovement/page";
import StockTransferPage from "@/pages/stocktransfer/page";
import SubOrderPage from "@/pages/suborder/page";
import SupportPage from "@/pages/support/page";
import UserPage from "@/pages/user/page";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/address",
        element: <AddressPage />,
      },
      {
        path: "/branches",
        element: <BrancesPage />,
      },
      {
        path: "/branchinventory",
        element: <BranchInventoryPage />,
      },
      {
        path: "/brands",
        element: <BrandsPage />,
      },
      {
        path: "/campaign",
        element: <CampaignPage />,
      },
      {
        path: "/categories",
        element: <CategoriesPage />,
      },
      {
        path: "/combooffers",
        element: <ComboOffersPage />,
      },
      {
        path: "/cupons",
        element: <CuponsPage />,
      },
      {
        path: "/notifications",
        element: <NotificationsPage />,
      },
      {
        path: "/order",
        element: <OrderPage />,
      },
      {
        path: "/payout",
        element: <PayoutPage />,
      },
      {
        path: "/product",
        element: <ProductPage />,
      },
      {
        path: "/reviews",
        element: <ReviewsPage />,
      },
      {
        path: "/seller",
        element: <SellerPage />,
      },
      {
        path: "/sellerwallet",
        element: <SellerWalletPage />,
      },
      {
        path: "/stockmovement",
        element: <StockMovementPage />,
      },
      {
        path: "/stocktransfer",
        element: <StockTransferPage />,
      },
      {
        path: "/suborder",
        element: <SubOrderPage />,
      },
      {
        path: "/user",
        element: <UserPage />,
      },
      {
        path:'/support',
        element:<SupportPage/>
      },
      {
        path:"/settings",
        element:<SettingsPage/>
      },{
        path:"/profile",
        element:<ProfilePage/>
      }
    ],
  },
]);

export default router;
