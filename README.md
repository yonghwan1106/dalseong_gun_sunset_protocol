# 달성군 선셋 프로토콜 (Dalseong-gun Sunset Protocol)

**AI 기반 예산 낭비 선제적 차단 및 정책 자동 일몰 관리 시스템**

---

## 📋 프로젝트 개요

달성군 선셋 프로토콜은 AI(Claude Sonnet 4.0)를 활용하여 예산 낭비를 **사후 적발이 아닌 선제적으로 차단**하고, **정책 일몰제**를 시스템화하여 행정 효율성과 투명성을 극대화하는 웹 기반 대시보드입니다.

### 핵심 목표

- ✅ **P0 (핵심):** 예산 집행 과정에서의 비정상 지출을 선제적으로 탐지하여 예산 낭비를 원천 차단
- ✅ **P1:** 정책 일몰제를 시스템화하여 성과가 미흡한 사업을 자동으로 종료
- ✅ **P2:** 데이터 기반의 의사결정 근거를 제공하여 행정의 투명성과 신뢰도 제고

---

## 🎯 주요 기능

### F1: 감사관 대시보드 (Auditor Dashboard)

- 📊 실시간 KPI 모니터링
- 📈 이상 징후 통계 (유형별, 상태별)
- 📉 사업 현황 통계
- 🗺️ 위험 지역 시각화 (Naver Map)

### F2: AI 이상 징후 탐지 (The "Protocol")

**매일 자정 자동 실행 (Vercel Cron Job)**

AI가 탐지하는 3가지 유형:

1. **쪼개기 수의계약 (Split Contract)** - 동일 업체에 30일 이내, 수의계약 한도 미만으로 3회 이상 분할 지출
2. **부적절 자산 지출 (Illegal Asset)** - 사업 목록에 없는 ProjectID로 지출
3. **관성적 지출 (Zombie Spending)** - 일몰 3개월 전임에도 대규모 장비 구매

### F3: 이상 징후 워크플로우 관리

- AI 분석 결과 상세 조회
- 관련 거래 내역 및 사업 정보 표시
- 상태 관리: 조사 중 / 기각 / 집행 중지

### F4: 정책 일몰 관리

- 신규 사업 등록 시 자동 일몰 기한 설정 (시작일 + 3년)
- 성과 보고서 제출 및 심사 워크플로우
- AI 이상 징후 이력과 연동한 연장/종료 결정

---

## 🛠️ 기술 스택

| 구분 | 기술 | 사유 |
|------|------|------|
| **프레임워크** | Next.js 16 (App Router) | SSR/ISR을 통한 빠른 대시보드, API Routes 백엔드 |
| **배포** | Vercel | GitHub 자동 CI/CD, Cron Jobs 지원 |
| **데이터베이스** | Google Sheets | 사용자 요구사항 (e-호조 CSV export 연동) |
| **AI** | Claude Sonnet 4.0 | 강력한 자연어 처리 및 이상 징후 탐지 |
| **지도** | Naver Map API | 위치 기반 예산 낭비 시각화 |
| **인증** | NextAuth.js v5 | Google OAuth (@dalseong.go.kr 계정 제한) |
| **스타일링** | Tailwind CSS | 빠른 UI 개발 |

---

## 📦 설치 및 실행

### 1. 사전 요구사항

- Node.js 18 이상
- npm 또는 yarn
- Google Cloud 계정
- Anthropic API Key

### 2. 저장소 클론 및 설치

```bash
git clone https://github.com/your-org/dalseong_gun_sunset_protocol.git
cd dalseong_gun_sunset_protocol
npm install
```

### 3. 환경 변수 설정

`.env.local.example` 파일을 복사하여 `.env.local` 생성:

```bash
cp .env.local.example .env.local
```

`.env.local` 파일을 열고 다음 값을 입력:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Google Sheets API
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account-email
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id

# Claude API
ANTHROPIC_API_KEY=your-anthropic-api-key

# Naver Map API (Optional)
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=your-naver-map-client-id

# Allowed Email Domain
ALLOWED_EMAIL_DOMAIN=dalseong.go.kr
```

**상세 설정 가이드:**
- [Google Sheets 설정](docs/google-sheets-setup.md) ⭐ **필독!**

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 5. 프로덕션 빌드

```bash
npm run build
npm start
```

---

## 🚀 배포 (Vercel)

### 1. GitHub 연동

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-org/dalseong_gun_sunset_protocol.git
git push -u origin main
```

### 2. Vercel에 배포

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. "New Project" 클릭
3. GitHub 저장소 선택
4. 환경 변수 입력 (`.env.local`의 모든 값)
5. "Deploy" 클릭

### 3. Cron Job 자동 설정

`vercel.json` 파일이 이미 포함되어 있어 자동으로 설정됩니다:

```json
{
  "crons": [
    {
      "path": "/api/run-audit",
      "schedule": "0 0 * * *"
    }
  ]
}
```

- 매일 자정(00:00 UTC)에 AI 감사 자동 실행

---

## 📚 문서

- [PRD (Product Requirements Document)](docs/prd.md)
- [정책 제안서](docs/proposal.md)
- [Google Sheets 설정 가이드](docs/google-sheets-setup.md) ⭐

---

## 🔧 프로젝트 구조

```
dalseong_gun_sunset_protocol/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # NextAuth.js 인증
│   │   ├── run-audit/            # AI 감사 Cron Job
│   │   ├── dashboard/            # 대시보드 데이터
│   │   ├── anomalies/            # 이상 징후 관리
│   │   └── projects/             # 사업 관리
│   ├── auth/signin/              # 로그인 페이지
│   ├── dashboard/                # 감사관 대시보드
│   └── page.tsx                  # 홈 (리다이렉트)
├── components/                   # React 컴포넌트
│   └── DashboardClient.tsx       # 대시보드 UI
├── lib/                          # 라이브러리
│   ├── googleSheets.ts           # Google Sheets API
│   └── claudeAI.ts               # Claude API
├── types/                        # TypeScript 타입
│   └── index.ts
├── docs/                         # 문서
│   ├── prd.md
│   ├── proposal.md
│   └── google-sheets-setup.md
├── auth.config.ts                # NextAuth 설정
├── auth.ts                       # NextAuth 핸들러
├── vercel.json                   # Vercel Cron 설정
├── .env.local.example            # 환경 변수 예제
└── README.md                     # 이 파일
```

---

## 🧪 테스트

### AI 감사 테스트 (로컬)

```bash
curl -X POST http://localhost:3000/api/run-audit
```

### Google Sheets 연동 테스트

1. Google Sheets에 샘플 데이터 입력 (docs/google-sheets-setup.md 참조)
2. 대시보드 접속하여 데이터 표시 확인

---

## 🔐 보안

- **인증:** @dalseong.go.kr 이메일만 로그인 허용
- **API 보호:** NextAuth.js 세션 검증
- **Cron Job:** `CRON_SECRET` 환경 변수로 보호
- **환경 변수:** `.env.local`은 Git에 커밋되지 않음

---

## 🤝 기여

이 프로젝트는 **2025년 달성군 정책 제안 공모전** 출품작입니다.

### 개발자

- **작성자:** 박용환
- **이메일:** sanoramyun8@gmail.com
- **전화:** 010-7939-3123

---

## 📞 지원

문제가 발생하거나 질문이 있으신 경우:

- **이메일:** sanoramyun8@gmail.com

---

## 🎉 주요 성과 지표 (예상)

- **예산 낭비 차단액:** 연간 수억 원 이상
- **AI 탐지 정확도:** False Positive 20% 미만 목표
- **좀비 사업 종료:** 연간 10건 이상 목표
- **행정 효율성:** 감사 업무 시간 50% 단축

---

**🚀 달성군의 투명하고 효율적인 예산 집행을 위한 첫걸음!**

---

**최종 수정일:** 2025-10-26
**버전:** 1.0.0
