import StatCards from "@/components/dashboard/StatCards";
import LineChart from "@/components/dashboard/LineChart";
import BarChart from "@/components/dashboard/BarChart";
import PieChart from "@/components/dashboard/PieChart";
import OrdersTable from "@/components/dashboard/OrdersTable";
import NoticePanel from "@/components/dashboard/NoticePanel";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-5">
      {/* Stat Kartları */}
      <StatCards />

      {/* Grafikler: Çizgi | Bar | Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <LineChart />
        <BarChart />
        <PieChart />
      </div>

      {/* Tablo + Bildirimler */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <OrdersTable />
        </div>
        <div className="lg:col-span-1">
          <NoticePanel />
        </div>
      </div>
    </div>
  );
}
