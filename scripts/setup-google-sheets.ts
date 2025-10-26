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

// Sheet configurations
const SHEETS_CONFIG = [
  {
    name: 'Projects',
    headers: [
      'ProjectID',
      'ProjectName',
      'Department',
      'TotalBudget',
      'StartDate',
      'SunsetDate',
      'Status',
    ],
    sampleData: [
      [
        'P001',
        '군정 홍보 사업',
        '문화관광과',
        '100000000',
        '2025-01-01',
        '2028-01-01',
        'Active',
      ],
      [
        'P002',
        '주민참여예산제 운영',
        '기획예산과',
        '2100000000',
        '2025-03-01',
        '2028-03-01',
        'Active',
      ],
    ],
  },
  {
    name: 'Transactions_Input',
    headers: [
      'TransactionID',
      'Date',
      'ProjectID_Ref',
      'VendorName',
      'Amount',
      'Description',
      'Department',
      'Status',
    ],
    sampleData: [
      [
        'T001',
        '2025-10-20',
        'P001',
        'ABC 프린팅',
        '19000000',
        '홍보물 인쇄',
        '문화관광과',
        '',
      ],
    ],
  },
  {
    name: 'Anomalies_Output',
    headers: [
      'AnomalyID',
      'Timestamp',
      'ProjectID_Ref',
      'Involved_TIDs',
      'RiskScore',
      'AI_Reasoning',
      'AnomalyType',
      'Status',
    ],
    sampleData: [],
  },
  {
    name: 'Sunset_Reviews',
    headers: [
      'ReviewID',
      'ProjectID_Ref',
      'SubmitDate',
      'PerformanceReportURL',
      'Decision',
      'AuditorNotes',
    ],
    sampleData: [],
  },
  {
    name: 'Users',
    headers: ['Email', 'Name', 'Role', 'Department'],
    sampleData: [
      ['kim@dalseong.go.kr', '김감사관', 'Auditor', '감사관'],
      ['park@dalseong.go.kr', '박주무관', 'BudgetOfficer', '기획예산과'],
      ['choi@dalseong.go.kr', '최팀장', 'DeptHead', '문화관광과'],
    ],
  },
];

async function setupGoogleSheets() {
  try {
    console.log('🚀 Google Sheets 설정 시작...\n');

    const sheets = getGoogleSheetsClient();

    // Get current spreadsheet info
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    console.log(`📊 스프레드시트: ${spreadsheet.data.properties?.title}`);
    console.log(`🆔 ID: ${SPREADSHEET_ID}\n`);

    // Get existing sheet names
    const existingSheets =
      spreadsheet.data.sheets?.map((sheet) => sheet.properties?.title || '') || [];
    console.log(`현재 시트: ${existingSheets.join(', ')}\n`);

    // Create new sheets
    const requests: any[] = [];

    for (const config of SHEETS_CONFIG) {
      if (!existingSheets.includes(config.name)) {
        console.log(`✨ "${config.name}" 시트 생성 중...`);
        requests.push({
          addSheet: {
            properties: {
              title: config.name,
            },
          },
        });
      } else {
        console.log(`⏭️  "${config.name}" 시트 이미 존재 - 건너뜀`);
      }
    }

    // Execute batch update to create sheets
    if (requests.length > 0) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests,
        },
      });
      console.log(`\n✅ ${requests.length}개 시트 생성 완료\n`);
    }

    // Add headers and sample data to each sheet
    for (const config of SHEETS_CONFIG) {
      console.log(`📝 "${config.name}" 시트에 헤더 및 데이터 추가 중...`);

      const values = [config.headers, ...config.sampleData];

      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${config.name}!A1`,
        valueInputOption: 'RAW',
        requestBody: {
          values,
        },
      });

      console.log(
        `   ✓ 헤더: ${config.headers.length}개 컬럼`
      );
      console.log(
        `   ✓ 샘플 데이터: ${config.sampleData.length}행\n`
      );
    }

    // Format headers (bold, freeze row)
    const formatRequests: any[] = [];

    // Get sheet IDs
    const updatedSpreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    for (const sheet of updatedSpreadsheet.data.sheets || []) {
      const sheetId = sheet.properties?.sheetId;
      const sheetTitle = sheet.properties?.title;

      if (SHEETS_CONFIG.find((c) => c.name === sheetTitle)) {
        // Bold header row
        formatRequests.push({
          repeatCell: {
            range: {
              sheetId: sheetId,
              startRowIndex: 0,
              endRowIndex: 1,
            },
            cell: {
              userEnteredFormat: {
                textFormat: {
                  bold: true,
                },
                backgroundColor: {
                  red: 0.9,
                  green: 0.9,
                  blue: 0.9,
                },
              },
            },
            fields: 'userEnteredFormat(textFormat,backgroundColor)',
          },
        });

        // Freeze header row
        formatRequests.push({
          updateSheetProperties: {
            properties: {
              sheetId: sheetId,
              gridProperties: {
                frozenRowCount: 1,
              },
            },
            fields: 'gridProperties.frozenRowCount',
          },
        });
      }
    }

    // Apply formatting
    if (formatRequests.length > 0) {
      console.log('🎨 헤더 서식 적용 중...');
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: formatRequests,
        },
      });
      console.log('   ✓ 헤더 굵게 + 회색 배경');
      console.log('   ✓ 첫 행 고정\n');
    }

    console.log('✅ Google Sheets 설정 완료!');
    console.log(`\n🔗 스프레드시트 열기:\nhttps://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit\n`);

    console.log('📋 설정된 시트 요약:');
    for (const config of SHEETS_CONFIG) {
      console.log(`   - ${config.name}: ${config.headers.length}개 컬럼, ${config.sampleData.length}개 샘플 데이터`);
    }

  } catch (error) {
    console.error('❌ 오류 발생:', error);
    throw error;
  }
}

// Run the setup
setupGoogleSheets();
