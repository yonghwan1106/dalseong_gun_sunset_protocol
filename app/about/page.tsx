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
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-3 shadow-lg">
                <span>🏆</span>
                <span>달성군 정책 제안 공모전 출품작</span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                선셋 프로토콜
              </h1>
              <p className="mt-2 text-sm text-gray-600 font-medium">
                정책 일몰제 도입 및 AI 감사 시스템 연계를 통한 예산 낭비 근절
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
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-12 text-white mb-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48"></div>
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-sm px-6 py-3 rounded-full text-base font-bold mb-6 shadow-lg border border-white/50">
              <span className="text-2xl">🏆</span>
              <span>2025 달성군 정책제안 공모전 출품작</span>
            </div>
            <h2 className="text-6xl font-extrabold mb-6 drop-shadow-lg">선셋 프로토콜</h2>
            <p className="text-xl font-medium text-indigo-100 mb-2">
              Sunset Protocol
            </p>
            <p className="text-2xl font-semibold text-white/90 mb-4">
              정책 일몰제 도입 및 AI 감사 시스템 연계를 통한
            </p>
            <p className="text-4xl font-extrabold drop-shadow-lg">
              선제적 예산 낭비 근절 방안
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/30">
                <p className="text-sm text-indigo-100">제안 부서</p>
                <p className="text-lg font-bold">혁신행정팀</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/30">
                <p className="text-sm text-indigo-100">제안 연도</p>
                <p className="text-lg font-bold">2025년</p>
              </div>
            </div>
          </div>
        </div>

        {/* 제안 배경 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <span className="text-5xl">📋</span>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">제안 배경</h3>
            </div>
          </div>

          {/* 현황 */}
          <div className="mb-8 bg-blue-50 rounded-xl p-6 border-l-4 border-blue-600">
            <h4 className="text-xl font-bold text-blue-900 mb-3">✅ 달성군의 선도적 역량</h4>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span><strong className="text-blue-900">주민참여예산제</strong> 21억 원 규모 내실 운영</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span><strong className="text-blue-900">행정안전부 공공빅데이터 표준분석모델</strong> 3개 과제 전국 유일 동시 선정 (국비 6억 원 확보)</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>SMS 고지서 도입으로 <strong className="text-blue-900">연 1.2억 원 예산 절감</strong></span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span><strong className="text-blue-900">전국 최고 수준의 데이터 기반 행정 역량</strong> 보유</span>
              </p>
            </div>
          </div>

          {/* 문제점 */}
          <div className="bg-red-50 rounded-xl p-6 border-l-4 border-red-600">
            <h4 className="text-xl font-bold text-red-900 mb-3">⚠️ 반복되는 예산 낭비 사례</h4>
            <div className="space-y-3 text-gray-700">
              <div className="bg-white rounded-lg p-4">
                <p className="font-bold text-red-800 mb-1">1. 쪼개기 수의계약</p>
                <p className="text-sm">군정 홍보지 발행 사업에서 규정 위반 → 감사원 지적 및 예산 낭비</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-bold text-red-800 mb-1">2. 부적절한 예산 편성</p>
                <p className="text-sm">불법 가설건축물 냉난방 시설 교체 예산 편성 시도 → 군의회 논란</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-bold text-red-800 mb-1">3. 사후약방문식 감사의 한계</p>
                <p className="text-sm">사건 발생 후 감사 → 이미 낭비된 예산 회수 어려움</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-bold text-red-800 mb-1">4. 좀비 사업 (관성적 사업 유지)</p>
                <p className="text-sm">성과 미흡에도 불구하고 관성적으로 지속 → 신규 혁신 사업 재원 잠식</p>
              </div>
            </div>
          </div>
        </div>

        {/* 제안 내용: 3단계 선셋 프로토콜 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-5xl">🎯</span>
            <h3 className="text-2xl font-bold text-gray-900">선셋 프로토콜 3단계 추진 계획</h3>
          </div>

          {/* 1단계 */}
          <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-l-4 border-green-600">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-green-700">1단계</span>
              <h4 className="text-xl font-bold text-green-900">달성군 정책 일몰 조례 제정 (입법적 통제)</h4>
            </div>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-start gap-2">
                <span className="text-green-600 font-bold">📌</span>
                <span><strong>대상:</strong> 모든 신규 정책 사업, 연구 용역, 시범 사업</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-600 font-bold">📌</span>
                <span><strong>내용:</strong> 사업 추진 시 <strong className="text-green-900">2~3년 선셋 조항(일몰 기한)</strong> 의무 포함</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-600 font-bold">📌</span>
                <span><strong>효과:</strong> 기한 만료 시 자동 폐기 원칙, 연장 위해서는 <strong className="text-green-900">성과 입증 재심사 필수</strong></span>
              </p>
            </div>
          </div>

          {/* 2단계 */}
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-l-4 border-blue-600">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-blue-700">2단계</span>
              <h4 className="text-xl font-bold text-blue-900">AI 기반 예산 이상 징후 탐지 시스템 (기술적 통제)</h4>
            </div>
            <div className="space-y-3 text-gray-700">
              <p className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">🤖</span>
                <span><strong>기반:</strong> 공공빅데이터 표준분석모델 역량 + 재무회계 시스템(e-호조) 연동</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">🤖</span>
                <span><strong>기능:</strong> AI가 모든 지출 결의·계약 데이터 실시간 모니터링 및 정상 패턴 학습</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">🤖</span>
                <span><strong>작동:</strong> 비정상 패턴 탐지 시 즉시 경보(Red Flag) 발송 → <strong className="text-blue-900">집행 선제적 보류</strong></span>
              </p>

              <div className="mt-4 bg-white rounded-lg p-4 border border-blue-200">
                <p className="font-bold text-blue-900 mb-2">📍 탐지 예시 1: 쪼개기 계약 방지</p>
                <p className="text-sm mb-1"><strong>AI 탐지:</strong> "A업체, 30일 이내, 5회 이상, 수의계약 한도(2천만원) 근접(1,900만원) 지출"</p>
                <p className="text-sm text-red-700"><strong>→ 조치:</strong> 쪼개기 계약 의심 경보 + 감사관 확인 전 지출 보류</p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <p className="font-bold text-blue-900 mb-2">📍 탐지 예시 2: 불법 예산 방지</p>
                <p className="text-sm mb-1"><strong>AI 탐지:</strong> "건축물 관리대장 '불법' 키워드" + "시설 보수(냉난방) 예산" 교차 지출</p>
                <p className="text-sm text-red-700"><strong>→ 조치:</strong> 부적절 예산 집행 의심 경보 발송</p>
              </div>
            </div>
          </div>

          {/* 3단계 */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-l-4 border-purple-600">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-purple-700">3단계</span>
              <h4 className="text-xl font-bold text-purple-900">선셋 프로토콜 + AI 감사 시스템 연동</h4>
            </div>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">⚡</span>
                <span>두 시스템 연동으로 <strong className="text-purple-900">시너지 극대화</strong></span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">⚡</span>
                <span>AI가 '성과 미달' 또는 '이상 징후' 빈번 발생 사업 → <strong className="text-purple-900">일몰 전 조기 종료 검토 자동 상정</strong></span>
              </p>
            </div>
          </div>
        </div>

        {/* 기대 효과 */}
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl shadow-xl p-8 border border-yellow-200 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-5xl">🎯</span>
            <h3 className="text-2xl font-bold text-gray-900">기대 효과</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 bg-white rounded-lg p-4">
              <span className="text-3xl">💰</span>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">예산 낭비 선제적 근절</h4>
                <p className="text-sm text-gray-700">사후약방문이 아닌 AI를 통한 실시간 선제적 차단</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white rounded-lg p-4">
              <span className="text-3xl">🚀</span>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">좀비 사업 퇴출</h4>
                <p className="text-sm text-gray-700">선셋 조항을 통한 시스템적 자동 구조조정</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white rounded-lg p-4">
              <span className="text-3xl">♻️</span>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">혁신 사업 재투자</h4>
                <p className="text-sm text-gray-700">절감 재원을 군민 체감형 혁신 사업에 재투자</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white rounded-lg p-4">
              <span className="text-3xl">🔍</span>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">군민 신뢰 회복</h4>
                <p className="text-sm text-gray-700">AI 24시간 감시로 투명성·공정성 획기적 향상</p>
              </div>
            </div>
          </div>
        </div>

        {/* 실행 로드맵 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">🗓️</span>
            <h3 className="text-2xl font-bold text-gray-900">실행 로드맵</h3>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-32 bg-green-100 rounded-lg p-3 text-center">
                <p className="text-sm font-bold text-green-800">1단계</p>
                <p className="text-xs text-green-700 mt-1">~6개월</p>
              </div>
              <div className="flex-1 bg-green-50 rounded-lg p-4 border-l-4 border-green-600">
                <p className="font-bold text-green-900 mb-2">기반 구축</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 달성군 정책 일몰 조례 제정 및 공포</li>
                  <li>• AI 감사 시스템 설계 TF 구성</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-32 bg-blue-100 rounded-lg p-3 text-center">
                <p className="text-sm font-bold text-blue-800">2단계</p>
                <p className="text-xs text-blue-700 mt-1">~12개월</p>
              </div>
              <div className="flex-1 bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
                <p className="font-bold text-blue-900 mb-2">시스템 개발 및 학습</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• AI 이상 징후 탐지 모델 개발 및 재무 시스템 연동</li>
                  <li>• 과거 5년간 낭비 사례 데이터로 부정 샘플 학습</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-32 bg-purple-100 rounded-lg p-3 text-center">
                <p className="text-sm font-bold text-purple-800">3단계</p>
                <p className="text-xs text-purple-700 mt-1">지속</p>
              </div>
              <div className="flex-1 bg-purple-50 rounded-lg p-4 border-l-4 border-purple-600">
                <p className="font-bold text-purple-900 mb-2">시행 및 확산</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• AI 감사 시스템 정식 운영 및 전 부서 확대</li>
                  <li>• 일몰 조항 최초 도래 사업(D+2년) 정기 심사 개시</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-2xl shadow-xl p-8 text-center border border-indigo-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">시스템 데모 체험하기</h3>
          <p className="text-gray-700 mb-6">
            실제 구현된 AI 감사 시스템과 정책 일몰제 관리 시스템을 직접 체험해보세요
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all font-bold text-lg"
          >
            <span>🏠</span>
            <span>시스템 대시보드 바로가기</span>
            <span>→</span>
          </Link>
          <div className="mt-8 pt-6 border-t border-indigo-200">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md">
              <span className="text-2xl">🏆</span>
              <p className="text-sm font-bold text-gray-800">
                2025 달성군 정책제안 공모전 출품작
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
