import { NavLink } from "react-router-dom";
import { currentUser } from "../../data/sessionMock";

type NavItem = { to: string; label: string };

const studentItems: NavItem[] = [
  { to: "/app/search", label: "Search Rooms" },
  { to: "/app/bookings", label: "My Bookings" },
  { to: "/app/account", label: "Account Status" },
];

const adminItems: NavItem[] = [
  { to: "/app/admin/overview", label: "Overview" },
  { to: "/app/admin/strikes", label: "Strikes" },
  { to: "/app/admin/analytics", label: "Analytics" },
];

function Sidebar() {
  const items = currentUser?.role === "admin" ? adminItems : studentItems;

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? "sidebar-link active" : "sidebar-link")}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;