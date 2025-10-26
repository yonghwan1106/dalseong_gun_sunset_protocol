'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { AnomalyWithDetails, Project, Transaction } from '@/types';

interface AnomalyDetailClientProps {
  anomalyId: string;
}

export default function AnomalyDetailClient({ anomalyId }: AnomalyDetailClientProps) {
  const router = useRouter();
  const [anomaly, setAnomaly] = useState<AnomalyWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchAnomalyDetail();
  }, [anomalyId]);

  const fetchAnomalyDetail = async () => {
    try {
      const response = await fetch(`/api/anomalies/${anomalyId}`);
      if (!response.ok) throw new Error('Failed to fetch anomaly details');
      const data = await response.json();
      setAnomaly(data.anomaly);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!confirm(`상태를 "${getStatusLabel(newStatus)}"(으)로 변경하시겠습니까?`)) {
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch(`/api/anomalies/${anomalyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      await fetchAnomalyDetail();
      alert('상태가 성공적으로 변경되었습니다.');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setUpdating(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 8) return 'text-red-600 bg-red-50 border-red-200';
    if (score >= 5) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      New: 'bg-red-100 text-red-800 border-red-200',
      Investigating: 'bg-orange-100 text-orange-800 border-orange-200',
      Halted: 'bg-purple-100 text-purple-800 border-purple-200',
      Dismissed: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      New: '신규',
      Investigating: '조사 중',
      Halted: '집행 중지',
      Dismissed: '기각',
    };
    return labels[status] || status;
  };

  const getAnomalyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      SplitContract: '쪼개기 계약',
      IllegalAsset: '부적절 자산',
      ZombieSpending: '관성적 지출',
    };
    return labels[type] || type;
  };

  const getAnomalyTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      SplitContract: '📋',
      IllegalAsset: '⚠️',
      ZombieSpending: '⏰',
    };
    return icons[type] || '🔍';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto"></div>
          <p className="mt-6 text-lg text-gray-700 font-medium">데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error || !anomaly) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <div className="text-center bg-white rounded-xl shadow-xl p-8 max-w-md">
          <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <span className="text-4xl">❌</span>
          </div>
          <p className="text-xl font-semibold text-gray-900 mb-2">오류 발생</p>
          <p className="text-gray-600 mb-6">{error || '이상 징후를 찾을 수 없습니다'}</p>
          <Link
            href="/anomalies"
            className="inline-block px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 shadow-lg font-semibold"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-1.5 rounded-full text-xs font-bold mb-2 shadow-md">
                <span>🏆</span>
                <span>달성군 정책 제안 공모전 출품작</span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                이상 징후 상세 정보
              </h1>
              <p className="mt-2 text-sm text-gray-600 font-medium">
                🔍 AI가 탐지한 예산 낭비 의심 사례 분석
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/dashboard"
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all font-semibold"
              >
                🏠 대시보드
              </Link>
              <Link
                href="/anomalies"
                className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all font-semibold"
              >
                ← 목록
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Anomaly Overview */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl">
                <span className="text-5xl">{getAnomalyTypeIcon(anomaly.AnomalyType)}</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {getAnomalyTypeLabel(anomaly.AnomalyType)}
                </h2>
                <p className="text-sm text-gray-500">ID: {anomaly.AnomalyID}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className={`inline-flex items-center px-6 py-3 rounded-xl text-lg font-bold border-2 shadow-md ${getRiskColor(anomaly.RiskScore)}`}>
                <span className="mr-2">⚠️</span>
                위험도 {anomaly.RiskScore}/10
              </div>
              <div className={`px-6 py-3 rounded-xl text-lg font-bold shadow-md border-2 ${getStatusColor(anomaly.Status)}`}>
                {getStatusLabel(anomaly.Status)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-500 mb-1">탐지 시간</p>
              <p className="text-lg font-bold text-gray-900">
                {new Date(anomaly.Timestamp).toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-500 mb-1">관련 거래</p>
              <p className="text-lg font-bold text-gray-900">
                {anomaly.Involved_TIDs.length}건
              </p>
            </div>
          </div>
        </div>

        {/* AI Analysis */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl shadow-xl p-8 mb-8 border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <span className="text-4xl">🤖</span>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">AI 분석 결과</h3>
              <p className="text-gray-800 text-lg leading-relaxed">{anomaly.AI_Reasoning}</p>
            </div>
          </div>
        </div>

        {/* Related Project */}
        {anomaly.project && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-100 rounded-xl">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">관련 사업 정보</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-2">사업명</p>
                <p className="text-lg font-bold text-gray-900">{anomaly.project.ProjectName}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-2">담당 부서</p>
                <p className="text-lg font-bold text-gray-900">{anomaly.project.Department}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-2">총 예산</p>
                <p className="text-lg font-bold text-blue-600">
                  {anomaly.project.TotalBudget.toLocaleString()}원
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-2">일몰 예정일</p>
                <p className="text-lg font-bold text-orange-600">
                  {new Date(anomaly.project.SunsetDate).toLocaleDateString('ko-KR')}
                </p>
              </div>
            </div>
            <div className="mt-6">
              <Link
                href={`/projects/${anomaly.ProjectID_Ref}`}
                className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 shadow-lg font-semibold"
              >
                사업 상세보기 →
              </Link>
            </div>
          </div>
        )}

        {/* Related Transactions */}
        {anomaly.transactions && anomaly.transactions.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
            <div className="p-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <span className="text-2xl">💳</span>
                </div>
                <h3 className="text-2xl font-bold">관련 거래 내역 ({anomaly.transactions.length}건)</h3>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      날짜
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      거래처
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      금액
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      설명
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      부서
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {anomaly.transactions.map((transaction) => (
                    <tr key={transaction.TransactionID} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {new Date(transaction.Date).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {transaction.VendorName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                        {transaction.Amount.toLocaleString()}원
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {transaction.Description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {transaction.Department}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-end">
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">총 거래 금액</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {anomaly.transactions.reduce((sum, t) => sum + t.Amount, 0).toLocaleString()}원
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Actions */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <span className="text-3xl">⚙️</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">상태 변경</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => updateStatus('New')}
              disabled={updating || anomaly.Status === 'New'}
              className={`px-6 py-3 rounded-xl font-bold shadow-md transition-all ${
                anomaly.Status === 'New'
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105'
              }`}
            >
              🔴 신규
            </button>
            <button
              onClick={() => updateStatus('Investigating')}
              disabled={updating || anomaly.Status === 'Investigating'}
              className={`px-6 py-3 rounded-xl font-bold shadow-md transition-all ${
                anomaly.Status === 'Investigating'
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 hover:scale-105'
              }`}
            >
              🟠 조사 중
            </button>
            <button
              onClick={() => updateStatus('Halted')}
              disabled={updating || anomaly.Status === 'Halted'}
              className={`px-6 py-3 rounded-xl font-bold shadow-md transition-all ${
                anomaly.Status === 'Halted'
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 hover:scale-105'
              }`}
            >
              🟣 집행 중지
            </button>
            <button
              onClick={() => updateStatus('Dismissed')}
              disabled={updating || anomaly.Status === 'Dismissed'}
              className={`px-6 py-3 rounded-xl font-bold shadow-md transition-all ${
                anomaly.Status === 'Dismissed'
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 hover:scale-105'
              }`}
            >
              ⚪ 기각
            </button>
          </div>
          {updating && (
            <div className="mt-4 flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-sm font-medium">상태 변경 중...</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
