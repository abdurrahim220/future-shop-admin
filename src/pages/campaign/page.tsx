import AdminLayoutWithAuth from "@/components/sharedCom/layout";
import UnderConstruction from "@/components/sharedCom/UnderConstruction";

export default function CampaignPage() {
  return (
    <AdminLayoutWithAuth>
      <UnderConstruction pageName="Campaign" />
    </AdminLayoutWithAuth>
  )
}