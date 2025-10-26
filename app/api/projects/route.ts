import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getProjects } from '@/lib/googleSheets';

/**
 * GET /api/projects
 *
 * Get all projects with optional filtering
 */
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let projects = await getProjects();

    // Filter by status
    if (status) {
      projects = projects.filter(p => p.Status === status);
    }

    // Sort by StartDate (newest first)
    projects.sort((a, b) => new Date(b.StartDate).getTime() - new Date(a.StartDate).getTime());

    return NextResponse.json({ projects });

  } catch (error) {
    console.error('Projects API error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
