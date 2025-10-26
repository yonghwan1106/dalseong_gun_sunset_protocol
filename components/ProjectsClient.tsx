'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Project } from '@/types';

export default function ProjectsClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntilSunset = (sunsetDate: string) => {
    return Math.ceil((new Date(sunsetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  };

  const getSunsetColor = (days: number) => {
    if (days < 0) return 'text-gray-500'; // 이미 만료됨
    if (days <= 30) return 'text-red-600';
    if (days <= 90) return 'text-orange-600';
    return 'text-green-600';
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
                정책 사업 관리
              </h1>
              <p className="mt-2 text-sm text-gray-600 font-medium">
                🗂️ 일몰제 적용 사업 목록 및 관리
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
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="group relative bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-3xl shadow-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <span className="text-4xl">📊</span>
                </div>
                <div className="text-right">
                  <p className="text-green-100 text-xs font-semibold uppercase tracking-wide">Total</p>
                </div>
              </div>
              <div>
                <p className="text-green-50 text-sm font-medium mb-1">전체 사업</p>
                <p className="text-6xl font-extrabold mb-2">{projects.length}</p>
                <p className="text-green-100 text-sm font-medium">진행 중</p>
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-3xl shadow-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <span className="text-4xl">⏰</span>
                </div>
                <div className="text-right">
                  <p className="text-orange-100 text-xs font-semibold uppercase tracking-wide">Urgent</p>
                </div>
              </div>
              <div>
                <p className="text-orange-50 text-sm font-medium mb-1">90일 내 일몰</p>
                <p className="text-6xl font-extrabold mb-2">
                  {projects.filter((p) => getDaysUntilSunset(p.SunsetDate) <= 90 && getDaysUntilSunset(p.SunsetDate) > 0).length}
                </p>
                <p className="text-orange-100 text-sm font-medium">검토 필요</p>
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-3xl shadow-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <span className="text-4xl">💰</span>
                </div>
                <div className="text-right">
                  <p className="text-blue-100 text-xs font-semibold uppercase tracking-wide">Budget</p>
                </div>
              </div>
              <div>
                <p className="text-blue-50 text-sm font-medium mb-1">총 예산</p>
                <p className="text-5xl font-extrabold mb-2">
                  {(projects.reduce((sum, p) => sum + p.TotalBudget, 0) / 100000000).toFixed(0)}
                </p>
                <p className="text-blue-100 text-sm font-medium">억원</p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <span className="text-2xl">🗂️</span>
              </div>
              <h2 className="text-2xl font-bold">진행 중인 사업 목록</h2>
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="p-12 text-center">
              <div className="flex flex-col items-center justify-center text-gray-400">
                <span className="text-6xl mb-4">📋</span>
                <p className="text-lg font-medium">등록된 사업이 없습니다</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      사업 ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      사업명
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      부서
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      총 예산
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      시작일
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      일몰 예정일
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      상태
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projects
                    .sort((a, b) => getDaysUntilSunset(a.SunsetDate) - getDaysUntilSunset(b.SunsetDate))
                    .map((project) => {
                      const daysLeft = getDaysUntilSunset(project.SunsetDate);
                      return (
                        <tr key={project.ProjectID} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-bold text-blue-600">{project.ProjectID}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">📁</span>
                              <span className="text-sm font-semibold text-gray-900">{project.ProjectName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {project.Department}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {(project.TotalBudget / 10000).toLocaleString()}만원
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(project.StartDate).toLocaleDateString('ko-KR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className={`text-sm font-semibold ${getSunsetColor(daysLeft)}`}>
                                {new Date(project.SunsetDate).toLocaleDateString('ko-KR')}
                              </span>
                              <span className={`text-xs mt-1 ${getSunsetColor(daysLeft)}`}>
                                {daysLeft < 0 ? '만료됨' : `${daysLeft}일 남음`}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                              project.Status === 'Active'
                                ? 'bg-green-100 text-green-800'
                                : project.Status === 'UnderReview'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {project.Status === 'Active' ? '🟢 진행 중' : project.Status === 'UnderReview' ? '🟠 심사 중' : '⚪ 종료'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl shadow-xl p-8 border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <span className="text-4xl">💡</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">정책 일몰제란?</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span>모든 신규 정책 사업은 시작일로부터 <strong className="text-blue-900">3년 후 자동으로 일몰</strong>됩니다.</span>
                </p>
                <p className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span>사업 연장을 원할 경우, 일몰 예정일 <strong className="text-blue-900">90일 전</strong>까지 성과 보고서를 제출하여 감사관의 승인을 받아야 합니다.</span>
                </p>
                <p className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span>AI 감사 시스템이 24시간 예산 집행을 모니터링하여 <strong className="text-blue-900">선제적으로 낭비를 차단</strong>합니다.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
