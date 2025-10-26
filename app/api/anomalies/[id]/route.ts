import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import {
  getAnomalyById,
  getProjectById,
  getTransactions,
  updateAnomalyStatus,
} from '@/lib/googleSheets';
import type { AnomalyWithDetails } from '@/types';

/**
 * GET /api/anomalies/[id]
 *
 * Get anomaly details with related project and transactions
 */
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
    const anomalyId = id;
    const anomaly = await getAnomalyById(anomalyId);

    if (!anomaly) {
      return NextResponse.json({ error: 'Anomaly not found' }, { status: 404 });
    }

    // Get related project
    const project = await getProjectById(anomaly.ProjectID_Ref);

    // Get related transactions
    const allTransactions = await getTransactions();
    const transactions = allTransactions.filter(t =>
      anomaly.Involved_TIDs.includes(t.TransactionID)
    );

    const anomalyWithDetails: AnomalyWithDetails = {
      ...anomaly,
      project: project || undefined,
      transactions,
    };

    return NextResponse.json({ anomaly: anomalyWithDetails });

  } catch (error) {
    console.error('Anomaly detail API error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/anomalies/[id]
 *
 * Update anomaly status
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const anomalyId = id;
    const body = await request.json();
    const { status } = body;

    if (!status || !['New', 'Investigating', 'Dismissed', 'Halted'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await updateAnomalyStatus(anomalyId, status);

    // Send Google Chat notification if status is "Investigating"
    if (status === 'Investigating' && process.env.GOOGLE_CHAT_WEBHOOK_URL) {
      try {
        const anomaly = await getAnomalyById(anomalyId);
        const project = anomaly ? await getProjectById(anomaly.ProjectID_Ref) : null;

        await fetch(process.env.GOOGLE_CHAT_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🔍 조사 요청\n\n` +
                  `프로젝트: ${project?.ProjectName || anomaly?.ProjectID_Ref}\n` +
                  `담당 부서: ${project?.Department}\n` +
                  `이상 징후 유형: ${anomaly?.AnomalyType}\n` +
                  `위험도: ${anomaly?.RiskScore}/10\n\n` +
                  `소명 자료를 제출해 주십시오.`,
          }),
        });
      } catch (error) {
        console.error('Failed to send Google Chat notification:', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Anomaly status updated',
    });

  } catch (error) {
    console.error('Anomaly update API error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
