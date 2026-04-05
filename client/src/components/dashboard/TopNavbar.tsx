import { currentUser } from "@/data/sessionMock";

function TopNavbar() {
  const roleLabel = currentUser?.role ? currentUser.role.toUpperCase() : "STUDENT";
  const displayName = currentUser?.fullName ?? "User";
  const profileId = currentUser?.id ? currentUser.id.slice(0, 8) : "N/A";

  return (
    <header className="topnav">
      <div className="topnav-left">
        <div className="logo">FairRoom</div>
        <span className="role-badge">{roleLabel}</span>
      </div>

      <div className="topnav-right">
        <button className="icon-btn" aria-label="Notifications" type="button">
          🔔
        </button>
        <div className="profile">
          <div>
            <p className="profile-name">{displayName}</p>
            <p className="profile-id">ID: {profileId}</p>
          </div>
          <img src="https://i.pravatar.cc/40?img=12" alt="Profile" className="avatar" />
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;
