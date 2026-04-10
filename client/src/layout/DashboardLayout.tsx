import { useState } from "react";
import { Outlet } from "react-router-dom";
import AppFooter from "@/components/layout/AppFooter";
import AppHeader from "@/components/layout/AppHeader";
import AppSidebar from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, iconPropsAction } from "@/lib/icons";

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-content">
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <AppHeader
          mobileSidebarTrigger={
            <SheetTrigger
              render={
                <Button aria-label="Open navigation" size="icon-sm" variant="ghost" />
              }
            >
              <Menu {...iconPropsAction} aria-hidden="true" />
            </SheetTrigger>
          }
        />

        <div className="flex min-h-[calc(100vh-4.5rem)] bg-background">
          <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
            <AppSidebar />
          </aside>

          <SheetContent className="w-[290px] border-r border-sidebar-border p-0" side="left">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation</SheetTitle>
              <SheetDescription>Browse FairRoom sections</SheetDescription>
            </SheetHeader>
            <AppSidebar onNavigate={() => setIsSidebarOpen(false)} />
          </SheetContent>

          <div className="flex min-w-0 flex-1 flex-col bg-background">
            <main className="flex flex-1 bg-background">
              <Outlet />
            </main>
            <AppFooter />
          </div>
        </div>
      </Sheet>
    </div>
  );
}

export default DashboardLayout;
