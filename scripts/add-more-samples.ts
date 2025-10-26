import { google } from 'googleapis';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID!;

const getGoogleSheetsClient = () => {
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
};

async function addMoreSamples() {
  try {
    console.log('🚀 추가 샘플 데이터 생성 중...\n');

    const sheets = getGoogleSheetsClient();

    // 더 많은 프로젝트 추가
    console.log('📝 Projects에 사업 추가...');
    const projects = [
      ['P004', '스마트 가로등 설치', '도시계획과', '300000000', '2024-01-15', '2027-01-15', 'Active'],
      ['P005', '공원 리모델링', '공원녹지과', '150000000', '2023-06-01', '2026-06-01', 'Active'],
      ['P006', '주민센터 시설 개선', '자치행정과', '80000000', '2024-03-01', '2027-03-01', 'Active'],
      ['P007', '문화재 보존 사업', '문화관광과', '120000000', '2023-09-01', '2026-09-01', 'Active'],
      ['P008', '어린이 안전 CCTV', '안전총괄과', '200000000', '2024-05-01', '2027-05-01', 'Active'],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Projects!A:G',
      valueInputOption: 'RAW',
      requestBody: { values: projects },
    });
    console.log(`   ✓ ${projects.length}개 사업 추가\n`);

    // 더 많은 거래 추가
    console.log('📝 Transactions_Input에 거래 추가...');
    const transactions = [
      ['T006', '2025-10-15', 'P004', '스마트조명', '18000000', 'LED 가로등 구매', '도시계획과', ''],
      ['T007', '2025-10-16', 'P004', '스마트조명', '19500000', 'LED 가로등 추가 구매', '도시계획과', ''],
      ['T008', '2025-10-17', 'P004', '스마트조명', '19800000', 'LED 가로등 추가 구매', '도시계획과', ''],
      ['T009', '2025-10-20', 'P005', '조경업체', '35000000', '공원 수목 구매', '공원녹지과', ''],
      ['T010', '2025-10-21', 'P006', '인테리어', '25000000', '주민센터 가구 구매', '자치행정과', ''],
      ['T011', '2025-10-22', 'P007', '문화재보존', '15000000', '문화재 보수 자재', '문화관광과', ''],
      ['T012', '2025-10-23', 'P008', 'CCTV전문', '45000000', 'CCTV 카메라 구매', '안전총괄과', ''],
      ['T013', '2025-11-01', 'P005', '조경업체', '12000000', '공원 벤치 설치', '공원녹지과', ''],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Transactions_Input!A:H',
      valueInputOption: 'RAW',
      requestBody: { values: transactions },
    });
    console.log(`   ✓ ${transactions.length}개 거래 추가\n`);

    // 더 많은 이상 징후 추가
    console.log('📝 Anomalies_Output에 이상 징후 추가...');

    const now = new Date();
    const anomalies = [
      [
        'A-003',
        new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(),
        'P004',
        '["T006","T007","T008"]',
        '9',
        '탐지 근거: "스마트조명" 업체에 3일 연속 1,800만 원~1,980만 원씩 분할 지출. 총 5,730만 원으로 수의계약 한도(2천만 원)를 3회 분할하여 회피. 쪼개기 계약 명백.',
        'SplitContract',
        'New',
      ],
      [
        'A-004',
        new Date(now.getTime() - 1000 * 60 * 60 * 5).toISOString(),
        'P005',
        '["T009"]',
        '6',
        '탐지 근거: 공원 수목 구매 3,500만 원. 프로젝트 총 예산(1억 5천만 원) 대비 23% 일시 지출. 일반적인 공원 조경 사업 패턴과 상이하여 의심됨.',
        'ZombieSpending',
        'Investigating',
      ],
      [
        'A-005',
        new Date(now.getTime() - 1000 * 60 * 60 * 10).toISOString(),
        'P007',
        '["T011"]',
        '5',
        '탐지 근거: 문화재 보존 사업(P007)의 일몰 예정일이 2026년 9월로 9개월 이내 도래. 그럼에도 불구하고 1,500만 원 상당의 보수 자재 신규 구매는 관성적 지출 가능성.',
        'ZombieSpending',
        'New',
      ],
      [
        'A-006',
        new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
        'P008',
        '["T012"]',
        '7',
        '탐지 근거: CCTV 카메라 구매 4,500만 원. 동일 부서(안전총괄과)에서 최근 6개월 내 유사한 CCTV 구매 이력 있음. 중복 구매 가능성 검토 필요.',
        'ZombieSpending',
        'New',
      ],
      [
        'A-007',
        new Date(now.getTime() - 1000 * 60 * 60 * 30).toISOString(),
        'P002',
        '["T004"]',
        '4',
        '탐지 근거: XYZ 건설 업체 800만 원 지출. 정상 범위이나 주민참여예산 사업의 투명성 강화를 위해 모니터링 필요.',
        'SplitContract',
        'Dismissed',
      ],
      [
        'A-008',
        new Date(now.getTime() - 1000 * 60 * 60 * 48).toISOString(),
        'P006',
        '["T010"]',
        '6',
        '탐지 근거: 주민센터 가구 구매 2,500만 원. 인테리어 업체 단일 지출. 견적 비교 절차 이행 여부 확인 필요.',
        'IllegalAsset',
        'Investigating',
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Anomalies_Output!A:H',
      valueInputOption: 'RAW',
      requestBody: { values: anomalies },
    });
    console.log(`   ✓ ${anomalies.length}개 이상 징후 추가\n`);

    // 일몰 도래 사업 추가
    console.log('📝 일몰 도래 사업 추가...');
    const sunsetProjects = [
      ['P009', '노후 시설물 안전 진단', '안전총괄과', '60000000', '2022-12-01', '2025-12-25', 'Active'],
      ['P010', '농촌 체험 프로그램', '농업정책과', '40000000', '2023-01-15', '2026-01-15', 'Active'],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Projects!A:G',
      valueInputOption: 'RAW',
      requestBody: { values: sunsetProjects },
    });
    console.log(`   ✓ ${sunsetProjects.length}개 일몰 도래 사업 추가\n`);

    // 심사 건 추가
    console.log('📝 Sunset_Reviews에 심사 건 추가...');
    const reviews = [
      ['R002', 'P009', '2025-10-20', 'https://drive.google.com/file/safety-report', '', ''],
      ['R003', 'P010', '2025-10-22', 'https://drive.google.com/file/farm-report', '', ''],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sunset_Reviews!A:F',
      valueInputOption: 'RAW',
      requestBody: { values: reviews },
    });
    console.log(`   ✓ ${reviews.length}개 심사 건 추가\n`);

    console.log('✅ 추가 샘플 데이터 생성 완료!\n');
    console.log('📊 총 데이터 요약:');
    console.log(`   - 프로젝트: 기존 3개 + 신규 ${projects.length + sunsetProjects.length}개 = 총 ${3 + projects.length + sunsetProjects.length}개`);
    console.log(`   - 거래: 기존 5개 + 신규 ${transactions.length}개`);
    console.log(`   - 이상 징후: 기존 2개 + 신규 ${anomalies.length}개 = 총 ${2 + anomalies.length}개`);
    console.log(`   - 심사 건: 기존 1개 + 신규 ${reviews.length}개 = 총 ${1 + reviews.length}개\n`);
    console.log('🎯 대시보드를 새로고침하세요!\n');

  } catch (error) {
    console.error('❌ 오류:', error);
    throw error;
  }
}

addMoreSamples();
