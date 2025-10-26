import { google } from 'googleapis';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID!;

// Initialize Google Sheets API
const getGoogleSheetsClient = () => {
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;

  if (!privateKey || !clientEmail) {
    throw new Error('Google Sheets credentials not configured');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
};

async function addSampleData() {
  try {
    console.log('🚀 샘플 데이터 추가 시작...\n');

    const sheets = getGoogleSheetsClient();

    // 1. 더 많은 거래 내역 추가 (쪼개기 계약 패턴)
    console.log('📝 Transactions_Input에 샘플 거래 추가 중...');

    const transactions = [
      ['T002', '2025-10-22', 'P001', 'ABC 프린팅', '19000000', '홍보물 인쇄', '문화관광과', ''],
      ['T003', '2025-10-23', 'P001', 'ABC 프린팅', '19000000', '홍보물 인쇄', '문화관광과', ''],
      ['T004', '2025-10-25', 'P002', 'XYZ 건설', '8000000', '주민참여예산 시설 공사', '기획예산과', ''],
      ['T005', '2025-10-26', 'P999', '불법건축 업체', '5000000', '가설건축물 냉난방 교체', '시설관리과', ''],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Transactions_Input!A:H',
      valueInputOption: 'RAW',
      requestBody: {
        values: transactions,
      },
    });

    console.log(`   ✓ ${transactions.length}개 거래 추가됨\n`);

    // 2. 샘플 이상 징후 추가
    console.log('📝 Anomalies_Output에 샘플 이상 징후 추가 중...');

    const anomalies = [
      [
        'A-001',
        new Date().toISOString(),
        'P001',
        '["T001","T002","T003"]',
        '9',
        '탐지 근거: "ABC 프린팅" 업체에 3일간 1,900만 원씩 3회 분할 지출. 쪼개기 계약이 강력히 의심됨. 수의계약 한도(2천만 원)를 회피하기 위한 의도적 분할 가능성이 높음.',
        'SplitContract',
        'New',
      ],
      [
        'A-002',
        new Date().toISOString(),
        'P999',
        '["T005"]',
        '8',
        '탐지 근거: ProjectID "P999"는 현재 사업 목록(Projects)에 존재하지 않음. Description에 "가설건축물" 키워드 포함. 불법 자산에 대한 예산 집행 의심.',
        'IllegalAsset',
        'New',
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Anomalies_Output!A:H',
      valueInputOption: 'RAW',
      requestBody: {
        values: anomalies,
      },
    });

    console.log(`   ✓ ${anomalies.length}개 이상 징후 추가됨\n`);

    // 3. 일몰 도래 사업 추가
    console.log('📝 Projects에 일몰 도래 사업 추가 중...');

    const sunsetDate = new Date();
    sunsetDate.setDate(sunsetDate.getDate() + 60); // 60일 후

    const projects = [
      [
        'P003',
        '관광 안내 표지판 설치',
        '문화관광과',
        '50000000',
        '2022-11-01',
        sunsetDate.toISOString().split('T')[0],
        'Active',
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Projects!A:G',
      valueInputOption: 'RAW',
      requestBody: {
        values: projects,
      },
    });

    console.log(`   ✓ ${projects.length}개 일몰 도래 사업 추가됨\n`);

    // 4. 심사 대기 건 추가
    console.log('📝 Sunset_Reviews에 심사 대기 건 추가 중...');

    const reviews = [
      [
        'R001',
        'P003',
        new Date().toISOString().split('T')[0],
        'https://drive.google.com/file/sample-report',
        '',
        '',
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sunset_Reviews!A:F',
      valueInputOption: 'RAW',
      requestBody: {
        values: reviews,
      },
    });

    console.log(`   ✓ ${reviews.length}개 심사 대기 건 추가됨\n`);

    console.log('✅ 샘플 데이터 추가 완료!');
    console.log(`\n🔗 스프레드시트 확인:\nhttps://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit\n`);

    console.log('📊 추가된 데이터 요약:');
    console.log(`   - 신규 거래: ${transactions.length}건`);
    console.log(`   - 이상 징후: ${anomalies.length}건 (RiskScore 9, 8)`);
    console.log(`   - 일몰 도래 사업: ${projects.length}건`);
    console.log(`   - 심사 대기: ${reviews.length}건`);
    console.log('\n🎯 이제 대시보드를 새로고침하면 데이터가 보입니다!\n');

  } catch (error) {
    console.error('❌ 오류 발생:', error);
    throw error;
  }
}

// Run the script
addSampleData();
