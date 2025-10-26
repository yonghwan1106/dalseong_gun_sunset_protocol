import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ProjectsClient from '@/components/ProjectsClient';

export default async function ProjectsPage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin');
  }

  return <ProjectsClient />;
}
