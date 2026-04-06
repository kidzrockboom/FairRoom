import { Outlet } from "react-router-dom";
import TopNavbar from "@/components/dashboard/old_TopNavbar";
import Sidebar from "@/components/dashboard/old_Sidebar";
import "../styles/dashboard.css";

function DashboardLayout() {
  return (
    <div className="dashboard-shell">
      <TopNavbar />
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
