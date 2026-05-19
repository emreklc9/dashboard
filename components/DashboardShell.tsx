"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { ProfileProvider } from "@/context/ProfileContext";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import shellStyles from "@/styles/dashboard-shell.module.scss";

function ShellInner({ children }: { children: React.ReactNode }) {
  const { isOpen, close } = useSidebar();

  return (
    <div className={shellStyles.shell}>
      {isOpen && (
        <button
          type="button"
          className={shellStyles.overlay}
          onClick={close}
          aria-label="Menüyü kapat"
        />
      )}
      <Sidebar />
      <div className={shellStyles.main}>
        <Topbar />
        <main className={shellStyles.content}>{children}</main>
      </div>
    </div>
  );
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      <SidebarProvider>
        <ShellInner>{children}</ShellInner>
      </SidebarProvider>
    </ProfileProvider>
  );
}
