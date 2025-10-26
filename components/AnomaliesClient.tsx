'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Anomaly } from '@/types';

export default function AnomaliesClient() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchAnomalies();
  }, [filter]);

  const fetchAnomalies = async () => {
    try {
      const url = filter === 'all' ? '/api/anomalies' : `/api/anomalies?status=${filter}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch anomalies');
      const data = await response.json();
      setAnomalies(data.anomalies || []);
    } catch (error) {
      console.error('Error fetching anomalies:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      New: '신규',
      Investigating: '조사 중',
      Halted: '집행 중지',
      Dismissed: '기각',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    if (status === 'New') return 'bg-red-100 text-red-800';
    if (status === 'Investigating') return 'bg-orange-100 text-orange-800';
    if (status === 'Halted') return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                이상 징후 관리
              </h1>
              <p className="mt-2 text-sm text-gray-600 font-medium">
                🤖 AI가 탐지한 예산 낭비 의심 사례
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
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">필터</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setFilter('New')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === 'New'
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🔴 신규
            </button>
            <button
              onClick={() => setFilter('Investigating')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === 'Investigating'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🟠 조사 중
            </button>
            <button
              onClick={() => setFilter('Halted')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === 'Halted'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🟣 집행 중지
            </button>
            <button
              onClick={() => setFilter('Dismissed')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === 'Dismissed'
                  ? 'bg-gray-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⚪ 기각
            </button>
          </div>
        </div>

        {/* Anomalies List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-red-500 to-orange-500 text-white">
            <h2 className="text-2xl font-bold">⚠️ 탐지된 이상 징후 ({anomalies.length}건)</h2>
          </div>

          {anomalies.length === 0 ? (
            <div className="p-12 text-center">
              <div className="flex flex-col items-center justify-center text-gray-400">
                <span className="text-6xl mb-4">✓</span>
                <p className="text-lg font-medium">해당 조건의 이상 징후가 없습니다</p>
                <p className="text-sm mt-1">AI 감사는 매일 자정에 자동 실행됩니다</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {anomalies.map((anomaly) => (
                <div
                  key={anomaly.AnomalyID}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold border ${getRiskColor(anomaly.RiskScore)}`}>
                          위험도 {anomaly.RiskScore}/10
                        </div>
                        <div className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                          {getAnomalyTypeLabel(anomaly.AnomalyType)}
                        </div>
                        <div className={`px-3 py-1.5 rounded-full text-sm font-bold ${getStatusColor(anomaly.Status)}`}>
                          {getStatusLabel(anomaly.Status)}
                        </div>
                      </div>

                      <div className="mb-2">
                        <span className="text-sm font-semibold text-gray-500">사업 ID:</span>
                        <span className="ml-2 text-lg font-bold text-blue-600">{anomaly.ProjectID_Ref}</span>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 mb-3">
                        <p className="text-sm font-semibold text-gray-700 mb-2">🤖 AI 분석 결과:</p>
                        <p className="text-sm text-gray-900">{anomaly.AI_Reasoning}</p>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div>
                          <span className="font-semibold">탐지 시간:</span>{' '}
                          {new Date(anomaly.Timestamp).toLocaleString('ko-KR')}
                        </div>
                        <div>
                          <span className="font-semibold">이상 징후 ID:</span> {anomaly.AnomalyID}
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/anomalies/${anomaly.AnomalyID}`}
                      className="ml-6 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all font-semibold whitespace-nowrap"
                    >
                      상세보기 →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
