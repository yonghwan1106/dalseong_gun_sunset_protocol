import { google } from 'googleapis';
import type {
  Project,
  Transaction,
  Anomaly,
  SunsetReview,
  User,
} from '@/types';

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

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID!;

// Sheet names
export const SHEET_NAMES = {
  PROJECTS: 'Projects',
  TRANSACTIONS_INPUT: 'Transactions_Input',
  ANOMALIES_OUTPUT: 'Anomalies_Output',
  SUNSET_REVIEWS: 'Sunset_Reviews',
  USERS: 'Users',
} as const;

// ===== Helper Functions =====

// Convert sheet row to object
const rowToObject = <T>(headers: string[], row: any[]): T => {
  const obj: any = {};
  headers.forEach((header, index) => {
    const value = row[index];
    // Convert numeric fields to integers
    if (header === 'TotalBudget' || header === 'Amount' || header === 'RiskScore') {
      obj[header] = value ? Math.round(Number(value)) : 0;
    } else {
      obj[header] = value || '';
    }
  });
  return obj as T;
};

// Convert object to row
const objectToRow = (headers: string[], obj: any): any[] => {
  return headers.map(header => obj[header] || '');
};

// ===== Read Operations =====

export const getSheetData = async <T>(sheetName: string): Promise<T[]> => {
  const sheets = getGoogleSheetsClient();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A1:ZZ`,
  });

  const rows = response.data.values || [];
  if (rows.length === 0) return [];

  const headers = rows[0];
  const dataRows = rows.slice(1);

  return dataRows.map(row => rowToObject<T>(headers, row));
};

export const getProjects = () => getSheetData<Project>(SHEET_NAMES.PROJECTS);

export const getTransactions = () => getSheetData<Transaction>(SHEET_NAMES.TRANSACTIONS_INPUT);

export const getAnomalies = () => getSheetData<Anomaly>(SHEET_NAMES.ANOMALIES_OUTPUT);

export const getSunsetReviews = () => getSheetData<SunsetReview>(SHEET_NAMES.SUNSET_REVIEWS);

export const getUsers = () => getSheetData<User>(SHEET_NAMES.USERS);

// ===== Get single item by ID =====

export const getProjectById = async (projectId: string): Promise<Project | null> => {
  const projects = await getProjects();
  return projects.find(p => p.ProjectID === projectId) || null;
};

export const getAnomalyById = async (anomalyId: string): Promise<Anomaly | null> => {
  const anomalies = await getAnomalies();
  return anomalies.find(a => a.AnomalyID === anomalyId) || null;
};

// ===== Get filtered data =====

export const getUnprocessedTransactions = async (): Promise<Transaction[]> => {
  const transactions = await getTransactions();
  return transactions.filter(t => !t.Status || t.Status !== 'Processed');
};

export const getNewAnomalies = async (): Promise<Anomaly[]> => {
  const anomalies = await getAnomalies();
  return anomalies.filter(a => a.Status === 'New');
};

export const getUpcomingSunsets = async (daysThreshold: number = 90): Promise<Project[]> => {
  const projects = await getProjects();
  const now = new Date();
  const thresholdDate = new Date();
  thresholdDate.setDate(now.getDate() + daysThreshold);

  return projects.filter(p => {
    if (p.Status !== 'Active') return false;
    const sunsetDate = new Date(p.SunsetDate);
    return sunsetDate > now && sunsetDate <= thresholdDate;
  });
};

export const getPendingReviews = async (): Promise<SunsetReview[]> => {
  const reviews = await getSunsetReviews();
  return reviews.filter(r => !r.Decision);
};

// ===== Write Operations =====

export const appendRows = async (sheetName: string, rows: any[][]): Promise<void> => {
  const sheets = getGoogleSheetsClient();

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A:A`,
    valueInputOption: 'RAW',
    requestBody: {
      values: rows,
    },
  });
};

export const appendAnomaly = async (anomaly: Anomaly): Promise<void> => {
  const headers = [
    'AnomalyID',
    'Timestamp',
    'ProjectID_Ref',
    'Involved_TIDs',
    'RiskScore',
    'AI_Reasoning',
    'AnomalyType',
    'Status',
  ];

  const row = objectToRow(headers, {
    ...anomaly,
    Involved_TIDs: JSON.stringify(anomaly.Involved_TIDs),
  });

  await appendRows(SHEET_NAMES.ANOMALIES_OUTPUT, [row]);
};

// ===== Update Operations =====

export const updateCellValue = async (
  sheetName: string,
  row: number,
  column: string,
  value: any
): Promise<void> => {
  const sheets = getGoogleSheetsClient();

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!${column}${row}`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[value]],
    },
  });
};

// Update transaction status to "Processed"
export const markTransactionsProcessed = async (transactionIds: string[]): Promise<void> => {
  const sheets = getGoogleSheetsClient();
  const transactions = await getTransactions();

  // Get all data with row numbers
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAMES.TRANSACTIONS_INPUT}!A1:ZZ`,
  });

  const rows = response.data.values || [];
  const headers = rows[0];
  const statusColumnIndex = headers.indexOf('Status');
  const idColumnIndex = headers.indexOf('TransactionID');

  if (statusColumnIndex === -1 || idColumnIndex === -1) {
    throw new Error('Required columns not found');
  }

  // Update each transaction
  const updates = rows.slice(1).map((row, index) => {
    const transactionId = row[idColumnIndex];
    if (transactionIds.includes(transactionId)) {
      return {
        range: `${SHEET_NAMES.TRANSACTIONS_INPUT}!${String.fromCharCode(65 + statusColumnIndex)}${index + 2}`,
        values: [['Processed']],
      };
    }
    return null;
  }).filter((u): u is { range: string; values: string[][] } => u !== null);

  if (updates.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        data: updates,
        valueInputOption: 'RAW',
      },
    });
  }
};

// Update anomaly status
export const updateAnomalyStatus = async (
  anomalyId: string,
  newStatus: Anomaly['Status']
): Promise<void> => {
  const sheets = getGoogleSheetsClient();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAMES.ANOMALIES_OUTPUT}!A1:ZZ`,
  });

  const rows = response.data.values || [];
  const headers = rows[0];
  const statusColumnIndex = headers.indexOf('Status');
  const idColumnIndex = headers.indexOf('AnomalyID');

  const rowIndex = rows.slice(1).findIndex(row => row[idColumnIndex] === anomalyId);

  if (rowIndex !== -1) {
    const statusColumn = String.fromCharCode(65 + statusColumnIndex);
    await updateCellValue(
      SHEET_NAMES.ANOMALIES_OUTPUT,
      rowIndex + 2, // +1 for header, +1 for 1-based indexing
      statusColumn,
      newStatus
    );
  }
};

// Update project status
export const updateProjectStatus = async (
  projectId: string,
  newStatus: Project['Status']
): Promise<void> => {
  const sheets = getGoogleSheetsClient();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAMES.PROJECTS}!A1:ZZ`,
  });

  const rows = response.data.values || [];
  const headers = rows[0];
  const statusColumnIndex = headers.indexOf('Status');
  const idColumnIndex = headers.indexOf('ProjectID');

  const rowIndex = rows.slice(1).findIndex(row => row[idColumnIndex] === projectId);

  if (rowIndex !== -1) {
    const statusColumn = String.fromCharCode(65 + statusColumnIndex);
    await updateCellValue(
      SHEET_NAMES.PROJECTS,
      rowIndex + 2,
      statusColumn,
      newStatus
    );
  }
};
