import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AnomaliesClient from '@/components/AnomaliesClient';

export default async function AnomaliesPage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin');
  }

  return <AnomaliesClient />;
}
