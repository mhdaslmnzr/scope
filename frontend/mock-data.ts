export const vendors = [
  {
    name: 'Acme Corp',
    criticality: 'Critical',
    score: 45,
    sector: 'Finance',
    country: 'USA',
    website: 'https://acme.com',
    employeeCount: '201-1000',
    revenue: '10M-100M',
    assetImportance: 'Critical',
    function: 'Data Processor',
    products: ['ERP Suite', 'Payment Gateway'],
    globalFootprint: 'North America, Europe',
    dataCenterRegion: 'US East',
    internalDependencies: 7,
    certifications: 'ISO 27001, SOC2',
    frameworks: 'NIST, CIS Controls',
    edrAv: true,
    mdmByod: true,
    incidentResponsePlan: true,
    publicIp: '192.168.1.0/24',
    subdomains: 'api.acme.com, admin.acme.com',
    githubOrg: 'acme-corp/erp',
    complianceDoc: true,
    lastAuditDate: '2024-05-15',
    lastScan: '2024-06-10 14:00',
    lastAssessment: '2024-06-09',
    scores: { cybersecurity: 48, compliance: 62, geopolitical: 55, reputation: 32, aggregate: 45 },
    scoreDetails: [
        { category: 'Vulnerability Management', score: 40, weight: 5 }, { category: 'Attack Surface', score: 50, weight: 5 }, { category: 'Web/App Security', score: 55, weight: 5 }, { category: 'Cloud & Infra', score: 60, weight: 5 }, { category: 'Email Security', score: 45, weight: 5 }, { category: 'Code Repo Exposure', score: 30, weight: 5 }, { category: 'Endpoint Hygiene', score: 50, weight: 5 }, { category: 'IOC & Infra Threat', score: 35, weight: 3 }, { category: 'Detection & Response', score: 60, weight: 2 }, { category: 'Certifications', score: 70, weight: 6 }, { category: 'Questionnaire Quality', score: 60, weight: 5 }, { category: 'Regulatory Violations', score: 50, weight: 5 }, { category: 'Privacy Compliance', score: 65, weight: 2 }, { category: 'Contractual Clauses', score: 60, weight: 2 }, { category: 'Country Risk', score: 55, weight: 6 }, { category: 'Sector Risk', score: 50, weight: 4 }, { category: 'Company Size', score: 60, weight: 3 }, { category: 'Infra Jurisdiction', score: 55, weight: 3 }, { category: 'Concentration Risk', score: 50, weight: 2 }, { category: 'Environmental Exposure', score: 60, weight: 2 }, { category: 'Data Breach History', score: 30, weight: 6 }, { category: 'Credential/Data Leaks', score: 35, weight: 5 }, { category: 'Brand Spoofing', score: 40, weight: 3 }, { category: 'Dark Web Presence', score: 25, weight: 3 }, { category: 'Social Sentiment', score: 30, weight: 3 },
    ],
    breachChance: 0.72,
    questionnaires: { nist: true, sig: false, openfair: true },
    tags: ['Finance', 'Data Processor'],
  },
  // ... other vendors
];

export const criticalityColors: Record<string, string> = {
  Critical: 'bg-red-100 text-red-700',
  High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-green-100 text-green-700',
};

export const scoreColors = (score: number) => {
  if (score < 50) return 'bg-red-100 text-red-700';
  if (score < 70) return 'bg-orange-100 text-orange-700';
  if (score < 85) return 'bg-yellow-100 text-yellow-700';
  return 'bg-green-100 text-green-700';
};