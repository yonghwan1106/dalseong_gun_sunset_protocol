import { NextResponse } from 'next/server';
import {
  getUnprocessedTransactions,
  getProjects,
  appendAnomaly,
  markTransactionsProcessed,
} from '@/lib/googleSheets';
import { runAIAudit } from '@/lib/claudeAI';
import type { Anomaly } from '@/types';

/**
 * POST /api/run-audit
 *
 * Vercel Cron Job endpoint that runs AI-based anomaly detection
 *
 * This endpoint is called daily at midnight by Vercel Cron Jobs
 * Configuration: vercel.json
 */
export async function POST(request: Request) {
  try {
    // Verify cron secret (security measure for Vercel Cron)
    const authHeader = request.headers.get('authorization');

    // In production, verify the Vercel Cron secret
    // For development, skip verification
    if (process.env.NODE_ENV === 'production') {
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    console.log('[AI Audit] Starting daily AI audit...');

    // 1. Get unprocessed transactions
    const unprocessedTransactions = await getUnprocessedTransactions();
    console.log(`[AI Audit] Found ${unprocessedTransactions.length} unprocessed transactions`);

    if (unprocessedTransactions.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No unprocessed transactions to audit',
        anomaliesDetected: 0,
      });
    }

    // 2. Get active projects
    const projects = await getProjects();
    const activeProjects = projects.filter(p => p.Status === 'Active');
    console.log(`[AI Audit] Found ${activeProjects.length} active projects`);

    // 3. Run AI audit
    console.log('[AI Audit] Running Claude Sonnet 4.0 analysis...');
    const aiAnomalies = await runAIAudit(unprocessedTransactions, activeProjects);
    console.log(`[AI Audit] AI detected ${aiAnomalies.length} anomalies`);

    // 4. Save anomalies to Google Sheets
    const timestamp = new Date().toISOString();
    for (const aiAnomaly of aiAnomalies) {
      const anomaly: Anomaly = {
        AnomalyID: `A-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        Timestamp: timestamp,
        ProjectID_Ref: aiAnomaly.ProjectID_Ref,
        Involved_TIDs: aiAnomaly.Involved_TIDs,
        RiskScore: aiAnomaly.RiskScore,
        AI_Reasoning: aiAnomaly.AI_Reasoning,
        AnomalyType: aiAnomaly.AnomalyType,
        Status: 'New',
      };

      await appendAnomaly(anomaly);
      console.log(`[AI Audit] Saved anomaly ${anomaly.AnomalyID}`);
    }

    // 5. Mark all transactions as processed
    const transactionIds = unprocessedTransactions.map(t => t.TransactionID);
    await markTransactionsProcessed(transactionIds);
    console.log(`[AI Audit] Marked ${transactionIds.length} transactions as processed`);

    // 6. Send notifications (Google Chat - optional)
    if (aiAnomalies.length > 0 && process.env.GOOGLE_CHAT_WEBHOOK_URL) {
      try {
        await fetch(process.env.GOOGLE_CHAT_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🚨 AI 감사 경보: ${aiAnomalies.length}건의 이상 징후가 탐지되었습니다.\n\n` +
                  `최고 위험도: ${Math.max(...aiAnomalies.map(a => a.RiskScore))}/10\n` +
                  `대시보드에서 확인해 주십시오.`,
          }),
        });
        console.log('[AI Audit] Notification sent to Google Chat');
      } catch (error) {
        console.error('[AI Audit] Failed to send Google Chat notification:', error);
      }
    }

    console.log('[AI Audit] Completed successfully');

    return NextResponse.json({
      success: true,
      message: 'AI audit completed successfully',
      anomaliesDetected: aiAnomalies.length,
      transactionsProcessed: transactionIds.length,
      timestamp,
    });

  } catch (error) {
    console.error('[AI Audit] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Allow GET for testing purposes
export async function GET() {
  return NextResponse.json({
    message: 'AI Audit endpoint',
    note: 'Use POST to trigger audit',
  });
}
