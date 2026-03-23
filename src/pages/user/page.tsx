import AdminLayoutWithAuth from "@/components/sharedCom/layout";
import UnderConstruction from "@/components/sharedCom/UnderConstruction";

export default function UserPage() {
  return (
    <AdminLayoutWithAuth>
      <UnderConstruction pageName="User" />
    </AdminLayoutWithAuth>
  )
}