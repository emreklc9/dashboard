import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { ProfileProvider } from "@/context/ProfileContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProfileProvider>
      <div className="flex h-full">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <Topbar />
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </ProfileProvider>
  );
}
