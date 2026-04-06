import { Outlet } from "react-router-dom";
import Navbar from "@/components/old_Navbar";
import Footer from "@/components/old_Footer";

function Layout() {
  return (
    <div>
      <Navbar />
      <main style={{ padding: "1rem" }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
