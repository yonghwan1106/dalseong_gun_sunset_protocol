'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Anomaly, Project, SunsetReview, DashboardKPIs } from '@/types';

interface DashboardData {
  kpis: DashboardKPIs;
  recentAnomalies: Anomaly[];
  upcomingSunsets: Project[];
  pendingReviews: SunsetReview[];
  anomalyStats: {
    total: number;
    new: number;
    investigating: number;
    dismissed: number;
    halted: number;
    byType: {
      SplitContract: number;
      IllegalAsset: number;
      ZombieSpending: number;
    };
  };
  projectStats: {
    total: number;
    active: number;
    underReview: number;
    terminated: number;
  };
}

export default function DashboardClientEnhanced() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-lg text-gray-700 font-medium">데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
        <div className="text-center bg-white rounded-lg shadow-xl p-8">
          <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-xl font-semibold text-gray-900">오류 발생</p>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const getRiskColor = (score: number) => {
    if (score >= 8) return 'text-red-600 bg-red-50 border-red-200';
    if (score >= 5) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-yellow-600 bg-yellow-50 border-yellow-200';
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
    if (type === 'SplitContract') {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      );
    }
    if (type === 'IllegalAsset') {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                달성군 선셋 프로토콜
              </h1>
              <p className="mt-2 text-sm text-gray-600 font-medium">
                🤖 AI 기반 예산 낭비 선제적 차단 시스템
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/about"
                className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all font-semibold"
              >
                ℹ️ 소개
              </Link>
              <Link
                href="/anomalies"
                className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all font-semibold"
              >
                🚨 이상 징후
              </Link>
              <Link
                href="/projects"
                className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all font-semibold"
              >
                📊 정책 관리
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* 신규 이상 징후 */}
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-2xl p-6 text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">신규 이상 징후</p>
                <p className="text-5xl font-bold mt-2">{data.kpis.newAnomaliesCount}</p>
                <p className="text-red-100 text-xs mt-2">AI 탐지 건수</p>
              </div>
              <div className="p-4 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <span className="text-5xl">⚠️</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-red-400">
              <Link href="/anomalies" className="text-sm font-semibold hover:underline flex items-center gap-2">
                상세보기 →
              </Link>
            </div>
          </div>

          {/* 90일 내 일몰 도래 */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-2xl p-6 text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">90일 내 일몰 도래</p>
                <p className="text-5xl font-bold mt-2">{data.kpis.upcomingSunsetsCount}</p>
                <p className="text-orange-100 text-xs mt-2">사업 종료 예정</p>
              </div>
              <div className="p-4 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <span className="text-5xl">⏰</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-orange-400">
              <Link href="/projects" className="text-sm font-semibold hover:underline flex items-center gap-2">
                사업 목록 →
              </Link>
            </div>
          </div>

          {/* 심사 대기 중 */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-2xl p-6 text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">심사 대기 중</p>
                <p className="text-5xl font-bold mt-2">{data.kpis.pendingReviewsCount}</p>
                <p className="text-blue-100 text-xs mt-2">일몰 심사 필요</p>
              </div>
              <div className="p-4 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <span className="text-5xl">📋</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-400">
              <p className="text-sm font-semibold">감사관 결재 필요</p>
            </div>
          </div>
        </div>

        {/* Statistics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Anomaly Statistics */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-100 rounded-xl">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">이상 징후 통계</h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">전체</span>
                <span className="text-lg font-bold text-gray-900">{data.anomalyStats.total}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                <span className="text-sm font-medium text-red-700">🔴 신규</span>
                <span className="text-lg font-bold text-red-600">{data.anomalyStats.new}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-100">
                <span className="text-sm font-medium text-orange-700">🟠 조사 중</span>
                <span className="text-lg font-bold text-orange-600">{data.anomalyStats.investigating}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-100">
                <span className="text-sm font-medium text-purple-700">🟣 집행 중지</span>
                <span className="text-lg font-bold text-purple-600">{data.anomalyStats.halted}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-500">⚪ 기각</span>
                <span className="text-lg font-bold text-gray-400">{data.anomalyStats.dismissed}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-bold text-gray-700 mb-4">유형별 분포</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">쪼개기 계약</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{data.anomalyStats.byType.SplitContract}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">부적절 자산</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{data.anomalyStats.byType.IllegalAsset}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">관성적 지출</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{data.anomalyStats.byType.ZombieSpending}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Project Statistics */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-100 rounded-xl">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">사업 현황</h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">전체 사업</span>
                <span className="text-lg font-bold text-gray-900">{data.projectStats.total}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                <span className="text-sm font-medium text-green-700">🟢 진행 중</span>
                <span className="text-lg font-bold text-green-600">{data.projectStats.active}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-100">
                <span className="text-sm font-medium text-orange-700">🟠 심사 중</span>
                <span className="text-lg font-bold text-orange-600">{data.projectStats.underReview}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-500">⚪ 종료</span>
                <span className="text-lg font-bold text-gray-400">{data.projectStats.terminated}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-100">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">정책 일몰제</h4>
                    <p className="text-xs text-gray-600">모든 신규 사업은 3년 후 자동 일몰됩니다. 연장을 위해서는 성과 입증이 필요합니다.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Anomalies */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">🚨 신규 이상 징후 (위험도 순)</h2>
              <Link
                href="/anomalies"
                className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                전체 보기 →
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    위험도
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    유형
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    사업 ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    AI 분석
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    탐지 시간
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.recentAnomalies.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-lg font-medium">탐지된 이상 징후가 없습니다</p>
                        <p className="text-sm mt-1">AI 감사는 매일 자정에 자동 실행됩니다</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.recentAnomalies.slice(0, 5).map((anomaly) => (
                    <tr key={anomaly.AnomalyID} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold border ${getRiskColor(anomaly.RiskScore)}`}>
                          {anomaly.RiskScore}/10
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getAnomalyTypeIcon(anomaly.AnomalyType)}
                          <span className="text-sm font-medium text-gray-900">{getAnomalyTypeLabel(anomaly.AnomalyType)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-blue-600">{anomaly.ProjectID_Ref}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700 max-w-md line-clamp-2">{anomaly.AI_Reasoning}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(anomaly.Timestamp).toLocaleString('ko-KR', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          anomaly.Status === 'New' ? 'bg-red-100 text-red-800' :
                          anomaly.Status === 'Investigating' ? 'bg-orange-100 text-orange-800' :
                          anomaly.Status === 'Halted' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {anomaly.Status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/anomalies/${anomaly.AnomalyID}`}
                          className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          상세보기 →
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Sunsets */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">⏰ 90일 내 일몰 도래 사업</h2>
              <Link
                href="/projects"
                className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                전체 보기 →
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    사업명
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    부서
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    예산
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    일몰 예정일
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.upcomingSunsets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-lg font-medium">일몰 도래 사업이 없습니다</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.upcomingSunsets.map((project) => {
                    const daysUntilSunset = Math.ceil(
                      (new Date(project.SunsetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                    );
                    return (
                      <tr key={project.ProjectID} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-orange-100 rounded-lg">
                              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">{project.ProjectName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {project.Department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {project.TotalBudget.toLocaleString()}원
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-orange-600">
                              {new Date(project.SunsetDate).toLocaleDateString('ko-KR')}
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                              {daysUntilSunset}일 남음
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            href={`/projects/${project.ProjectID}`}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            상세보기 →
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
