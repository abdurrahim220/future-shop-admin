import AdminLayoutWithAuth from "@/components/sharedCom/layout";
import UnderConstruction from "@/components/sharedCom/UnderConstruction";

export default function StockMovementPage() {
  return (
    <AdminLayoutWithAuth>
      <UnderConstruction pageName="Stock Movement" />
    </AdminLayoutWithAuth>
  )
}