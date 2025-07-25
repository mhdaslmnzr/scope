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
  {
    name: 'CyberSafe',
    criticality: 'High',
    score: 68,
    sector: 'Healthcare',
    country: 'UK',
    website: 'https://cybersafe.com',
    employeeCount: '1001-5000',
    revenue: '100M-500M',
    assetImportance: 'High',
    function: 'Patient Data Management',
    products: ['EMR System', 'Telehealth Platform'],
    globalFootprint: 'Europe',
    dataCenterRegion: 'EU West',
    internalDependencies: 12,
    certifications: 'HIPAA, SOC2',
    frameworks: 'HITRUST',
    edrAv: true,
    mdmByod: false,
    incidentResponsePlan: true,
    publicIp: '10.0.0.0/16',
    subdomains: 'portal.cybersafe.com, api.cybersafe.com',
    githubOrg: 'cybersafe-dev',
    complianceDoc: true,
    lastAuditDate: '2024-04-20',
    lastScan: '2024-06-11 09:00',
    lastAssessment: '2024-06-10',
    scores: { cybersecurity: 75, compliance: 80, geopolitical: 60, reputation: 55, aggregate: 68 },
    scoreDetails: [ { category: 'Vulnerability Management', score: 70, weight: 5 }, { category: 'Attack Surface', score: 80, weight: 5 }, { category: 'Web/App Security', score: 75, weight: 5 }, { category: 'Cloud & Infra', score: 80, weight: 5 }, { category: 'Email Security', score: 70, weight: 5 }, { category: 'Code Repo Exposure', score: 60, weight: 5 }, { category: 'Endpoint Hygiene', score: 75, weight: 5 }, { category: 'IOC & Infra Threat', score: 65, weight: 3 }, { category: 'Detection & Response', score: 80, weight: 2 }, { category: 'Certifications', score: 85, weight: 6 }, { category: 'Questionnaire Quality', score: 75, weight: 5 }, { category: 'Regulatory Violations', score: 80, weight: 5 }, { category: 'Privacy Compliance', score: 80, weight: 2 }, { category: 'Contractual Clauses', score: 75, weight: 2 }, { category: 'Country Risk', score: 60, weight: 6 }, { category: 'Sector Risk', score: 65, weight: 4 }, { category: 'Company Size', score: 70, weight: 3 }, { category: 'Infra Jurisdiction', score: 55, weight: 3 }, { category: 'Concentration Risk', score: 60, weight: 2 }, { category: 'Environmental Exposure', score: 65, weight: 2 }, { category: 'Data Breach History', score: 50, weight: 6 }, { category: 'Credential/Data Leaks', score: 60, weight: 5 }, { category: 'Brand Spoofing', score: 55, weight: 3 }, { category: 'Dark Web Presence', score: 45, weight: 3 }, { category: 'Social Sentiment', score: 60, weight: 3 }, ],
    breachChance: 0.45,
    questionnaires: { nist: true, sig: true, openfair: false },
    tags: ['Healthcare', 'HIPAA'],
  },
  {
    name: 'D Pharma',
    criticality: 'Medium',
    score: 82,
    sector: 'Pharma',
    country: 'India',
    website: 'https://dpharma.com',
    employeeCount: '5001-10000',
    revenue: '1B+',
    assetImportance: 'Medium',
    function: 'Drug Research',
    products: ['Research Platform'],
    globalFootprint: 'Asia, North America',
    dataCenterRegion: 'APAC',
    internalDependencies: 4,
    certifications: 'GXP, ISO 27001',
    frameworks: 'NIST',
    edrAv: false,
    mdmByod: false,
    incidentResponsePlan: true,
    publicIp: '172.16.0.0/12',
    subdomains: 'research.dpharma.com',
    githubOrg: 'd-pharma',
    complianceDoc: false,
    lastAuditDate: '2023-12-10',
    lastScan: '2024-06-05 18:00',
    lastAssessment: '2024-06-01',
    scores: { cybersecurity: 80, compliance: 85, geopolitical: 70, reputation: 90, aggregate: 82 },
    scoreDetails: [ { category: 'Vulnerability Management', score: 80, weight: 5 }, { category: 'Attack Surface', score: 85, weight: 5 }, { category: 'Web/App Security', score: 80, weight: 5 }, { category: 'Cloud & Infra', score: 85, weight: 5 }, { category: 'Email Security', score: 75, weight: 5 }, { category: 'Code Repo Exposure', score: 70, weight: 5 }, { category: 'Endpoint Hygiene', score: 80, weight: 5 }, { category: 'IOC & Infra Threat', score: 75, weight: 3 }, { category: 'Detection & Response', score: 85, weight: 2 }, { category: 'Certifications', score: 90, weight: 6 }, { category: 'Questionnaire Quality', score: 80, weight: 5 }, { category: 'Regulatory Violations', score: 85, weight: 5 }, { category: 'Privacy Compliance', score: 85, weight: 2 }, { category: 'Contractual Clauses', score: 80, weight: 2 }, { category: 'Country Risk', score: 70, weight: 6 }, { category: 'Sector Risk', score: 75, weight: 4 }, { category: 'Company Size', score: 80, weight: 3 }, { category: 'Infra Jurisdiction', score: 65, weight: 3 }, { category: 'Concentration Risk', score: 70, weight: 2 }, { category: 'Environmental Exposure', score: 75, weight: 2 }, { category: 'Data Breach History', score: 85, weight: 6 }, { category: 'Credential/Data Leaks', score: 90, weight: 5 }, { category: 'Brand Spoofing', score: 90, weight: 3 }, { category: 'Dark Web Presence', score: 80, weight: 3 }, { category: 'Social Sentiment', score: 95, weight: 3 }, ],
    breachChance: 0.18,
    questionnaires: { nist: true, sig: false, openfair: true },
    tags: ['Pharma', 'Research'],
  },
  {
    name: 'DataVault',
    criticality: 'Low',
    score: 91,
    sector: 'Cloud',
    country: 'Australia',
    website: 'https://datavault.io',
    employeeCount: '51-200',
    revenue: '5M-20M',
    assetImportance: 'Low',
    function: 'Cloud Storage',
    products: ['S3 Compatible Storage'],
    globalFootprint: 'Oceania',
    dataCenterRegion: 'AU East',
    internalDependencies: 25,
    certifications: 'SOC2, ISO 27001',
    frameworks: 'CIS Controls',
    edrAv: true,
    mdmByod: true,
    incidentResponsePlan: true,
    publicIp: '192.0.2.0/24',
    subdomains: 'storage.datavault.io',
    githubOrg: 'datavault-oss',
    complianceDoc: true,
    lastAuditDate: '2024-06-01',
    lastScan: '2024-06-12 11:00',
    lastAssessment: '2024-06-11',
    scores: { cybersecurity: 90, compliance: 95, geopolitical: 85, reputation: 92, aggregate: 91 },
    scoreDetails: [ { category: 'Vulnerability Management', score: 90, weight: 5 }, { category: 'Attack Surface', score: 95, weight: 5 }, { category: 'Web/App Security', score: 90, weight: 5 }, { category: 'Cloud & Infra', score: 95, weight: 5 }, { category: 'Email Security', score: 85, weight: 5 }, { category: 'Code Repo Exposure', score: 80, weight: 5 }, { category: 'Endpoint Hygiene', score: 90, weight: 5 }, { category: 'IOC & Infra Threat', score: 85, weight: 3 }, { category: 'Detection & Response', score: 95, weight: 2 }, { category: 'Certifications', score: 98, weight: 6 }, { category: 'Questionnaire Quality', score: 90, weight: 5 }, { category: 'Regulatory Violations', score: 95, weight: 5 }, { category: 'Privacy Compliance', score: 95, weight: 2 }, { category: 'Contractual Clauses', score: 90, weight: 2 }, { category: 'Country Risk', score: 85, weight: 6 }, { category: 'Sector Risk', score: 88, weight: 4 }, { category: 'Company Size', score: 90, weight: 3 }, { category: 'Infra Jurisdiction', score: 80, weight: 3 }, { category: 'Concentration Risk', score: 85, weight: 2 }, { category: 'Environmental Exposure', score: 90, weight: 2 }, { category: 'Data Breach History', score: 92, weight: 6 }, { category: 'Credential/Data Leaks', score: 95, weight: 5 }, { category: 'Brand Spoofing', score: 90, weight: 3 }, { category: 'Dark Web Presence', score: 85, weight: 3 }, { category: 'Social Sentiment', score: 98, weight: 3 }, ],
    breachChance: 0.09,
    questionnaires: { nist: true, sig: true, openfair: true },
    tags: ['Cloud', 'Storage'],
  },
  {
    name: 'InfraCloud',
    criticality: 'High',
    score: 72,
    sector: 'Infrastructure',
    country: 'USA',
    website: 'https://infracloud.com',
    employeeCount: '1001-5000',
    revenue: '200M-1B',
    assetImportance: 'Critical',
    function: 'IaaS Provider',
    products: ['Compute Instances', 'Managed Kubernetes'],
    globalFootprint: 'Global',
    dataCenterRegion: 'US West, EU Central',
    internalDependencies: 50,
    certifications: 'PCI DSS, ISO 27001, SOC2',
    frameworks: 'NIST, CIS Controls',
    edrAv: true,
    mdmByod: true,
    incidentResponsePlan: true,
    publicIp: '203.0.113.0/24',
    subdomains: 'console.infracloud.com, api.infracloud.com',
    githubOrg: 'infracloud-eng',
    complianceDoc: true,
    lastAuditDate: '2024-03-15',
    lastScan: '2024-06-12 01:00',
    lastAssessment: '2024-06-10',
    scores: { cybersecurity: 70, compliance: 75, geopolitical: 65, reputation: 80, aggregate: 72 },
    scoreDetails: [ { category: 'Vulnerability Management', score: 70, weight: 5 }, { category: 'Attack Surface', score: 75, weight: 5 }, { category: 'Web/App Security', score: 70, weight: 5 }, { category: 'Cloud & Infra', score: 75, weight: 5 }, { category: 'Email Security', score: 65, weight: 5 }, { category: 'Code Repo Exposure', score: 60, weight: 5 }, { category: 'Endpoint Hygiene', score: 70, weight: 5 }, { category: 'IOC & Infra Threat', score: 65, weight: 3 }, { category: 'Detection & Response', score: 75, weight: 2 }, { category: 'Certifications', score: 80, weight: 6 }, { category: 'Questionnaire Quality', score: 70, weight: 5 }, { category: 'Regulatory Violations', score: 75, weight: 5 }, { category: 'Privacy Compliance', score: 75, weight: 2 }, { category: 'Contractual Clauses', score: 70, weight: 2 }, { category: 'Country Risk', score: 65, weight: 6 }, { category: 'Sector Risk', score: 70, weight: 4 }, { category: 'Company Size', score: 75, weight: 3 }, { category: 'Infra Jurisdiction', score: 60, weight: 3 }, { category: 'Concentration Risk', score: 65, weight: 2 }, { category: 'Environmental Exposure', score: 70, weight: 2 }, { category: 'Data Breach History', score: 75, weight: 6 }, { category: 'Credential/Data Leaks', score: 80, weight: 5 }, { category: 'Brand Spoofing', score: 75, weight: 3 }, { category: 'Dark Web Presence', score: 70, weight: 3 }, { category: 'Social Sentiment', score: 85, weight: 3 }, ],
    breachChance: 0.33,
    questionnaires: { nist: true, sig: true, openfair: false },
    tags: ['IaaS', 'Critical'],
  },
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