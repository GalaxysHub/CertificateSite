import { Metadata } from "next";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";

export const metadata: Metadata = {
  title: "Dashboard - Certificate Testing Platform",
  description: "Overview of your testing platform metrics and activities.",
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardOverview />
    </DashboardLayout>
  );
}
