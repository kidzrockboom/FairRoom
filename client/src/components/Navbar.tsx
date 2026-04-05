import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ display: "flex", gap: "1rem", padding: "1rem", borderBottom: "1px solid #ddd" }}>
      <NavLink to="/search">Search</NavLink>
      <NavLink to="/rooms">Rooms</NavLink>
      <NavLink to="/bookings">My Bookings</NavLink>
      <NavLink to="/admin/overview">Admin</NavLink>
      <NavLink to="/login">Login</NavLink>
    </nav>
  );
}

export default Navbar;
