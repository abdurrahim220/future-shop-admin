import AdminLayoutWithAuth from "@/components/sharedCom/layout";
import UnderConstruction from "@/components/sharedCom/UnderConstruction";

export default function ProfilePage() {
  return (
    <AdminLayoutWithAuth>
      <UnderConstruction pageName="Profile" />
    </AdminLayoutWithAuth>
  )
}
