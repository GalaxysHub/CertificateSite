import { Metadata } from "next";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardTestsView } from "@/components/dashboard/dashboard-tests-view";

export const metadata: Metadata = {
  title: "Tests - Dashboard",
  description: "Manage your tests, view history, and track progress.",
};

export default function DashboardTestsPage() {
  return (
    <DashboardLayout>
      <DashboardTestsView />
    </DashboardLayout>
  );
}