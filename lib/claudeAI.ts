import Anthropic from '@anthropic-ai/sdk';
import type { Transaction, Project, AIAnomalyDetection } from '@/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// AI Audit Prompt Template
const createAuditPrompt = (transactions: Transaction[], projects: Project[]): string => {
  return `당신은 대한민국 달성군의 최고 감사관 AI입니다.

제공된 2개의 데이터를 분석하여, 예산 낭비가 의심되는 '이상 징후'를 탐지해 주십시오.

<거래 내역 데이터>
${JSON.stringify(transactions, null, 2)}
</거래 내역 데이터>

<현재 사업 목록>
${JSON.stringify(projects, null, 2)}
</현재 사업 목록>

탐지 규칙:
1. **쪼개기 수의계약 (Split Contract):**
   - 동일 업체에 30일 이내, 수의계약 한도(예: 2천만 원) 미만으로 여러 건(3회 이상) 분할하여 지출한 내역
   - 의심 기준: 같은 VendorName, 30일 이내 Date, 각 Amount < 20,000,000원, 3회 이상

2. **부적절 자산 지출 (Illegal Asset):**
   - 'Projects' 목록에 없는 ProjectID_Ref로 지출된 거래
   - Description에 '불법', '가설건축물', '미허가' 등의 키워드가 포함된 경우

3. **관성적 지출 (Zombie Spending):**
   - SunsetDate가 3개월(90일) 이내로 임박했음에도 불구하고,
   - 신규 장비 구매 등 대규모 지출(Amount > 10,000,000원)이 발생하는 사업
   - Description에 '장비', '구매', '신규' 등의 키워드가 포함된 경우

**중요:** 결과는 반드시 다음 JSON 형식의 배열로만 반환해 주십시오.
다른 설명이나 텍스트를 포함하지 마십시오. 오직 JSON 배열만 반환하십시오.

[
  {
    "ProjectID_Ref": "프로젝트 ID",
    "Involved_TIDs": ["거래ID1", "거래ID2"],
    "RiskScore": 1~10 사이의 숫자,
    "AI_Reasoning": "탐지 근거를 상세히 설명",
    "AnomalyType": "SplitContract" | "IllegalAsset" | "ZombieSpending"
  }
]

이상 징후가 없는 경우 빈 배열 []을 반환하십시오.`;
};

/**
 * Run AI-based anomaly detection on transactions
 */
export const runAIAudit = async (
  transactions: Transaction[],
  projects: Project[]
): Promise<AIAnomalyDetection[]> => {
  try {
    const prompt = createAuditPrompt(transactions, projects);

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract the text response
    const responseText = message.content
      .filter(block => block.type === 'text')
      .map(block => (block as any).text)
      .join('');

    // Parse JSON response
    // Remove markdown code blocks if present
    const jsonText = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const anomalies: AIAnomalyDetection[] = JSON.parse(jsonText);

    // Validate the response
    if (!Array.isArray(anomalies)) {
      console.error('AI response is not an array:', anomalies);
      return [];
    }

    // Validate each anomaly object
    const validAnomalies = anomalies.filter(anomaly => {
      return (
        anomaly.ProjectID_Ref &&
        Array.isArray(anomaly.Involved_TIDs) &&
        typeof anomaly.RiskScore === 'number' &&
        anomaly.RiskScore >= 1 &&
        anomaly.RiskScore <= 10 &&
        anomaly.AI_Reasoning &&
        ['SplitContract', 'IllegalAsset', 'ZombieSpending'].includes(anomaly.AnomalyType)
      );
    });

    return validAnomalies;
  } catch (error) {
    console.error('Error running AI audit:', error);
    throw error;
  }
};

/**
 * Test function for AI audit
 */
export const testAIAudit = async () => {
  const mockTransactions: Transaction[] = [
    {
      TransactionID: 'T001',
      Date: '2025-10-20',
      ProjectID_Ref: 'P001',
      VendorName: 'ABC 프린팅',
      Amount: 19000000,
      Description: '홍보물 인쇄',
      Department: '문화관광과',
    },
    {
      TransactionID: 'T002',
      Date: '2025-10-22',
      ProjectID_Ref: 'P001',
      VendorName: 'ABC 프린팅',
      Amount: 19000000,
      Description: '홍보물 인쇄',
      Department: '문화관광과',
    },
    {
      TransactionID: 'T003',
      Date: '2025-10-23',
      ProjectID_Ref: 'P001',
      VendorName: 'ABC 프린팅',
      Amount: 19000000,
      Description: '홍보물 인쇄',
      Department: '문화관광과',
    },
  ];

  const mockProjects: Project[] = [
    {
      ProjectID: 'P001',
      ProjectName: '군정 홍보 사업',
      Department: '문화관광과',
      TotalBudget: 100000000,
      StartDate: '2025-01-01',
      SunsetDate: '2027-12-31',
      Status: 'Active',
    },
  ];

  const anomalies = await runAIAudit(mockTransactions, mockProjects);
  console.log('Detected anomalies:', JSON.stringify(anomalies, null, 2));
  return anomalies;
};
