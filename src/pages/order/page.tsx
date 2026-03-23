import AdminLayoutWithAuth from "@/components/sharedCom/layout";
import UnderConstruction from "@/components/sharedCom/UnderConstruction";

export default function OrderPage() {
  return (
    <AdminLayoutWithAuth>
      <UnderConstruction pageName="Orders" />
    </AdminLayoutWithAuth>
  )
}