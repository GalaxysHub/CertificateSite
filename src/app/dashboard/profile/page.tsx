import { Metadata } from "next";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardProfileView } from "@/components/dashboard/dashboard-profile-view";

export const metadata: Metadata = {
  title: "Profile - Dashboard",
  description: "Manage your profile information and account settings.",
};

export default function DashboardProfilePage() {
  return (
    <DashboardLayout>
      <DashboardProfileView />
    </DashboardLayout>
  );
}