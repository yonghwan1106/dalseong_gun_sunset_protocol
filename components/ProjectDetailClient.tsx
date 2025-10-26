'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Project, Transaction, Anomaly, SunsetReview } from '@/types';

interface ProjectDetailData {
  project: Project;
  transactions: Transaction[];
  anomalies: Anomaly[];
  reviews: SunsetReview[];
  stats: {
    daysUntilSunset: number;
    totalSpent: number;
    transactionCount: number;
    anomalyCount: number;
    budgetUsage: number;
  };
}

interface ProjectDetailClientProps {
  projectId: string;
}

export default function ProjectDetailClient({ projectId }: ProjectDetailClientProps) {
  const router = useRouter();
  const [data, setData] = useState<ProjectDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjectDetail();
  }, [projectId]);

  const fetchProjectDetail = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error('Failed to fetch project details');
      const projectData = await response.json();
      setData(projectData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getSunsetUrgency = (days: number) => {
    if (days <= 30) return { color: 'text-red-600 bg-red-50 border-red-200', label: '긴급', icon: '🔴' };
    if (days <= 60) return { color: 'text-orange-600 bg-orange-50 border-orange-200', label: '주의', icon: '🟠' };
    if (days <= 90) return { color: 'text-yellow-600 bg-yellow-50 border-yellow-200', label: '확인', icon: '🟡' };
    return { color: 'text-green-600 bg-green-50 border-green-200', label: '양호', icon: '🟢' };
  };

  const getRiskColor = (score: number) => {
    if (score >= 8) return 'text-red-600 bg-red-50 border-red-200';
    if (score >= 5) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      New: 'bg-red-100 text-red-800',
      Investigating: 'bg-orange-100 text-orange-800',
      Halted: 'bg-purple-100 text-purple-800',
      Dismissed: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto"></div>
          <p className="mt-6 text-lg text-gray-700 font-medium">데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center bg-white rounded-xl shadow-xl p-8 max-w-md">
          <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <span className="text-4xl">❌</span>
          </div>
          <p className="text-xl font-semibold text-gray-900 mb-2">오류 발생</p>
          <p className="text-gray-600 mb-6">{error || '사업을 찾을 수 없습니다'}</p>
          <Link
            href="/projects"
            className="inline-block px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 shadow-lg font-semibold"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const { project, transactions, anomalies, reviews, stats } = data;
  const urgency = getSunsetUrgency(stats.daysUntilSunset);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold mb-2 shadow-md">
                <span>🏆</span>
                <span>달성군 정책 제안 공모전 출품작</span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                정책 사업 상세 정보
              </h1>
              <p className="mt-2 text-sm text-gray-600 font-medium">
                📊 일몰제 적용 사업 상세 분석
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
                href="/projects"
                className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all font-semibold"
              >
                ← 목록
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Overview */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl">
                <span className="text-5xl">📁</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {project.ProjectName}
                </h2>
                <p className="text-sm text-gray-500">ID: {project.ProjectID}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className={`inline-flex items-center px-6 py-3 rounded-xl text-lg font-bold border-2 shadow-md ${urgency.color}`}>
                <span className="mr-2">{urgency.icon}</span>
                일몰 {urgency.label}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <p className="text-sm font-semibold text-blue-700 mb-1">담당 부서</p>
              <p className="text-xl font-bold text-blue-900">{project.Department}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <p className="text-sm font-semibold text-green-700 mb-1">총 예산</p>
              <p className="text-xl font-bold text-green-900">
                {project.TotalBudget.toLocaleString()}원
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <p className="text-sm font-semibold text-purple-700 mb-1">시작일</p>
              <p className="text-lg font-bold text-purple-900">
                {new Date(project.StartDate).toLocaleDateString('ko-KR')}
              </p>
            </div>
            <div className={`bg-gradient-to-br rounded-xl p-4 border-2 ${urgency.color}`}>
              <p className="text-sm font-semibold mb-1">일몰 예정일</p>
              <p className="text-lg font-bold">
                {new Date(project.SunsetDate).toLocaleDateString('ko-KR')}
              </p>
              <p className="text-xs mt-1 font-semibold">
                {stats.daysUntilSunset > 0 ? `${stats.daysUntilSunset}일 남음` : '일몰 도래'}
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-600">집행 금액</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {stats.totalSpent.toLocaleString()}원
            </p>
            <p className="text-xs text-gray-500 mt-1">
              예산 대비 {stats.budgetUsage.toFixed(1)}%
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">💳</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-600">거래 건수</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.transactionCount}건</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-600">이상 징후</h3>
            </div>
            <p className="text-2xl font-bold text-red-600">{stats.anomalyCount}건</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-600">심사 내역</h3>
            </div>
            <p className="text-2xl font-bold text-purple-600">{reviews.length}건</p>
          </div>
        </div>

        {/* Budget Usage Chart */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">예산 집행 현황</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">집행률</span>
                <span className="text-sm font-bold text-blue-600">{stats.budgetUsage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: `${Math.min(stats.budgetUsage, 100)}%` }}
                >
                  {stats.budgetUsage > 10 && (
                    <span className="text-white text-xs font-bold">{stats.budgetUsage.toFixed(1)}%</span>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-500 mb-1">총 예산</p>
                <p className="text-lg font-bold text-gray-900">{project.TotalBudget.toLocaleString()}원</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">잔여 예산</p>
                <p className="text-lg font-bold text-green-600">
                  {(project.TotalBudget - stats.totalSpent).toLocaleString()}원
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Anomalies */}
        {anomalies.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
            <div className="p-6 bg-gradient-to-r from-red-500 to-orange-500 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h3 className="text-2xl font-bold">관련 이상 징후 ({anomalies.length}건)</h3>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {anomalies.slice(0, 5).map((anomaly) => (
                <div key={anomaly.AnomalyID} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold border ${getRiskColor(anomaly.RiskScore)}`}>
                          위험도 {anomaly.RiskScore}/10
                        </div>
                        <div className={`px-3 py-1.5 rounded-lg text-sm font-bold ${getStatusColor(anomaly.Status)}`}>
                          {getStatusLabel(anomaly.Status)}
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                          {getAnomalyTypeLabel(anomaly.AnomalyType)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{anomaly.AI_Reasoning}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(anomaly.Timestamp).toLocaleString('ko-KR')}
                      </p>
                    </div>
                    <Link
                      href={`/anomalies/${anomaly.AnomalyID}`}
                      className="ml-4 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 shadow-lg font-semibold text-sm whitespace-nowrap"
                    >
                      상세보기 →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Transactions */}
        {transactions.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
            <div className="p-6 bg-gradient-to-r from-green-500 to-blue-500 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <span className="text-2xl">💳</span>
                </div>
                <h3 className="text-2xl font-bold">거래 내역 ({transactions.length}건)</h3>
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.slice(0, 10).map((transaction) => (
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {transactions.length > 10 && (
              <div className="p-4 bg-gray-50 text-center">
                <p className="text-sm text-gray-600">
                  총 {transactions.length}건 중 최근 10건을 표시하고 있습니다
                </p>
              </div>
            )}
          </div>
        )}

        {/* Sunset Reviews */}
        {reviews.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="text-2xl font-bold">일몰 심사 내역 ({reviews.length}건)</h3>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {reviews.map((review) => (
                <div key={review.ReviewID} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-1">제출일</p>
                      <p className="text-base font-bold text-gray-900">
                        {new Date(review.SubmitDate).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-1">결정</p>
                      <p className="text-base font-bold text-gray-900">
                        {review.Decision ? (review.Decision === 'Extend' ? '연장' : '종료') : '대기 중'}
                      </p>
                    </div>
                  </div>
                  {review.PerformanceReportURL && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700 mb-2">성과 보고서</p>
                      <a
                        href={review.PerformanceReportURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        보고서 보기 →
                      </a>
                    </div>
                  )}
                  {review.AuditorNotes && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-semibold text-blue-900 mb-2">감사관 의견</p>
                      <p className="text-sm text-gray-700">{review.AuditorNotes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
