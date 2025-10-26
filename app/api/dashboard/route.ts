import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import {
  getNewAnomalies,
  getUpcomingSunsets,
  getPendingReviews,
  getAnomalies,
  getProjects,
} from '@/lib/googleSheets';
import type { DashboardKPIs } from '@/types';

/**
 * GET /api/dashboard
 *
 * Get dashboard data including KPIs, recent anomalies, and upcoming sunsets
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get KPIs
    const newAnomalies = await getNewAnomalies();
    const upcomingSunsets = await getUpcomingSunsets(90);
    const pendingReviews = await getPendingReviews();

    const kpis: DashboardKPIs = {
      newAnomaliesCount: newAnomalies.length,
      upcomingSunsetsCount: upcomingSunsets.length,
      pendingReviewsCount: pendingReviews.length,
    };

    // Get recent anomalies (sorted by RiskScore)
    const recentAnomalies = newAnomalies
      .sort((a, b) => b.RiskScore - a.RiskScore)
      .slice(0, 10);

    // Get all anomalies for statistics
    const allAnomalies = await getAnomalies();
    const anomalyStats = {
      total: allAnomalies.length,
      new: allAnomalies.filter(a => a.Status === 'New').length,
      investigating: allAnomalies.filter(a => a.Status === 'Investigating').length,
      dismissed: allAnomalies.filter(a => a.Status === 'Dismissed').length,
      halted: allAnomalies.filter(a => a.Status === 'Halted').length,
      byType: {
        SplitContract: allAnomalies.filter(a => a.AnomalyType === 'SplitContract').length,
        IllegalAsset: allAnomalies.filter(a => a.AnomalyType === 'IllegalAsset').length,
        ZombieSpending: allAnomalies.filter(a => a.AnomalyType === 'ZombieSpending').length,
      },
    };

    // Get project statistics
    const allProjects = await getProjects();
    const projectStats = {
      total: allProjects.length,
      active: allProjects.filter(p => p.Status === 'Active').length,
      underReview: allProjects.filter(p => p.Status === 'UnderReview').length,
      terminated: allProjects.filter(p => p.Status === 'Terminated').length,
    };

    return NextResponse.json({
      kpis,
      recentAnomalies,
      upcomingSunsets,
      pendingReviews,
      anomalyStats,
      projectStats,
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
