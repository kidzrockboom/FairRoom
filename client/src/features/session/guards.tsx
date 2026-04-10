import { Navigate, Outlet } from "react-router-dom";
import Loading from "@/components/ui/loading";
import type { UserRole } from "@/api/contracts";
import { getHomePathForRole } from "./navigation";
import { useSession } from "./useSession";

function FullScreenSessionLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <Loading message="Loading your workspace" size="lg" />
    </div>
  );
}

export function AppEntryRedirect() {
  const { currentUser, isHydrating } = useSession();

  if (isHydrating) {
    return <FullScreenSessionLoader />;
  }

  if (!currentUser) {
    return <Navigate replace to="/login" />;
  }

  return <Navigate replace to={getHomePathForRole(currentUser.role)} />;
}

export function RedirectIfAuthenticated() {
  const { currentUser, isHydrating } = useSession();

  if (isHydrating) {
    return <FullScreenSessionLoader />;
  }

  if (currentUser) {
    return <Navigate replace to={getHomePathForRole(currentUser.role)} />;
  }

  return <Outlet />;
}

export function RequireAuth() {
  const { isAuthenticated, isHydrating } = useSession();

  if (isHydrating) {
    return <FullScreenSessionLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />;
  }

  return <Outlet />;
}

type RequireRoleProps = {
  role: UserRole;
};

export function RequireRole({ role }: RequireRoleProps) {
  const { currentUser, isHydrating } = useSession();

  if (isHydrating) {
    return <FullScreenSessionLoader />;
  }

  if (!currentUser) {
    return <Navigate replace to="/login" />;
  }

  if (currentUser.role !== role) {
    return <Navigate replace to={getHomePathForRole(currentUser.role)} />;
  }

  return <Outlet />;
}
