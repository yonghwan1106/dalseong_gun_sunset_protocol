
<대구 달성군 정책 제안 공모전 출품작>

# PRD: 달성군 선셋 프로토콜 (Dalseong-gun Sunset Protocol)

**부제: AI 기반 예산 낭비 선제적 차단 및 정책 자동 일몰 관리 시스템**

| 항목 | 내용 |
| :--- | :--- |
| **작성일** | 2025년 10월 26일 |
| **작성자** | (Award-Winning Writer) |
| **프로젝트 오너** | 달성군 기획예산과 / 감사관 |
| **핵심 목표** | 예산 낭비 사례 [1, 2]를 사후 적발이 아닌 AI를 통해 '선제적'으로 차단하고, 성과 기반의 '정책 일몰제' [3]를 시스템화하여 행정 효율성과 투명성을 극대화한다. |

## 1\. 개요 (Introduction)

### 1.1. 문제점 (Problem)

달성군은 '쪼개기 수의계약' [1]이나 '불법 가설건축물 예산 편성' [2] 시도 등 반복적인 예산 낭비 [4] 문제가 발생하고 있습니다. 현행 감사 시스템은 대부분 '사후 적발'에 의존하여 이미 집행된 예산을 되돌리기 어렵습니다.[5] 또한, 성과가 미흡함에도 관성적으로 지속되는 '좀비 사업'은 신규 혁신 사업에 투입될 재원을 잠식합니다.

### 1.2. 해결 방안 (Solution)

본 프로젝트는 이러한 문제를 해결하기 위해 두 가지 핵심 기능을 통합한 웹 기반 대시보드를 구축합니다.

1.  **AI 예산 이상 징후 탐지 (Proactive Anomaly Detection):** 달성군의 재무/계약 데이터를 AI(Claude Sonnet 4.0)가 실시간(또는 일배치)으로 분석하여, '쪼개기 계약' [1] 등 비정상 패턴 [6]을 '결재 집행 전'에 선제적으로 탐지하고 감사관에게 경보를 발송합니다.
2.  **정책 자동 일몰 관리 (Policy Sunset Management):** 모든 신규 사업에 '자동 일몰 기한' [3, 7]을 설정하고, AI가 분석한 성과 데이터를 기반으로 정책의 연장/종료를 체계적으로 심의하는 워크플로우를 제공합니다.

## 2\. 목표 (Goals)

  * **P0 (핵심):** 예산 집행 과정에서의 비정상 지출(이상 징후)을 선제적으로 탐지하여 예산 낭비를 원천 차단한다.
  * **P1:** '정책 일몰제' [3]를 시스템화하여 성과가 미흡한 사업을 자동으로 종료시키고, 행정 자원을 효율적으로 재배치한다.
  * **P2:** 감사관 및 예산 담당자에게 데이터 기반의 의사결정 근거를 제공하여 행정의 투명성과 신뢰도를 제고한다.

## 3\. 사용자 페르소나 (Personas)

| 페르소나 | 역할 | 핵심 요구사항 (Needs) |
| :--- | :--- | :--- |
| **김 감사관** | 달성군 감사관 (Primary User) | "결재가 올라오기 전에 위험한 지출을 미리 알고 싶다. AI가 쪼개기 계약 [1] 같은 패턴을 자동으로 찾아주면 좋겠다." |
| **박 주무관** | 기획예산과 예산팀 (Admin) | "신규 사업들을 등록하고 3년 뒤 [3] 자동으로 성과 평가를 받게 만들고 싶다. 어떤 사업이 종료 대상인지 한눈에 보고 싶다." |
| **최 팀장** | 문화관광과 사업 담당자 (Secondary) | "우리 부서 사업이 왜 AI 경고를 받았는지 확인하고 소명 자료를 제출하고 싶다. 일몰 심사 때 성과 보고서를 쉽게 올리고 싶다." |

## 4\. 기술 스택 및 아키텍처 (Tech Stack)

| 구분 | 기술 | 사유 |
| :--- | :--- | :--- |
| **프레임워크** | **Next.js** (App Router) | SSR/ISR을 통한 빠른 대시보드 로딩. API Routes를 활용한 백엔드 로직 처리. |
| **배포** | **Vercel** (+ GitHub 연동) | GitHub Push 시 자동 CI/CD. Cron Jobs 기능을 활용한 일배치 AI 감사 실행. |
| **데이터베이스** | **Google Sheets** | 사용자의 명시적 요구사항. **(제약사항 참고)** |
| **코어 AI** | **Claude Sonnet 4.0 API** | 사용자의 명시적 요구사항. 강력한 자연어 처리 및 JSON 생성 능력으로 '이상 징후 탐지' [6] 프롬프트 수행. |
| **지도** | **Naver Map API** | 사용자의 명시적 요구사항. '불법 건축물' [2] 등 위치 기반 예산 낭비 시각화. |
| **인증 (제안)** | **NextAuth.js** | Google Workspace 프로바이더 연동 (@dalseong.go.kr 이메일 계정으로만 로그인). |
| **데이터 I/O (제안)** | **Google Sheets API** | Next.js 서버(API Routes)가 Google Sheets를 DB처럼 읽고 쓸 수 있게 함. |

**아키텍처 제약사항:**

  * `Google Sheets`는 트랜잭션 DB가 아니므로, 달성군 전체 재무 시스템(e-호조)을 대체할 수 없습니다.
  * 본 시스템은 e-호조에서 **매일 1회 CSV/Excel로 Export 한 데이터를** Google Sheets(`Transactions_Input` 시트)에 **업로드(또는 복사-붙여넣기)하는 수동/반자동 프로세스를 전제**합니다.
  * AI 감사는 실시간이 아닌, Vercel Cron Job을 통해 **매일 밤 1회 실행되는 일배치(Daily Batch) 프로세스**로 구동됩니다.

## 5\. 데이터 모델 (Google Sheets 구조)

시스템은 1개의 Google Sheets 문서 내 5개의 시트(Sheet)로 구성됩니다.

| 시트명 | 용도 | 주요 컬럼 (열) |
| :--- | :--- | :--- |
| **1. Projects** | 정책/사업 마스터 | `ProjectID` (PK), `ProjectName`, `Department`, `TotalBudget`, `StartDate`, `SunsetDate`, `Status` (Active, UnderReview, Terminated) |
| **2. Transactions\_Input** | e-호조 일일 데이터 (Input) | `TransactionID`, `Date`, `ProjectID_Ref` (FK), `VendorName`, `Amount`, `Description`, `Department`, `Status` (Processed) |
| **3. Anomalies\_Output** | AI 탐지 결과 (Output) | `AnomalyID` (PK), `Timestamp`, `ProjectID_Ref`, `Involved_TIDs` (JSON 배열), `RiskScore` (1-10), `AI_Reasoning`, `AnomalyType`, `Status` (New, Investigating, Dismissed) |
| **4. Sunset\_Reviews** | 일몰 심사 관리 | `ReviewID` (PK), `ProjectID_Ref`, `SubmitDate`, `PerformanceReportURL` (Google Drive 링크), `Decision` (Extend, Terminate), `AuditorNotes` |
| **5. Users** | 사용자 계정 관리 | `Email` (@dalseong.go.kr), `Name`, `Role` (Auditor, BudgetOfficer, DeptHead), `Department` |

## 6\. 핵심 기능 (Features)

### F1: 감사관 대시보드 (Auditor Dashboard)

  * **설명:** 감사관(김 감사관)이 로그인 시 보게 될 메인 페이지.
  * **컴포넌트:**
      * **[KPI] 금일 신규 이상 징후:** `Anomalies_Output` 시트에서 'Status=New'인 건수.
      * **[KPI] 90일 내 일몰 도래 사업:** `Projects` 시트에서 'SunsetDate'가 90일 이내인 건수.
      * **[List] 신규 이상 징후 피드:** 'New' 상태의 이상 징후 목록 (RiskScore 높은 순).
      * **[List] 심사 대기 중인 사업:** `Sunset_Reviews` 시트에서 'Decision'이 비어있는 사업 목록.
      * **[Map] 위험 지역 시각화 (Naver Map API):** '불법 건축물' [2] 등 특정 `AnomalyType`과 연관된 예산 요청 위치를 지도에 마커로 표시.

### F2: AI 이상 징후 탐지 (The "Protocol") - (Backend: Vercel Cron Job)

  * **설명:** 매일 자정, Vercel Cron Job이 `POST /api/run-audit` 엔드포인트를 호출하여 AI 감사를 실행.
  * **프로세스:**
    1.  `Transactions_Input` 시트에서 'Status'가 비어있는(미처리된) 모든 트랜잭션 로우(Row)를 읽어옵니다.
    2.  `Projects` 시트의 활성 사업 목록을 읽어옵니다.
    3.  이 데이터를 **Claude Sonnet 4.0 API**로 전송합니다.
    4.  **[핵심] Claude API 프롬프트:**
        ```prompt
        "당신은 대한민국 달성군의 최고 감사관 AI입니다. [6]
        제공된 2개의 데이터(JSON 1: 신규 거래 내역, JSON 2: 현재 사업 목록)를 분석하여, 예산 낭비가 의심되는 '이상 징후'를 탐지해 주십시오.

        탐지 규칙:
        1.  **쪼개기 수의계약 (Split Contract) [1]:** 동일 업체에 30일 이내, 수의계약 한도(예: 2천만 원) 미만으로 여러 건(3회 이상) 분할하여 지출한 내역.
        2.  **부적절 자산 지출 (Illegal Asset) [2]:** 'Projects' 목록에 없거나, '불법 가설건축물' 키워드가 포함된 사업에 대한 유지보수(예: 냉난방) 예산 지출.
        3.  **관성적 지출 (Zombie Spending):** 'SunsetDate'가 3개월 이내로 임박했음에도 불구하고, 신규 장비 구매 등 대규모 지출이 발생하는 사업.

        결과는 반드시 다음 JSON 형식의 배열로 반환해 주십시오:
        ```
    ,
    "RiskScore": 9,
    "AI\_Reasoning": "탐지 근거: 'ABC 프린팅' 업체에 3일간 1,900만 원씩 3회 분할 지출. 쪼개기 계약 [1]이 강력히 의심됨.",
    "AnomalyType": "SplitContract"
    }
    ]
    "
    \`\`\`
    5\.  Claude의 JSON 응답을 파싱하여 `Anomalies_Output` 시트에 새로운 로우로 추가(Append)합니다.
    6\.  \`Transactions\_Input\` 시트의 처리된 로우들의 'Status'를 'Processed'로 업데이트합니다.

### F3: 이상 징후 상세 및 처리 (Anomaly Workflow)

  * **설명:** 감사관이 대시보드(F1)에서 특정 이상 징후를 클릭하면 나오는 상세 페이지.
  * **컴포넌트:**
      * **AI 분석 결과:** `AI_Reasoning`, `RiskScore`, `AnomalyType` 표시.
      * **관련 거래 내역:** `Involved_TIDs`에 해당하는 상세 거래 내역 표시.
      * **관련 사업 정보:** `ProjectID_Ref`에 해당하는 사업의 `SunsetDate`, `TotalBudget` 등 표시.
  * **워크플로우 (버튼):**
      * `[조사 중]` : `Anomalies_Output` 시트의 'Status'를 'Investigating'으로 변경. (담당 부서에 소명 요청 알림 발송 - Google Chat API 제안).
      * `[기각]` : 'Status'를 'Dismissed'로 변경 (AI의 False Positive).
      * `[집행 중지]` : 'Status'를 'Halted'로 변경 (실제 문제 발견).

### F4: 정책 일몰 관리 (Sunset Management)

  * **설명:** 예산 담당자(박 주무관)가 모든 사업의 일몰 기한을 관리하고, 감사관이 심사.
  * **기능 (예산 담당자):**
      * 신규 사업 등록: `Projects` 시트에 로우 추가 (이때 `SunsetDate`는 `StartDate` + 3년으로 자동 설정 [3]).
  * **기능 (사업 담당자):**
      * `SunsetDate` 6개월 전부터 알림.
      * `Sunset_Reviews` 시트에 심사 건 자동 생성.
      * 성과 보고서(PDF/HWP)를 Google Drive에 업로드하고 해당 링크를 `PerformanceReportURL`에 제출.
  * **기능 (감사관):**
      * `Sunset_Reviews` 시트에 제출된 보고서 링크 확인.
      * **(중요)** 해당 사업의 `Anomalies_Output` 내역(AI가 탐지한 위험도)을 함께 조회.
      * 최종 결정: `Decision` 컬럼에 'Extend'(연장) 또는 'Terminate'(종료) [8] 업데이트.
      * 'Terminate' 결정 시, `Projects` 시트의 'Status'가 'Terminated'로 변경됨.

## 7\. 제안 API (Additional APIs)

1.  **Google Chat API:**
      * **용도:** Next.js 서버가 달성군 내부 Google Chat 스페이스(예: '감사실 알림방')로 실시간 경보를 전송.
      * **트리거:** F3에서 `[조사 중]` 버튼 클릭 시, 담당 부서장(최 팀장)에게 멘션과 함께 소명 요청 발송.
2.  **Google Drive API:**
      * **용도:** F4에서 사업 담당자(최 팀장)가 '성과 보고서'를 업로드할 수 있는 전용 폴더를 생성/관리.

## 8\. 사용자 플로우 (User Flow)

**시나리오: '쪼개기 계약' [1] 탐지 및 처리**

1.  (밤 12:00) Vercel Cron Job이 `F2 (AI 이상 징후 탐지)`를 실행.
2.  Claude Sonnet 4.0 API가 어제자 `Transactions_Input` 데이터에서 '쪼개기 계약' 패턴 [1]을 발견하고, `Anomalies_Output` 시트에 'RiskScore 9'로 저장.
3.  (다음 날 09:00) '김 감사관'이 `F1 (대시보드)`에 로그인. '신규 이상 징후 피드'에 '쪼개기 계약 의심(Risk 9)' 건을 확인.
4.  '김 감사관'이 해당 건을 클릭하여 `F3 (이상 징후 상세)` 페이지로 이동.
5.  AI의 `AI_Reasoning`("ABC 프린팅, 1,900만 원씩 3회 분할")을 확인하고 `[조사 중]` 버튼 클릭.
6.  `Anomalies_Output` 시트의 'Status'가 'Investigating'으로 변경됨.
7.  (동시) Google Chat API가 '문화관광과 최 팀장'에게 "A-123 사업 관련 AI 이상 징후(쪼개기 계약 의심)가 탐지되었습니다. F3 화면에서 소명 자료를 제출해 주십시오."라는 멘션 알림 전송.

## 9\. 성공 지표 (Success Metrics)

  * **핵심 지표:** AI가 '선제적'으로 탐지한 예산 낭비 추정액 (월별).
  * **운영 지표:** AI 탐지 건수 대비 '기각(Dismissed)' 비율 (False Positive 비율, 20% 미만 목표).
  * **성과 지표:** '일몰 관리(F4)'를 통해 '종료(Terminated)'된 '좀비 사업'의 총 예산 규모. 