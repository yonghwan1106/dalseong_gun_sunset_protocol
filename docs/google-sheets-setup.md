# Google Sheets 데이터베이스 설정 가이드

## 개요

달성군 선셋 프로토콜은 Google Sheets를 데이터베이스로 사용합니다. 이 문서는 Google Sheets 설정 방법을 안내합니다.

## 1. Google Sheets 생성

1. Google Sheets에 접속하여 새 스프레드시트를 생성합니다
2. 스프레드시트 이름을 "달성군_선셋_프로토콜_DB"로 설정합니다
3. 스프레드시트 ID를 복사합니다 (URL에서 확인 가능)
   - 예: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`

## 2. 시트(Sheet) 생성 및 구조

총 5개의 시트를 생성해야 합니다. 각 시트의 이름과 헤더(첫 번째 행)는 다음과 같습니다:

### Sheet 1: Projects (사업 마스터)

**시트 이름:** `Projects`

**헤더 (A1:G1):**
```
ProjectID | ProjectName | Department | TotalBudget | StartDate | SunsetDate | Status
```

**열 설명:**
- `ProjectID`: 사업 고유 ID (예: P001, P002)
- `ProjectName`: 사업명
- `Department`: 담당 부서
- `TotalBudget`: 총 예산 (숫자)
- `StartDate`: 시작일 (YYYY-MM-DD)
- `SunsetDate`: 일몰 예정일 (YYYY-MM-DD, 시작일 + 3년)
- `Status`: 상태 (Active, UnderReview, Terminated)

**샘플 데이터:**
```
P001 | 군정 홍보 사업 | 문화관광과 | 100000000 | 2025-01-01 | 2028-01-01 | Active
```

---

### Sheet 2: Transactions_Input (거래 내역 입력)

**시트 이름:** `Transactions_Input`

**헤더 (A1:H1):**
```
TransactionID | Date | ProjectID_Ref | VendorName | Amount | Description | Department | Status
```

**열 설명:**
- `TransactionID`: 거래 고유 ID (예: T001, T002)
- `Date`: 거래 날짜 (YYYY-MM-DD)
- `ProjectID_Ref`: 사업 ID (Projects 시트의 ProjectID 참조)
- `VendorName`: 업체명
- `Amount`: 금액 (숫자)
- `Description`: 거래 설명
- `Department`: 담당 부서
- `Status`: 처리 상태 (비어있음 = 미처리, Processed = 처리됨)

**샘플 데이터:**
```
T001 | 2025-10-20 | P001 | ABC 프린팅 | 19000000 | 홍보물 인쇄 | 문화관광과 |
```

**중요:**
- e-호조 시스템에서 매일 거래 내역을 CSV/Excel로 export
- 이 시트에 복사-붙여넣기 (Status 열은 비워둠)
- AI가 매일 밤 미처리(Status가 비어있는) 거래를 분석

---

### Sheet 3: Anomalies_Output (AI 탐지 결과)

**시트 이름:** `Anomalies_Output`

**헤더 (A1:H1):**
```
AnomalyID | Timestamp | ProjectID_Ref | Involved_TIDs | RiskScore | AI_Reasoning | AnomalyType | Status
```

**열 설명:**
- `AnomalyID`: 이상 징후 고유 ID (자동 생성)
- `Timestamp`: 탐지 시간 (ISO 8601 형식)
- `ProjectID_Ref`: 사업 ID
- `Involved_TIDs`: 관련 거래 ID들 (JSON 배열 문자열, 예: ["T001","T002"])
- `RiskScore`: 위험도 (1-10)
- `AI_Reasoning`: AI 분석 근거
- `AnomalyType`: 유형 (SplitContract, IllegalAsset, ZombieSpending)
- `Status`: 상태 (New, Investigating, Dismissed, Halted)

**이 시트는 AI가 자동으로 채웁니다 - 수동 입력 불필요**

---

### Sheet 4: Sunset_Reviews (일몰 심사)

**시트 이름:** `Sunset_Reviews`

**헤더 (A1:F1):**
```
ReviewID | ProjectID_Ref | SubmitDate | PerformanceReportURL | Decision | AuditorNotes
```

**열 설명:**
- `ReviewID`: 심사 고유 ID
- `ProjectID_Ref`: 사업 ID
- `SubmitDate`: 제출일
- `PerformanceReportURL`: 성과 보고서 링크 (Google Drive)
- `Decision`: 결정 (Extend, Terminate, 비어있음=심사 대기)
- `AuditorNotes`: 감사관 메모

**샘플 데이터:**
```
R001 | P001 | 2025-10-26 | https://drive.google.com/... | |
```

---

### Sheet 5: Users (사용자)

**시트 이름:** `Users`

**헤더 (A1:D1):**
```
Email | Name | Role | Department
```

**열 설명:**
- `Email`: 이메일 (@dalseong.go.kr)
- `Name`: 이름
- `Role`: 역할 (Auditor, BudgetOfficer, DeptHead)
- `Department`: 부서

**샘플 데이터:**
```
kim@dalseong.go.kr | 김감사관 | Auditor | 감사관
park@dalseong.go.kr | 박주무관 | BudgetOfficer | 기획예산과
choi@dalseong.go.kr | 최팀장 | DeptHead | 문화관광과
```

---

## 3. Google Service Account 설정

AI 시스템이 Google Sheets에 접근하려면 Service Account가 필요합니다.

### 3.1. Google Cloud Console에서 Service Account 생성

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "APIs & Services" > "Credentials" 이동
4. "Create Credentials" > "Service Account" 선택
5. Service Account 이름: `dalseong-sunset-protocol`
6. 생성 후 Service Account 이메일 복사 (예: `dalseong-sunset-protocol@...iam.gserviceaccount.com`)

### 3.2. JSON Key 생성

1. 생성한 Service Account 클릭
2. "Keys" 탭 이동
3. "Add Key" > "Create new key" > "JSON" 선택
4. JSON 파일 다운로드 (안전한 곳에 보관)

### 3.3. Google Sheets API 활성화

1. Google Cloud Console에서 "APIs & Services" > "Library" 이동
2. "Google Sheets API" 검색
3. "Enable" 클릭

### 3.4. Google Sheets 공유

1. 생성한 Google Sheets 문서 열기
2. 우측 상단 "공유" 버튼 클릭
3. Service Account 이메일 추가 (3.1에서 복사한 이메일)
4. 권한: "편집자"로 설정
5. "완료" 클릭

---

## 4. 환경 변수 설정

다운로드한 JSON 키 파일을 열고 다음 값을 `.env.local` 파일에 추가:

```env
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL="dalseong-sunset-protocol@...iam.gserviceaccount.com"
GOOGLE_SPREADSHEET_ID="1234567890abcdef"
```

**주의사항:**
- `GOOGLE_SHEETS_PRIVATE_KEY`는 JSON 파일의 `private_key` 값
- 개행 문자(`\n`)를 그대로 유지해야 함
- 큰따옴표로 감싸야 함

---

## 5. 데이터 입력 워크플로우

### 일일 거래 내역 입력 (e-호조 → Google Sheets)

1. e-호조 시스템에서 전일 거래 내역 CSV/Excel 다운로드
2. Google Sheets의 `Transactions_Input` 시트 열기
3. 마지막 행 다음에 붙여넣기
4. **Status 열은 비워둠** (AI가 처리 후 'Processed'로 표시)
5. 완료

### AI 감사 자동 실행

- 매일 밤 자정 (00:00 KST)
- Vercel Cron Job이 자동으로 `/api/run-audit` 호출
- `Transactions_Input`의 미처리 거래 분석
- 이상 징후 발견 시 `Anomalies_Output`에 자동 저장
- 처리된 거래는 Status → 'Processed'

---

## 6. 데이터 백업 권장사항

- Google Sheets는 자동 버전 관리 기능 제공
- 주 1회 전체 시트 다운로드 (Excel 형식) 백업 권장
- Google Drive 폴더에 백업 파일 보관

---

## 7. 문제 해결

### "Permission denied" 오류
- Service Account 이메일이 Google Sheets에 편집자로 공유되었는지 확인
- Google Sheets API가 활성화되었는지 확인

### AI가 거래를 처리하지 않음
- `Transactions_Input` 시트의 Status 열이 비어있는지 확인
- Vercel Cron Job 로그 확인 (Vercel Dashboard)

### 환경 변수 오류
- `.env.local` 파일의 `GOOGLE_SHEETS_PRIVATE_KEY`에 `\n` 개행 문자가 포함되어 있는지 확인
- 큰따옴표로 감싸져 있는지 확인

---

## 부록: 테스트 데이터셋

시스템 테스트를 위한 샘플 데이터는 다음 파일 참조:
- `docs/sample-data.xlsx`

---

**작성일:** 2025-10-26
**버전:** 1.0
