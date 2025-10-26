// Type definitions for Dalseong-gun Sunset Protocol

// User Roles
export type UserRole = 'Auditor' | 'BudgetOfficer' | 'DeptHead';

// Project Status
export type ProjectStatus = 'Active' | 'UnderReview' | 'Terminated';

// Anomaly Status
export type AnomalyStatus = 'New' | 'Investigating' | 'Dismissed' | 'Halted';

// Anomaly Types
export type AnomalyType = 'SplitContract' | 'IllegalAsset' | 'ZombieSpending';

// Review Decision
export type ReviewDecision = 'Extend' | 'Terminate' | '';

// ===== Sheet 1: Projects =====
export interface Project {
  ProjectID: string;
  ProjectName: string;
  Department: string;
  TotalBudget: number;
  StartDate: string; // ISO date string
  SunsetDate: string; // ISO date string
  Status: ProjectStatus;
}

// ===== Sheet 2: Transactions_Input =====
export interface Transaction {
  TransactionID: string;
  Date: string; // ISO date string
  ProjectID_Ref: string; // FK to Projects
  VendorName: string;
  Amount: number;
  Description: string;
  Department: string;
  Status?: 'Processed' | '';
}

// ===== Sheet 3: Anomalies_Output =====
export interface Anomaly {
  AnomalyID: string;
  Timestamp: string; // ISO date string
  ProjectID_Ref: string; // FK to Projects
  Involved_TIDs: string[]; // JSON array of Transaction IDs
  RiskScore: number; // 1-10
  AI_Reasoning: string;
  AnomalyType: AnomalyType;
  Status: AnomalyStatus;
}

// ===== Sheet 4: Sunset_Reviews =====
export interface SunsetReview {
  ReviewID: string;
  ProjectID_Ref: string; // FK to Projects
  SubmitDate: string; // ISO date string
  PerformanceReportURL: string; // Google Drive link
  Decision: ReviewDecision;
  AuditorNotes: string;
}

// ===== Sheet 5: Users =====
export interface User {
  Email: string; // @dalseong.go.kr
  Name: string;
  Role: UserRole;
  Department: string;
}

// ===== AI Analysis Request/Response =====
export interface AIAuditRequest {
  transactions: Transaction[];
  projects: Project[];
}

export interface AIAnomalyDetection {
  ProjectID_Ref: string;
  Involved_TIDs: string[];
  RiskScore: number;
  AI_Reasoning: string;
  AnomalyType: AnomalyType;
}

// ===== Dashboard KPIs =====
export interface DashboardKPIs {
  newAnomaliesCount: number;
  upcomingSunsetsCount: number; // Within 90 days
  pendingReviewsCount: number;
}

// ===== Extended types for UI =====
export interface AnomalyWithDetails extends Anomaly {
  project?: Project;
  transactions?: Transaction[];
}

export interface ProjectWithAnomalies extends Project {
  anomalies?: Anomaly[];
}

export interface SunsetReviewWithProject extends SunsetReview {
  project?: Project;
  anomalies?: Anomaly[];
}
