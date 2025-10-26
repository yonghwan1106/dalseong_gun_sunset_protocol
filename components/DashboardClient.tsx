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

export default function DashboardClient() {
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold">오류 발생</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const getRiskColor = (score: number) => {
    if (score >= 8) return 'text-red-600 bg-red-50';
    if (score >= 5) return 'text-orange-600 bg-orange-50';
    return 'text-yellow-600 bg-yellow-50';
  };

  const getAnomalyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      SplitContract: '쪼개기 계약',
      IllegalAsset: '부적절 자산',
      ZombieSpending: '관성적 지출',
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                달성군 선셋 프로토콜
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                AI 기반 예산 낭비 선제적 차단 시스템
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/anomalies"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                이상 징후 관리
              </Link>
              <Link
                href="/projects"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                정책 관리
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">신규 이상 징후</p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {data.kpis.newAnomaliesCount}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">90일 내 일몰 도래</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  {data.kpis.upcomingSunsetsCount}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">심사 대기 중</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {data.kpis.pendingReviewsCount}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Anomaly Statistics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              이상 징후 통계
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">전체</span>
                <span className="text-sm font-semibold">{data.anomalyStats.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">신규</span>
                <span className="text-sm font-semibold text-red-600">{data.anomalyStats.new}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">조사 중</span>
                <span className="text-sm font-semibold text-orange-600">{data.anomalyStats.investigating}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">집행 중지</span>
                <span className="text-sm font-semibold text-purple-600">{data.anomalyStats.halted}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">기각</span>
                <span className="text-sm font-semibold text-gray-400">{data.anomalyStats.dismissed}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">유형별</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">쪼개기 계약</span>
                  <span className="text-sm font-semibold">{data.anomalyStats.byType.SplitContract}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">부적절 자산</span>
                  <span className="text-sm font-semibold">{data.anomalyStats.byType.IllegalAsset}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">관성적 지출</span>
                  <span className="text-sm font-semibold">{data.anomalyStats.byType.ZombieSpending}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Project Statistics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              사업 현황
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">전체 사업</span>
                <span className="text-sm font-semibold">{data.projectStats.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">진행 중</span>
                <span className="text-sm font-semibold text-green-600">{data.projectStats.active}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">심사 중</span>
                <span className="text-sm font-semibold text-orange-600">{data.projectStats.underReview}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">종료</span>
                <span className="text-sm font-semibold text-gray-400">{data.projectStats.terminated}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Anomalies */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              신규 이상 징후 (위험도 순)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    위험도
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    유형
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    사업 ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    AI 분석
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    탐지 시간
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.recentAnomalies.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      탐지된 이상 징후가 없습니다
                    </td>
                  </tr>
                ) : (
                  data.recentAnomalies.map((anomaly) => (
                    <tr key={anomaly.AnomalyID} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(anomaly.RiskScore)}`}>
                          {anomaly.RiskScore}/10
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {getAnomalyTypeLabel(anomaly.AnomalyType)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {anomaly.ProjectID_Ref}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                        {anomaly.AI_Reasoning}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(anomaly.Timestamp).toLocaleString('ko-KR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          anomaly.Status === 'New' ? 'bg-red-100 text-red-800' :
                          anomaly.Status === 'Investigating' ? 'bg-orange-100 text-orange-800' :
                          anomaly.Status === 'Halted' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {anomaly.Status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/anomalies/${anomaly.AnomalyID}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          상세보기
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
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              90일 내 일몰 도래 사업
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    사업명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    부서
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    예산
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    일몰 예정일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.upcomingSunsets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      일몰 도래 사업이 없습니다
                    </td>
                  </tr>
                ) : (
                  data.upcomingSunsets.map((project) => (
                    <tr key={project.ProjectID} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {project.ProjectName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {project.Department}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {project.TotalBudget.toLocaleString()}원
                      </td>
                      <td className="px-6 py-4 text-sm text-orange-600 font-medium">
                        {new Date(project.SunsetDate).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link
                          href={`/projects/${project.ProjectID}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          상세보기
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
