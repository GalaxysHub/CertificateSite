import { Metadata } from "next";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardAnalyticsView } from "@/components/dashboard/dashboard-analytics-view";

export const metadata: Metadata = {
  title: "Analytics - Dashboard",
  description: "Track your learning progress and performance analytics.",
};

export default function DashboardAnalyticsPage() {
  return (
    <DashboardLayout>
      <DashboardAnalyticsView />
    </DashboardLayout>
  );
}