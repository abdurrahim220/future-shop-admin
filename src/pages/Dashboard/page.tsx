import AdminLayoutWithAuth from "@/components/sharedCom/layout";
import UnderConstruction from "@/components/sharedCom/UnderConstruction";

export default function DashboardPage() {
  return (
    <AdminLayoutWithAuth>
      <UnderConstruction pageName="Dashboard" />
    </AdminLayoutWithAuth>
  )
}
