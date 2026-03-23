import AdminLayoutWithAuth from "@/components/sharedCom/layout";
import UnderConstruction from "@/components/sharedCom/UnderConstruction";

export default function SettingsPage() {
  return (
    <AdminLayoutWithAuth>
      <UnderConstruction pageName="Settings" />
    </AdminLayoutWithAuth>
  )
}
