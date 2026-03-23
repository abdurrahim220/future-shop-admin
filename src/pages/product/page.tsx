import AdminLayoutWithAuth from "@/components/sharedCom/layout";
import UnderConstruction from "@/components/sharedCom/UnderConstruction";

export default function ProductPage() {
  return (
    <AdminLayoutWithAuth>
      <UnderConstruction pageName="Products" />
    </AdminLayoutWithAuth>
  )
}