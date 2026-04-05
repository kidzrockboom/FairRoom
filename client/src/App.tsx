import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import SearchRoomsPage from "./pages/SearchRoomsPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AccountStatusPage from "./pages/AccountStatusPage";
import RoomDetailsPage from "./pages/RoomDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";
import { currentUser } from "./data/sessionMock";

import AdminOverviewPage from "./pages/admin/AdminOverviewPage";
import AdminStrikesPage from "./pages/admin/AdminStrikesPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";

type RequireRoleProps = {
  role: "admin" | "student";
  redirectTo: string;
};

function RequireRole({ role, redirectTo }: RequireRoleProps) {
  if (currentUser?.role !== role) {
    return <Navigate to={redirectTo} replace />;
  }
  return <Outlet />;
}

function App() {
  const isAdmin = currentUser?.role === "admin";

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAdmin ? "/admin/overview" : "/search"} replace />} />

      <Route element={<DashboardLayout />}>
        {/* student */}
        <Route path="/search" element={<SearchRoomsPage />} />
        <Route path="/rooms/:roomId" element={<RoomDetailsPage />} />
        <Route path="/bookings" element={<MyBookingsPage />} />
        <Route path="/account" element={<AccountStatusPage />} />

        {/* admin */}
        <Route element={<RequireRole role="admin" redirectTo="/search" />}>
          <Route path="/admin/overview" element={<AdminOverviewPage />} />
          <Route path="/admin/strikes" element={<AdminStrikesPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
