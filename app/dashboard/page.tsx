import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import DashboardClientEnhanced from '@/components/DashboardClientEnhanced';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin');
  }

  return <DashboardClientEnhanced />;
}
