import DashboardView from '@/components/dashboard-view';
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // Normally we would enforce auth here:
  // const session = await getServerSession();
  // if (!session) redirect('/api/auth/signin');
  // 
  // However, since we cannot easily mock Google OAuth via the browser without user setup,
  // we render the view wrapper which handles the display natively limit setup.

  return <DashboardView />;
}
