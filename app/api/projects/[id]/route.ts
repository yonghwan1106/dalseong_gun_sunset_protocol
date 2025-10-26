import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import {
  getProjectById,
  getTransactions,
  getAnomalies,
  getSunsetReviews,
} from '@/lib/googleSheets';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const projectId = id;

    // Get project
    const project = await getProjectById(projectId);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Get related transactions
    const allTransactions = await getTransactions();
    const transactions = allTransactions.filter(t => t.ProjectID_Ref === projectId);

    // Get related anomalies
    const allAnomalies = await getAnomalies();
    const anomalies = allAnomalies.filter(a => a.ProjectID_Ref === projectId);

    // Get sunset reviews
    const allReviews = await getSunsetReviews();
    const reviews = allReviews.filter(r => r.ProjectID_Ref === projectId);

    // Calculate days until sunset
    const now = new Date();
    const sunsetDate = new Date(project.SunsetDate);
    const daysUntilSunset = Math.ceil((sunsetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Calculate total spent
    const totalSpent = transactions.reduce((sum, t) => sum + t.Amount, 0);

    return NextResponse.json({
      project,
      transactions,
      anomalies,
      reviews,
      stats: {
        daysUntilSunset,
        totalSpent,
        transactionCount: transactions.length,
        anomalyCount: anomalies.length,
        budgetUsage: (totalSpent / project.TotalBudget) * 100,
      },
    });

  } catch (error) {
    console.error('Project detail API error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
