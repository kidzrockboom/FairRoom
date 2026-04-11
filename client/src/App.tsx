import { Route, Routes } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import SearchRoomsPage from "./pages/SearchRoomsPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AccountStatusPage from "./pages/AccountStatusPage";
import BookingDetailsPage from "./pages/BookingDetailsPage";
import ConfirmBookingPage from "./pages/ConfirmBookingPage";
import RoomDetailsPage from "./pages/RoomDetailsPage";
import AdminBookingsPage from "./pages/admin/AdminBookingsPage";
import AdminInventoryPage from "./pages/admin/AdminInventoryPage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { AppEntryRedirect, RedirectIfAuthenticated, RequireAuth, RequireRole } from "@/features/session/guards";

import AdminStrikesPage from "./pages/admin/AdminStrikesPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppEntryRedirect />} />

      <Route element={<RedirectIfAuthenticated />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<DashboardLayout />}>
          {/* student */}
          <Route path="/search" element={<SearchRoomsPage />} />
          <Route path="/rooms/:roomId" element={<RoomDetailsPage />} />
          <Route path="/bookings/confirm" element={<ConfirmBookingPage />} />
          <Route path="/bookings" element={<MyBookingsPage />} />
          <Route path="/bookings/:bookingId" element={<BookingDetailsPage />} />
          <Route path="/account" element={<AccountStatusPage />} />

          {/* admin */}
          <Route element={<RequireRole role="admin" />}>
            <Route path="/admin/overview" element={<AdminBookingsPage />} />
            <Route path="/admin/bookings" element={<AdminBookingsPage />} />
            <Route path="/admin/inventory" element={<AdminInventoryPage />} />
            <Route path="/admin/strikes" element={<AdminStrikesPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
