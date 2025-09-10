import { Metadata } from "next";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardSettingsView } from "@/components/dashboard/dashboard-settings-view";

export const metadata: Metadata = {
  title: "Settings - Dashboard",
  description: "Manage your account settings and preferences.",
};

export default function DashboardSettingsPage() {
  return (
    <DashboardLayout>
      <DashboardSettingsView />
    </DashboardLayout>
  );
}