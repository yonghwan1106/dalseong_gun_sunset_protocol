import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AnomalyDetailClient from '@/components/AnomalyDetailClient';

export default async function AnomalyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin');
  }

  const { id } = await params;

  return <AnomalyDetailClient anomalyId={id} />;
}
