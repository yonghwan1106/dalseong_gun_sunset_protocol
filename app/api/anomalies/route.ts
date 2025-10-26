import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getAnomalies } from '@/lib/googleSheets';

/**
 * GET /api/anomalies
 *
 * Get all anomalies with optional filtering
 */
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    let anomalies = await getAnomalies();

    // Filter by status
    if (status) {
      anomalies = anomalies.filter(a => a.Status === status);
    }

    // Filter by type
    if (type) {
      anomalies = anomalies.filter(a => a.AnomalyType === type);
    }

    // Sort by timestamp (newest first)
    anomalies.sort((a, b) => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime());

    return NextResponse.json({ anomalies });

  } catch (error) {
    console.error('Anomalies API error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
