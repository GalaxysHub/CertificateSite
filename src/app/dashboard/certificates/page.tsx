import { Metadata } from "next";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardCertificatesView } from "@/components/dashboard/dashboard-certificates-view";

export const metadata: Metadata = {
  title: "Certificates - Dashboard",
  description: "Manage your certificates, download, and share achievements.",
};

export default function DashboardCertificatesPage() {
  return (
    <DashboardLayout>
      <DashboardCertificatesView />
    </DashboardLayout>
  );
}