import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AboutPage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                프로젝트 소개
              </h1>
              <p className="mt-2 text-sm text-gray-600 font-medium">
                달성군 선셋 프로토콜 시스템 개요
              </p>
            </div>
            <Link
              href="/dashboard"
              className="px-5 py-2.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 shadow-lg hover:shadow-xl transition-all font-semibold"
            >
              ← 대시보드
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-12 text-white mb-8">
          <div className="text-center">
            <h2 className="text-5xl font-bold mb-4">달성군 선셋 프로토콜</h2>
            <p className="text-2xl font-semibold mb-2">Dalseong-gun Sunset Protocol</p>
            <p className="text-xl text-indigo-100 mt-6">
              AI 기반 예산 낭비 선제적 차단 시스템
            </p>
          </div>
        </div>

        {/* Problem Statement */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <span className="text-5xl">🚨</span>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">해결하고자 하는 문제</h3>
              <div className="space-y-3 text-gray-700">
                <p className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>쪼개기 계약:</strong> 수의계약 한도(2천만원)를 회피하기 위한 의도적 계약 분할</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>관성적 지출 (좀비 스펜딩):</strong> 효과 검증 없이 지속되는 예산 집행</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span><strong>불법 자산 예산 집행:</strong> 가설건축물 등 불법 자산에 대한 예산 낭비</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Feature 1 */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-xl p-8 border border-red-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🤖</span>
              <h3 className="text-2xl font-bold text-gray-900">AI 이상 징후 탐지</h3>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span><strong>Claude Sonnet 4.0</strong> 기반 실시간 분석</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span>매일 자정 <strong>자동 감사</strong> 실행</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span><strong>위험도 점수</strong> (1-10) 자동 산출</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span>의심 거래 <strong>근거 상세 설명</strong></span>
              </li>
            </ul>
          </div>

          {/* Feature 2 */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-xl p-8 border border-green-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">⏰</span>
              <h3 className="text-2xl font-bold text-gray-900">정책 자동 일몰제</h3>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span>신규 사업 <strong>3년 후 자동 일몰</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span><strong>90일 전</strong> 자동 알림 발송</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span>연장 시 <strong>성과 입증</strong> 필수</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">✓</span>
                <span>감사관 <strong>심사 워크플로우</strong></span>
              </li>
            </ul>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">⚙️</span>
            <h3 className="text-2xl font-bold text-gray-900">기술 스택</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-bold text-gray-900 mb-3">Frontend</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Next.js 16 (App Router)</li>
                <li>• React 19</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-bold text-gray-900 mb-3">Backend & AI</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Anthropic Claude Sonnet 4.0</li>
                <li>• Google Sheets API</li>
                <li>• NextAuth.js v5</li>
                <li>• Vercel Cron Jobs</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-bold text-gray-900 mb-3">Infrastructure</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Vercel (Hosting)</li>
                <li>• Google Cloud (OAuth)</li>
                <li>• Google Sheets (Database)</li>
                <li>• Naver Maps API</li>
              </ul>
            </div>
          </div>
        </div>

        {/* System Architecture */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">🏗️</span>
            <h3 className="text-2xl font-bold text-gray-900">시스템 아키텍처</h3>
          </div>
          <div className="space-y-4 text-gray-700">
            <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
              <h4 className="font-bold text-blue-900 mb-2">1. 데이터 수집</h4>
              <p className="text-sm">Google Sheets에 거래 내역 입력 → API를 통해 실시간 동기화</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-600">
              <h4 className="font-bold text-purple-900 mb-2">2. AI 분석</h4>
              <p className="text-sm">매일 자정 Vercel Cron Job 실행 → Claude AI가 미처리 거래 분석 → 이상 징후 자동 탐지</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-600">
              <h4 className="font-bold text-green-900 mb-2">3. 알림 & 조치</h4>
              <p className="text-sm">위험도 높은 건 Google Chat 알림 → 담당자 검토 → 필요시 집행 중지</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-600">
              <h4 className="font-bold text-orange-900 mb-2">4. 일몰 관리</h4>
              <p className="text-sm">90일 전 자동 알림 → 성과 보고서 제출 → 감사관 심사 → 연장/종료 결정</p>
            </div>
          </div>
        </div>

        {/* Expected Impact */}
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl shadow-xl p-8 border border-yellow-200">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">🎯</span>
            <h3 className="text-2xl font-bold text-gray-900">기대 효과</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💰</span>
              <div>
                <h4 className="font-bold text-gray-900">예산 절감</h4>
                <p className="text-sm text-gray-700">쪼개기 계약 등 부정 지출 사전 차단</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <h4 className="font-bold text-gray-900">효율성 증대</h4>
                <p className="text-sm text-gray-700">자동화로 인한 업무 시간 단축</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔍</span>
              <div>
                <h4 className="font-bold text-gray-900">투명성 강화</h4>
                <p className="text-sm text-gray-700">모든 의심 거래 AI 분석 근거 공개</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <h4 className="font-bold text-gray-900">데이터 기반 의사결정</h4>
                <p className="text-sm text-gray-700">정책 성과 데이터 축적 및 분석</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-2xl hover:shadow-3xl transition-all font-bold text-lg"
          >
            대시보드로 이동 →
          </Link>
        </div>
      </main>
    </div>
  );
}
