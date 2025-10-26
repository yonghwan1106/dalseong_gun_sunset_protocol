import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ProjectDetailClient from '@/components/ProjectDetailClient';

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin');
  }

  const { id } = await params;

  return <ProjectDetailClient projectId={id} />;
}
