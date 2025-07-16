'use client'

import { useState } from 'react'
import { Search, User, Shield, Users, FileText, BarChart3, Eye, AlertTriangle, Globe, TrendingUp, Bell, Activity, LineChart, Plus, X, ChevronLeft, ChevronRight, Upload, Building, MapPin, Users as UsersIcon, DollarSign, Server, Lock, Shield as ShieldIcon, Globe as GlobeIcon, FileText as FileTextIcon, ArrowLeft, RefreshCw, FileDown, FileUp, BarChart2, Pencil as EditIcon } from 'lucide-react'
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

import Sidebar from '../components/Sidebar';
import CybersecurityHome from '../components/intelligence/CybersecurityHome';
import VulnerabilitiesTable from '../components/intelligence/VulnerabilitiesTable';

const quickStats = [
  { label: 'Total Vendors', value: 42, icon: <Users className="w-5 h-5 text-blue-600" /> },
  { label: 'High Risk Vendors', value: 5, icon: <AlertTriangle className="w-5 h-5 text-red-600" /> },
  { label: 'Open Alerts', value: 3, icon: <Bell className="w-5 h-5 text-yellow-500" /> },
  { label: 'Last Scan', value: '2h ago', icon: <Activity className="w-5 h-5 text-green-600" /> },
]

const recentActivity = [
  { icon: <AlertTriangle className="w-4 h-4 text-red-500" />, text: 'Vendor "Acme Corp" flagged as High Risk', time: '5 min ago' },
  { icon: <Users className="w-4 h-4 text-blue-500" />, text: 'New vendor "CyberSafe" onboarded', time: '30 min ago' },
  { icon: <FileText className="w-4 h-4 text-green-500" />, text: 'Compliance report generated for "D Pharma"', time: '1 hr ago' },
  { icon: <Globe className="w-4 h-4 text-purple-500" />, text: 'Geopolitical risk updated for "Asia-Pacific"', time: '2 hr ago' },
]

const vendors = [
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
    scores: {
      cybersecurity: 48,
      compliance: 62,
      geopolitical: 55,
      reputation: 32,
      aggregate: 45,
    },
    scoreDetails: [
      { category: 'Vulnerability Management', score: 40, weight: 5 },
      { category: 'Attack Surface', score: 50, weight: 5 },
      { category: 'Web/App Security', score: 55, weight: 5 },
      { category: 'Cloud & Infra', score: 60, weight: 5 },
      { category: 'Email Security', score: 45, weight: 5 },
      { category: 'Code Repo Exposure', score: 30, weight: 5 },
      { category: 'Endpoint Hygiene', score: 50, weight: 5 },
      { category: 'IOC & Infra Threat', score: 35, weight: 3 },
      { category: 'Detection & Response', score: 60, weight: 2 },
      { category: 'Certifications', score: 70, weight: 6 },
      { category: 'Questionnaire Quality', score: 60, weight: 5 },
      { category: 'Regulatory Violations', score: 50, weight: 5 },
      { category: 'Privacy Compliance', score: 65, weight: 2 },
      { category: 'Contractual Clauses', score: 60, weight: 2 },
      { category: 'Country Risk', score: 55, weight: 6 },
      { category: 'Sector Risk', score: 50, weight: 4 },
      { category: 'Company Size', score: 60, weight: 3 },
      { category: 'Infra Jurisdiction', score: 55, weight: 3 },
      { category: 'Concentration Risk', score: 50, weight: 2 },
      { category: 'Environmental Exposure', score: 60, weight: 2 },
      { category: 'Data Breach History', score: 30, weight: 6 },
      { category: 'Credential/Data Leaks', score: 35, weight: 5 },
      { category: 'Brand Spoofing', score: 40, weight: 3 },
      { category: 'Dark Web Presence', score: 25, weight: 3 },
      { category: 'Social Sentiment', score: 30, weight: 3 },
    ],
    breachChance: 0.72,
    questionnaires: {
      nist: true,
      sig: false,
      openfair: true,
    },
  },
  {
    name: 'CyberSafe',
    criticality: 'High',
    score: 68,
    sector: 'Healthcare',
    country: 'UK',
    website: 'https://cybersafe.co.uk',
    employeeCount: '51-200',
    revenue: '1M-10M',
    assetImportance: 'High',
    function: 'Cloud Provider',
    products: ['Cloud Storage', 'Backup Service'],
    globalFootprint: 'Europe',
    dataCenterRegion: 'EU West',
    internalDependencies: 3,
    certifications: 'SOC2',
    frameworks: 'NIST',
    edrAv: true,
    mdmByod: false,
    incidentResponsePlan: true,
    publicIp: '10.0.0.0/24',
    subdomains: 'portal.cybersafe.co.uk',
    githubOrg: 'cybersafe/cloud',
    complianceDoc: false,
    lastAuditDate: '2024-04-20',
    lastScan: '2024-06-10 13:00',
    lastAssessment: '2024-06-08',
    scores: {
      cybersecurity: 70,
      compliance: 75,
      geopolitical: 65,
      reputation: 60,
      aggregate: 68,
    },
    scoreDetails: [
      { category: 'Vulnerability Management', score: 65, weight: 5 },
      { category: 'Attack Surface', score: 70, weight: 5 },
      { category: 'Web/App Security', score: 75, weight: 5 },
      { category: 'Cloud & Infra', score: 80, weight: 5 },
      { category: 'Email Security', score: 70, weight: 5 },
      { category: 'Code Repo Exposure', score: 60, weight: 5 },
      { category: 'Endpoint Hygiene', score: 70, weight: 5 },
      { category: 'IOC & Infra Threat', score: 65, weight: 3 },
      { category: 'Detection & Response', score: 75, weight: 2 },
      { category: 'Certifications', score: 80, weight: 6 },
      { category: 'Questionnaire Quality', score: 75, weight: 5 },
      { category: 'Regulatory Violations', score: 70, weight: 5 },
      { category: 'Privacy Compliance', score: 75, weight: 2 },
      { category: 'Contractual Clauses', score: 70, weight: 2 },
      { category: 'Country Risk', score: 65, weight: 6 },
      { category: 'Sector Risk', score: 70, weight: 4 },
      { category: 'Company Size', score: 60, weight: 3 },
      { category: 'Infra Jurisdiction', score: 65, weight: 3 },
      { category: 'Concentration Risk', score: 60, weight: 2 },
      { category: 'Environmental Exposure', score: 70, weight: 2 },
      { category: 'Data Breach History', score: 60, weight: 6 },
      { category: 'Credential/Data Leaks', score: 65, weight: 5 },
      { category: 'Brand Spoofing', score: 70, weight: 3 },
      { category: 'Dark Web Presence', score: 60, weight: 3 },
      { category: 'Social Sentiment', score: 65, weight: 3 },
    ],
    breachChance: 0.32,
    questionnaires: {
      nist: true,
      sig: true,
      openfair: false,
    },
  },
  {
    name: 'D Pharma',
    criticality: 'Medium',
    score: 82,
    sector: 'Pharma',
    country: 'India',
    website: 'https://dpharma.in',
    employeeCount: '1001-5000',
    revenue: '100M-1B',
    assetImportance: 'Medium',
    function: 'Service Provider',
    products: ['Clinical Trial Platform'],
    globalFootprint: 'Asia',
    dataCenterRegion: 'IN Central',
    internalDependencies: 2,
    certifications: 'ISO 27001',
    frameworks: 'NIST',
    edrAv: false,
    mdmByod: true,
    incidentResponsePlan: false,
    publicIp: '172.16.0.0/24',
    subdomains: 'portal.dpharma.in',
    githubOrg: 'dpharma/clinical',
    complianceDoc: true,
    lastAuditDate: '2024-03-10',
    lastScan: '2024-06-10 12:00',
    lastAssessment: '2024-06-07',
    scores: {
      cybersecurity: 85,
      compliance: 80,
      geopolitical: 78,
      reputation: 75,
      aggregate: 82,
    },
    scoreDetails: [
      { category: 'Vulnerability Management', score: 90, weight: 5 },
      { category: 'Attack Surface', score: 85, weight: 5 },
      { category: 'Web/App Security', score: 80, weight: 5 },
      { category: 'Cloud & Infra', score: 88, weight: 5 },
      { category: 'Email Security', score: 80, weight: 5 },
      { category: 'Code Repo Exposure', score: 85, weight: 5 },
      { category: 'Endpoint Hygiene', score: 80, weight: 5 },
      { category: 'IOC & Infra Threat', score: 78, weight: 3 },
      { category: 'Detection & Response', score: 80, weight: 2 },
      { category: 'Certifications', score: 80, weight: 6 },
      { category: 'Questionnaire Quality', score: 78, weight: 5 },
      { category: 'Regulatory Violations', score: 80, weight: 5 },
      { category: 'Privacy Compliance', score: 80, weight: 2 },
      { category: 'Contractual Clauses', score: 80, weight: 2 },
      { category: 'Country Risk', score: 78, weight: 6 },
      { category: 'Sector Risk', score: 80, weight: 4 },
      { category: 'Company Size', score: 80, weight: 3 },
      { category: 'Infra Jurisdiction', score: 78, weight: 3 },
      { category: 'Concentration Risk', score: 80, weight: 2 },
      { category: 'Environmental Exposure', score: 80, weight: 2 },
      { category: 'Data Breach History', score: 75, weight: 6 },
      { category: 'Credential/Data Leaks', score: 75, weight: 5 },
      { category: 'Brand Spoofing', score: 75, weight: 3 },
      { category: 'Dark Web Presence', score: 75, weight: 3 },
      { category: 'Social Sentiment', score: 75, weight: 3 },
    ],
    breachChance: 0.12,
    questionnaires: {
      nist: false,
      sig: true,
      openfair: true,
    },
  },
  {
    name: 'DataVault',
    criticality: 'Low',
    score: 91,
    sector: 'Cloud',
    country: 'Australia',
    website: 'https://datavault.au',
    employeeCount: '5000+',
    revenue: '1B+',
    assetImportance: 'Low',
    function: 'Infrastructure',
    products: ['Cloud Compute', 'Object Storage'],
    globalFootprint: 'Australia, New Zealand',
    dataCenterRegion: 'AU SouthEast',
    internalDependencies: 1,
    certifications: 'ISO 27001, PCI DSS',
    frameworks: 'NIST, ISO',
    edrAv: true,
    mdmByod: true,
    incidentResponsePlan: true,
    publicIp: '203.0.113.0/24',
    subdomains: 'console.datavault.au',
    githubOrg: 'datavault/cloud',
    complianceDoc: true,
    lastAuditDate: '2024-02-01',
    lastScan: '2024-06-10 11:00',
    lastAssessment: '2024-06-06',
    scores: {
      cybersecurity: 95,
      compliance: 90,
      geopolitical: 92,
      reputation: 88,
      aggregate: 91,
    },
    scoreDetails: [
      { category: 'Vulnerability Management', score: 95, weight: 5 },
      { category: 'Attack Surface', score: 92, weight: 5 },
      { category: 'Web/App Security', score: 90, weight: 5 },
      { category: 'Cloud & Infra', score: 94, weight: 5 },
      { category: 'Email Security', score: 90, weight: 5 },
      { category: 'Code Repo Exposure', score: 92, weight: 5 },
      { category: 'Endpoint Hygiene', score: 90, weight: 5 },
      { category: 'IOC & Infra Threat', score: 90, weight: 3 },
      { category: 'Detection & Response', score: 92, weight: 2 },
      { category: 'Certifications', score: 95, weight: 6 },
      { category: 'Questionnaire Quality', score: 90, weight: 5 },
      { category: 'Regulatory Violations', score: 90, weight: 5 },
      { category: 'Privacy Compliance', score: 90, weight: 2 },
      { category: 'Contractual Clauses', score: 90, weight: 2 },
      { category: 'Country Risk', score: 92, weight: 6 },
      { category: 'Sector Risk', score: 90, weight: 4 },
      { category: 'Company Size', score: 95, weight: 3 },
      { category: 'Infra Jurisdiction', score: 92, weight: 3 },
      { category: 'Concentration Risk', score: 90, weight: 2 },
      { category: 'Environmental Exposure', score: 90, weight: 2 },
      { category: 'Data Breach History', score: 88, weight: 6 },
      { category: 'Credential/Data Leaks', score: 90, weight: 5 },
      { category: 'Brand Spoofing', score: 88, weight: 3 },
      { category: 'Dark Web Presence', score: 88, weight: 3 },
      { category: 'Social Sentiment', score: 88, weight: 3 },
    ],
    breachChance: 0.05,
    questionnaires: {
      nist: true,
      sig: true,
      openfair: true,
    },
  },
]

const criticalityColors: Record<string, string> = {
  Critical: 'bg-red-100 text-red-700',
  High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-green-100 text-green-700',
}

const scoreColors = (score: number) => {
  if (score < 50) return 'bg-red-100 text-red-700';
  if (score < 70) return 'bg-orange-100 text-orange-700';
  if (score < 85) return 'bg-yellow-100 text-yellow-700';
  return 'bg-green-100 text-green-700';
}

// Helper for risk color
const riskColor = (score: number) => {
  if (score < 50) return 'bg-red-100 text-red-700 border-red-300';
  if (score < 70) return 'bg-orange-100 text-orange-700 border-orange-300';
  if (score < 85) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
  return 'bg-green-100 text-green-700 border-green-300';
};

// Explanations for each subcategory
const scoreExplanations: Record<string, string> = {
  'Vulnerability Management': 'Assesses open CVEs, patch cycles, and outdated software.',
  'Attack Surface': 'Evaluates open ports, misconfigured services, and exposed assets.',
  'Web/App Security': 'Checks TLS version, CMS exposure, and authentication endpoints.',
  'Cloud & Infra': 'Reviews S3 buckets, API security, and cloud config hygiene.',
  'Email Security': 'Checks SPF, DKIM, and DMARC presence.',
  'Code Repo Exposure': 'Detects hardcoded secrets and public GitHub leaks.',
  'Endpoint Hygiene': 'Assesses use of MDM, AV, and device control.',
  'IOC & Infra Threat': 'Looks for blacklisted IPs, C2 infrastructure, and threat feed matches.',
  'Detection & Response': 'Measures SOC readiness, IR plans, and logging coverage.',
  'Certifications': 'Considers ISO 27001, SOC2, NIST CSF, PCI DSS, etc.',
  'Questionnaire Quality': 'Evaluates depth and honesty in SIG/OpenFAIR/NIST documents.',
  'Regulatory Violations': 'Checks for sanctions, fines, or penalties from data protection bodies.',
  'Privacy Compliance': 'Assesses GDPR, HIPAA, CCPA alignment.',
  'Contractual Clauses': 'Checks encryption, MFA, audit rights in contracts.',
  'Country Risk': 'Considers political instability, sanctions, cyber laws, OFAC lists.',
  'Sector Risk': 'Industry classification (e.g., Finance = High risk).',
  'Company Size': 'Global footprint, employee size, asset sprawl.',
  'Infra Jurisdiction': 'Location of hosted systems and legal exposure.',
  'Concentration Risk': 'Critical vendor used across multiple internal systems.',
  'Environmental Exposure': 'Natural disaster risk at HQ or primary DC.',
  'Data Breach History': 'Known breaches, data loss events.',
  'Credential/Data Leaks': 'Leaked email/password, exposed keys.',
  'Brand Spoofing': 'Typosquatting, cloned sites, social spoofing.',
  'Dark Web Presence': 'Mentions in threat actor channels, paste dumps.',
  'Social Sentiment': 'Media coverage, defacements, hacktivist attention.',
};

// Pillar groupings
const pillarGroups = [
  {
    name: 'Cybersecurity',
    color: 'blue',
    keys: [
      'Vulnerability Management', 'Attack Surface', 'Web/App Security', 'Cloud & Infra', 'Email Security', 'Code Repo Exposure', 'Endpoint Hygiene', 'IOC & Infra Threat', 'Detection & Response',
    ],
  },
  {
    name: 'Compliance',
    color: 'green',
    keys: [
      'Certifications', 'Questionnaire Quality', 'Regulatory Violations', 'Privacy Compliance', 'Contractual Clauses',
    ],
  },
  {
    name: 'Geopolitical',
    color: 'purple',
    keys: [
      'Country Risk', 'Sector Risk', 'Company Size', 'Infra Jurisdiction', 'Concentration Risk', 'Environmental Exposure',
    ],
  },
  {
    name: 'Reputation',
    color: 'red',
    keys: [
      'Data Breach History', 'Credential/Data Leaks', 'Brand Spoofing', 'Dark Web Presence', 'Social Sentiment',
    ],
  },
];

// Calculation functions for scoring
function calculatePillarScore(scoreDetails, pillarCategories) {
  const items = scoreDetails.filter(item => pillarCategories.includes(item.category));
  const weightedSum = items.reduce((sum, item) => sum + item.score * item.weight, 0);
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}

function calculateAggregateScore(scoreDetails) {
  const weightedSum = scoreDetails.reduce((sum, item) => sum + item.score * item.weight, 0);
  const totalWeight = scoreDetails.reduce((sum, item) => sum + item.weight, 0);
  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}

function applyCriticalityMultiplier(aggregateScore, criticality) {
  const multipliers = {
    'Critical': 1.25,
    'High': 1.10,
    'Medium': 1.00,
    'Low': 0.85,
  };
  return Math.round(aggregateScore * (multipliers[criticality] || 1.0));
}

function VendorDetails({ vendor, onBack }: { vendor: any, onBack: () => void }) {
  const [editMode, setEditMode] = useState(false);
  const [notes, setNotes] = useState([
    { id: 1, text: 'Follow up on compliance docs before next assessment.', date: '2024-06-10' },
    { id: 2, text: 'Vendor flagged for high breach risk last quarter.', date: '2024-05-15' },
  ]);
  const [newNote, setNewNote] = useState('');
  const [tags, setTags] = useState(['Critical', 'Watchlist']);
  const [tagInput, setTagInput] = useState('');

  // Timeline events (mock)
  const timeline = [
    { date: vendor.lastAssessment, label: 'Last Assessment', icon: <BarChart3 className="w-4 h-4 text-blue-600" /> },
    { date: vendor.lastScan, label: 'Last Scan', icon: <Activity className="w-4 h-4 text-green-600" /> },
    { date: '2024-05-01', label: 'Breach Detected', icon: <AlertTriangle className="w-4 h-4 text-red-600" /> },
    { date: '2024-04-01', label: 'Onboarded', icon: <Users className="w-4 h-4 text-purple-600" /> },
  ];

  // Risk trend chart (mock)
  const trendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Aggregate Score',
        data: [60, 62, 65, 58, vendor.scores?.aggregate || 70, vendor.scores?.aggregate || 70],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.1)',
        tension: 0.4,
        pointRadius: 3,
      },
    ],
  };
  const trendOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { min: 0, max: 100, ticks: { stepSize: 20 } } },
  };

  // Calculate scores dynamically
  const cybersecurity = calculatePillarScore(vendor.scoreDetails, pillarGroups[0].keys);
  const compliance = calculatePillarScore(vendor.scoreDetails, pillarGroups[1].keys);
  const geopolitical = calculatePillarScore(vendor.scoreDetails, pillarGroups[2].keys);
  const reputation = calculatePillarScore(vendor.scoreDetails, pillarGroups[3].keys);
  const aggregate = calculateAggregateScore(vendor.scoreDetails);
  const aggregateWithMultiplier = applyCriticalityMultiplier(aggregate, vendor.criticality);

  // Only show 4 pillar cards, colored by risk
  const pillarScores = [
    { name: 'Cybersecurity', icon: <Shield className="w-6 h-6 mb-2" />, score: cybersecurity },
    { name: 'Compliance', icon: <FileText className="w-6 h-6 mb-2" />, score: compliance },
    { name: 'Geopolitical', icon: <Globe className="w-6 h-6 mb-2" />, score: geopolitical },
    { name: 'Reputation', icon: <AlertTriangle className="w-6 h-6 mb-2" />, score: reputation },
  ];

  // Group score details by pillar
  const groupedScores = pillarGroups.map(group => ({
    ...group,
    items: vendor.scoreDetails?.filter((item: any) => group.keys.includes(item.category)) || [],
  }));

  // Edit mode placeholder (can be expanded)
  if (editMode) {
    return (
      <div className="space-y-8">
        <button onClick={() => setEditMode(false)} className="flex items-center text-blue-600 hover:underline mb-2"><ArrowLeft className="w-4 h-4 mr-1" /> Back to Details</button>
        <div className="text-lg font-semibold text-gray-900">Edit Vendor (Coming Soon)</div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-6xl mx-auto px-4 py-8">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-2">
        <div className="flex items-center space-x-2">
          <button onClick={onBack} className="flex items-center text-blue-600 hover:underline"><ArrowLeft className="w-4 h-4 mr-1" /> Back</button>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2 ml-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>{vendor.name}</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${criticalityColors[vendor.criticality]}`}>{vendor.criticality}</span>
            <span className={`ml-2 px-3 py-1 rounded-full text-lg font-bold border ${riskColor(aggregateWithMultiplier)}`}>{aggregateWithMultiplier}</span>
          </h1>
          {/* Tags */}
          <div className="flex flex-wrap gap-2 ml-4">
            {tags.map(tag => (
              <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                {tag}
                <button onClick={() => setTags(tags.filter(t => t !== tag))} className="ml-1 text-blue-400 hover:text-blue-700">×</button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && tagInput.trim()) { setTags([...tags, tagInput.trim()]); setTagInput(''); }}}
              placeholder="Add tag"
              className="w-20 px-2 py-1 border border-gray-300 rounded-full text-xs focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex flex-col md:items-end gap-3 mt-4 md:mt-0">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Last Scan:</span>
            <span className="font-medium text-gray-900">{vendor.lastScan || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Last Assessment:</span>
            <span className="font-medium text-gray-900">{vendor.lastAssessment || 'N/A'}</span>
          </div>
          <div className="flex gap-2 mt-2">
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition text-sm"><RefreshCw className="w-4 h-4" /> <span>Reassess Now</span></button>
            <button onClick={() => setEditMode(true)} className="flex items-center space-x-2 border border-blue-600 text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-blue-50 transition text-sm"><EditIcon className="w-4 h-4" /> <span>Edit</span></button>
            <button className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition text-sm"><FileDown className="w-4 h-4" /> PDF</button>
            <button className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition text-sm"><FileDown className="w-4 h-4" /> CSV</button>
          </div>
        </div>
      </div>
      {/* 4 Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {pillarScores.map((pillar, idx) => (
          <div key={pillar.name} className={`rounded-2xl shadow-lg border p-8 flex flex-col items-center min-h-[140px] transition ${riskColor(pillar.score)} w-full`}> 
            {pillar.icon}
            <div className="text-2xl font-bold mb-1">{pillar.score}</div>
            <div className="text-sm text-gray-700 font-semibold">{pillar.name}</div>
          </div>
        ))}
      </div>
      {/* Breach Chance & Questionnaires */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 flex flex-col justify-center min-h-[120px]">
          <div className="flex items-center mb-2">
            <Lock className="w-5 h-5 text-red-600 mr-2" />
            <span className="font-semibold text-gray-900">Chances of Breach</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-200 rounded-full h-4">
              <div className="bg-red-600 h-4 rounded-full transition-all duration-300" style={{ width: `${Math.round((vendor.breachChance || 0) * 100)}%` }}></div>
            </div>
            <span className="text-lg font-bold text-red-600">{Math.round((vendor.breachChance || 0) * 100)}%</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 flex flex-col gap-3 justify-center min-h-[120px]">
          <div className="font-semibold text-gray-900 mb-2 flex items-center"><FileText className="w-5 h-5 text-blue-600 mr-2" />Questionnaires</div>
          <div className="flex gap-3">
            <button className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition ${vendor.questionnaires?.nist ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>{vendor.questionnaires?.nist ? <FileDown className="w-4 h-4" /> : <FileUp className="w-4 h-4" />}NIST SP</button>
            <button className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition ${vendor.questionnaires?.sig ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>{vendor.questionnaires?.sig ? <FileDown className="w-4 h-4" /> : <FileUp className="w-4 h-4" />}SIG</button>
            <button className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition ${vendor.questionnaires?.openfair ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>{vendor.questionnaires?.openfair ? <FileDown className="w-4 h-4" /> : <FileUp className="w-4 h-4" />}OpenFAIR</button>
          </div>
        </div>
      </div>
      {/* Timeline & Risk Trend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Timeline */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="font-semibold text-gray-900 mb-4 flex items-center"><Activity className="w-5 h-5 text-blue-600 mr-2" />Vendor History</div>
          <ol className="relative border-l-2 border-blue-200 ml-2">
            {timeline.map((event, idx) => (
              <li key={idx} className="mb-6 ml-4">
                <div className="absolute -left-5 flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full border-2 border-blue-300">{event.icon}</div>
                <div className="pl-6">
                  <div className="text-xs text-gray-400">{event.date}</div>
                  <div className="font-medium text-gray-900">{event.label}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
        {/* Risk Trend Chart */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 flex flex-col items-center">
          <div className="font-semibold text-gray-900 mb-4 flex items-center"><LineChart className="w-5 h-5 text-blue-600 mr-2" />Risk Trend</div>
          <div className="w-full h-40">
            <Line data={trendData} options={trendOptions} />
          </div>
        </div>
      </div>
      {/* Score Breakdown - grouped by pillar, always open, explanations always visible */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6">
        <div className="font-semibold text-gray-900 mb-4 flex items-center"><BarChart3 className="w-5 h-5 text-blue-600 mr-2" />Score Breakdown</div>
        <div className="divide-y divide-gray-100">
          {groupedScores.map((group) => (
            <div key={group.name}>
              <div className="py-3 px-2 text-left font-semibold text-lg text-blue-700 flex items-center gap-2">{group.name}</div>
              <table className="min-w-full text-sm mb-4">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left font-semibold text-gray-500">Category</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-500">Score</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-500">Weight (%)</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-500">Explanation</th>
                  </tr>
                </thead>
                <tbody>
                  {group.items.map((item: any) => (
                    <tr key={item.category} className="border-b last:border-b-0">
                      <td className="px-4 py-2 text-gray-700 whitespace-nowrap">{item.category}</td>
                      <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">{item.score}</td>
                      <td className="px-4 py-2 text-gray-500 whitespace-nowrap">{item.weight}</td>
                      <td className="px-4 py-2 text-blue-900 text-xs bg-blue-50 rounded">{scoreExplanations[item.category] || 'No explanation available.'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
      {/* Vendor Info & Edit */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-gray-900 flex items-center"><UsersIcon className="w-5 h-5 text-blue-600 mr-2" />Vendor Information</div>
          <button onClick={() => setEditMode(true)} className="flex items-center space-x-2 border border-blue-600 text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-blue-50 transition text-sm"><EditIcon className="w-4 h-4" /> <span>Edit</span></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><span className="text-gray-500">Name:</span> <span className="font-medium text-gray-900">{vendor.name}</span></div>
          <div><span className="text-gray-500">Country:</span> <span className="font-medium text-gray-900">{vendor.country}</span></div>
          <div><span className="text-gray-500">Industry:</span> <span className="font-medium text-gray-900">{vendor.sector}</span></div>
          <div><span className="text-gray-500">Website:</span> <a href={vendor.website} className="font-medium text-blue-700 underline" target="_blank" rel="noopener noreferrer">{vendor.website}</a></div>
          <div><span className="text-gray-500">Employee Count:</span> <span className="font-medium text-gray-900">{vendor.employeeCount || 'N/A'}</span></div>
          <div><span className="text-gray-500">Annual Revenue:</span> <span className="font-medium text-gray-900">{vendor.revenue || 'N/A'}</span></div>
          <div><span className="text-gray-500">Asset Importance:</span> <span className="font-medium text-gray-900">{vendor.assetImportance || 'N/A'}</span></div>
          <div><span className="text-gray-500">Function:</span> <span className="font-medium text-gray-900">{vendor.function || 'N/A'}</span></div>
          <div><span className="text-gray-500">Products Used:</span> <span className="font-medium text-gray-900">{vendor.products?.join(', ') || 'N/A'}</span></div>
          <div><span className="text-gray-500">Global Footprint:</span> <span className="font-medium text-gray-900">{vendor.globalFootprint || 'N/A'}</span></div>
          <div><span className="text-gray-500">Data Center Region:</span> <span className="font-medium text-gray-900">{vendor.dataCenterRegion || 'N/A'}</span></div>
          <div><span className="text-gray-500">Internal Dependencies:</span> <span className="font-medium text-gray-900">{vendor.internalDependencies || 'N/A'}</span></div>
          <div><span className="text-gray-500">Certifications:</span> <span className="font-medium text-gray-900">{vendor.certifications || 'N/A'}</span></div>
          <div><span className="text-gray-500">Frameworks:</span> <span className="font-medium text-gray-900">{vendor.frameworks || 'N/A'}</span></div>
          <div><span className="text-gray-500">EDR/AV:</span> <span className="font-medium text-gray-900">{vendor.edrAv ? 'Yes' : 'No'}</span></div>
          <div><span className="text-gray-500">MDM/BYOD:</span> <span className="font-medium text-gray-900">{vendor.mdmByod ? 'Yes' : 'No'}</span></div>
          <div><span className="text-gray-500">Incident Response Plan:</span> <span className="font-medium text-gray-900">{vendor.incidentResponsePlan ? 'Yes' : 'No'}</span></div>
          <div><span className="text-gray-500">Public IP:</span> <span className="font-medium text-gray-900">{vendor.publicIp || 'N/A'}</span></div>
          <div><span className="text-gray-500">Known Subdomains:</span> <span className="font-medium text-gray-900">{vendor.subdomains || 'N/A'}</span></div>
          <div><span className="text-gray-500">GitHub Org:</span> <span className="font-medium text-gray-900">{vendor.githubOrg || 'N/A'}</span></div>
          <div><span className="text-gray-500">Compliance Document:</span> <span className="font-medium text-gray-900">{vendor.complianceDoc ? 'Yes' : 'No'}</span></div>
          <div><span className="text-gray-500">Last Audit Date:</span> <span className="font-medium text-gray-900">{vendor.lastAuditDate || 'N/A'}</span></div>
        </div>
      </div>
      {/* Notes/Comments */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6">
        <div className="font-semibold text-gray-900 mb-4 flex items-center"><FileText className="w-5 h-5 text-blue-600 mr-2" />Internal Notes & Comments</div>
        <ul className="mb-4 space-y-2">
          {notes.map(note => (
            <li key={note.id} className="flex items-center justify-between bg-blue-50 rounded px-3 py-2">
              <span className="text-sm text-gray-800">{note.text}</span>
              <span className="text-xs text-gray-400 ml-2">{note.date}</span>
              <button onClick={() => setNotes(notes.filter(n => n.id !== note.id))} className="ml-2 text-red-400 hover:text-red-700 text-xs">Delete</button>
            </li>
          ))}
        </ul>
        <form onSubmit={e => { e.preventDefault(); if (newNote.trim()) { setNotes([...notes, { id: Date.now(), text: newNote, date: new Date().toISOString().slice(0, 10) }]); setNewNote(''); }}} className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
            placeholder="Add a note..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">Add</button>
        </form>
      </div>
    </div>
  );
}

function VendorsTable({ onSelect }: { onSelect: (vendor: any) => void }) {
  const [showModal, setShowModal] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    vendorName: '', country: '', industry: '', website: '',
    employeeCount: '', annualRevenue: '', globalFootprint: '', dataCenterRegion: '',
    assetImportance: '', vendorFunction: '', internalDependencies: '',
    certifications: '', frameworks: '', edrAv: false, mdmByod: false, incidentResponsePlan: false,
    publicIp: '', subdomains: '', githubOrg: '',
    complianceDoc: null, lastAuditDate: ''
  })
  const [search, setSearch] = useState('');
  const [criticalityFilter, setCriticalityFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');

  // Add mock tags to vendors if not present
  const vendorsWithTags = vendors.map(v => ({
    ...v,
    tags: v.tags || (v.criticality === 'Critical' ? ['Critical', 'Watchlist'] : v.criticality === 'High' ? ['High'] : v.criticality === 'Medium' ? ['Medium'] : ['Low'])
  }));

  const filteredVendors = vendorsWithTags.filter(v =>
    (!search || v.name.toLowerCase().includes(search.toLowerCase())) &&
    (!criticalityFilter || v.criticality === criticalityFilter) &&
    (!sectorFilter || v.sector === sectorFilter) &&
    (!countryFilter || v.country === countryFilter)
  );

  const steps = [
    { title: 'Basic Information', icon: <Building className="w-5 h-5" /> },
    { title: 'Business Context', icon: <DollarSign className="w-5 h-5" /> },
    { title: 'Asset Criticality', icon: <Server className="w-5 h-5" /> },
    { title: 'Security Posture', icon: <ShieldIcon className="w-5 h-5" /> },
    { title: 'Infrastructure', icon: <GlobeIcon className="w-5 h-5" /> },
    { title: 'Compliance', icon: <FileTextIcon className="w-5 h-5" /> }
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = () => {
    setShowModal(false)
    setCurrentStep(1)
    setFormData({
      vendorName: '', country: '', industry: '', website: '',
      employeeCount: '', annualRevenue: '', globalFootprint: '', dataCenterRegion: '',
      assetImportance: '', vendorFunction: '', internalDependencies: '',
      certifications: '', frameworks: '', edrAv: false, mdmByod: false, incidentResponsePlan: false,
      publicIp: '', subdomains: '', githubOrg: '',
      complianceDoc: null, lastAuditDate: ''
    })
  }

  return (
    <div className="p-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <Users className="w-6 h-6 text-blue-600" />
          <span>Vendors</span>
        </h1>
        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="text"
            placeholder="Search vendors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48"
          />
          <select value={criticalityFilter} onChange={e => setCriticalityFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">All Criticality</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select value={sectorFilter} onChange={e => setSectorFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">All Sectors</option>
            <option value="Finance">Finance</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Pharma">Pharma</option>
            <option value="Cloud">Cloud</option>
            <option value="Technology">Technology</option>
            <option value="Service Provider">Service Provider</option>
            <option value="Infrastructure">Infrastructure</option>
          </select>
          <select value={countryFilter} onChange={e => setCountryFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">All Countries</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            <option value="India">India</option>
            <option value="Australia">Australia</option>
            <option value="Canada">Canada</option>
          </select>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Vendor</span>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vendor Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Criticality</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Risk Score</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sector</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Country</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tags</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredVendors.map((vendor, idx) => (
              <tr key={vendor.name} className="hover:bg-gray-50 cursor-pointer" onClick={() => onSelect(vendor)}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{vendor.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${criticalityColors[vendor.criticality]}`}>{vendor.criticality}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${scoreColors(vendor.score)}`}>{vendor.score}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{vendor.sector}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{vendor.country}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {vendor.tags.map((tag: string) => (
                      <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">{tag}</span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {filteredVendors.length === 0 && (
              <tr><td colSpan={6} className="text-center text-gray-400 py-8">No vendors found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Add Vendor Modal (same as before) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Add New Vendor</h2>
              </div>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowModal(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className={`flex items-center space-x-2 ${idx + 1 <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        idx + 1 < currentStep ? 'bg-blue-600 text-white' :
                        idx + 1 === currentStep ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-200 text-gray-400'
                      }`}>
                        {idx + 1 < currentStep ? '✓' : idx + 1}
                      </div>
                      <span className="hidden sm:block text-sm font-medium">{step.title}</span>
                    </div>
                    {idx < steps.length - 1 && (
                      <div className={`w-8 h-1 mx-2 ${idx + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <Building className="w-5 h-5 text-blue-600" />
                      <span>Basic Vendor Identification</span>
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">Provide essential vendor information for risk assessment</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Name *</label>
                      <input
                        type="text"
                        value={formData.vendorName}
                        onChange={(e) => handleInputChange('vendorName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter vendor name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country of Operation *</label>
                      <select
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select country</option>
                        <option value="USA">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="India">India</option>
                        <option value="Australia">Australia</option>
                        <option value="Canada">Canada</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Industry / Sector *</label>
                      <select
                        value={formData.industry}
                        onChange={(e) => handleInputChange('industry', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select industry</option>
                        <option value="Finance">Finance</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Pharma">Pharmaceuticals</option>
                        <option value="Cloud">Cloud Services</option>
                        <option value="Technology">Technology</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Website / Domain *</label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                      <span>Business & Operational Context</span>
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">Provide business context for geopolitical and sector risk assessment</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Employee Count *</label>
                      <select
                        value={formData.employeeCount}
                        onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select range</option>
                        <option value="1-50">1-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-1000">201-1000 employees</option>
                        <option value="1001-5000">1001-5000 employees</option>
                        <option value="5000+">5000+ employees</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Annual Revenue (Optional)</label>
                      <select
                        value={formData.annualRevenue}
                        onChange={(e) => handleInputChange('annualRevenue', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select range</option>
                        <option value="<1M">Less than $1M</option>
                        <option value="1M-10M">$1M - $10M</option>
                        <option value="10M-100M">$10M - $100M</option>
                        <option value="100M-1B">$100M - $1B</option>
                        <option value="1B+">$1B+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Global Footprint (Optional)</label>
                      <input
                        type="text"
                        value={formData.globalFootprint}
                        onChange={(e) => handleInputChange('globalFootprint', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., North America, Europe, Asia"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Data Center / Cloud Region (Optional)</label>
                      <input
                        type="text"
                        value={formData.dataCenterRegion}
                        onChange={(e) => handleInputChange('dataCenterRegion', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., US East, EU West"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <Server className="w-5 h-5 text-blue-600" />
                      <span>Asset Dependency & Criticality</span>
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">Define the importance and function of this vendor</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Asset Importance *</label>
                      <select
                        value={formData.assetImportance}
                        onChange={(e) => handleInputChange('assetImportance', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select criticality</option>
                        <option value="Critical">Critical (1.25x multiplier)</option>
                        <option value="High">High (1.10x multiplier)</option>
                        <option value="Medium">Medium (1.00x multiplier)</option>
                        <option value="Low">Low (0.85x multiplier)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Function of Vendor *</label>
                      <select
                        value={formData.vendorFunction}
                        onChange={(e) => handleInputChange('vendorFunction', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select function</option>
                        <option value="Data Processor">Data Processor</option>
                        <option value="Cloud Provider">Cloud Provider</option>
                        <option value="Software Vendor">Software Vendor</option>
                        <option value="Service Provider">Service Provider</option>
                        <option value="Infrastructure">Infrastructure</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2"># of Internal Dependencies (Optional)</label>
                      <input
                        type="number"
                        value={formData.internalDependencies}
                        onChange={(e) => handleInputChange('internalDependencies', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Number of internal systems that depend on this vendor"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <ShieldIcon className="w-5 h-5 text-blue-600" />
                      <span>Security Posture (Self-attested)</span>
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">Provide security posture information for compliance scoring</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Certifications (Optional)</label>
                      <input
                        type="text"
                        value={formData.certifications}
                        onChange={(e) => handleInputChange('certifications', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., ISO 27001, SOC2, PCI DSS"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Frameworks Followed (Optional)</label>
                      <input
                        type="text"
                        value={formData.frameworks}
                        onChange={(e) => handleInputChange('frameworks', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., NIST, CIS Controls"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="edrAv"
                          checked={formData.edrAv}
                          onChange={(e) => handleInputChange('edrAv', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="edrAv" className="text-sm font-medium text-gray-700">Use of EDR/AV</label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="mdmByod"
                          checked={formData.mdmByod}
                          onChange={(e) => handleInputChange('mdmByod', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="mdmByod" className="text-sm font-medium text-gray-700">MDM / BYOD Management</label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="incidentResponsePlan"
                          checked={formData.incidentResponsePlan}
                          onChange={(e) => handleInputChange('incidentResponsePlan', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="incidentResponsePlan" className="text-sm font-medium text-gray-700">Incident Response Plan</label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <GlobeIcon className="w-5 h-5 text-blue-600" />
                      <span>Exposed Infrastructure Details</span>
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">Provide infrastructure details for OSINT scanning (all optional)</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Public IP / CIDR</label>
                      <input
                        type="text"
                        value={formData.publicIp}
                        onChange={(e) => handleInputChange('publicIp', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 192.168.1.0/24"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Known Subdomains</label>
                      <input
                        type="text"
                        value={formData.subdomains}
                        onChange={(e) => handleInputChange('subdomains', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., api.example.com, admin.example.com"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Org / Repo</label>
                      <input
                        type="text"
                        value={formData.githubOrg}
                        onChange={(e) => handleInputChange('githubOrg', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., company-name/repo-name"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 6 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <FileTextIcon className="w-5 h-5 text-blue-600" />
                      <span>Compliance Questionnaire Upload</span>
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">Upload compliance documents for deep analysis (optional)</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload SIG/NIST/OpenFAIR Document</label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition">
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                              <span>Upload a file</span>
                              <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Last Completed Audit</label>
                      <input
                        type="date"
                        value={formData.lastAuditDate}
                        onChange={(e) => handleInputChange('lastAuditDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                  currentStep === 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition"
                >
                  Cancel
                </button>
                {currentStep === 6 ? (
                  <button
                    onClick={handleSubmit}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    <span>Add Vendor</span>
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const [view, setView] = useState<'dashboard' | 'vendors' | 'intelligence' | 'reports'>('dashboard');
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);
  const [selectedSubItem, setSelectedSubItem] = useState<string | null>(null);

  // In the Dashboard component, add state for selected intelligence subsection:
  const [selectedIntelligence, setSelectedIntelligence] = useState<{ pillar: string, item: string } | null>(null);

  // In the Dashboard view, before rendering, calculate the scores for the first vendor:
  const dashboardVendor = vendors[0];
  const dashboardCybersecurity = calculatePillarScore(dashboardVendor.scoreDetails, pillarGroups[0].keys);
  const dashboardCompliance = calculatePillarScore(dashboardVendor.scoreDetails, pillarGroups[1].keys);
  const dashboardGeopolitical = calculatePillarScore(dashboardVendor.scoreDetails, pillarGroups[2].keys);
  const dashboardReputation = calculatePillarScore(dashboardVendor.scoreDetails, pillarGroups[3].keys);
  const dashboardAggregate = calculateAggregateScore(dashboardVendor.scoreDetails);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        view={view}
        setView={setView}
        selectedPillar={selectedPillar}
        setSelectedPillar={setSelectedPillar}
        selectedSubItem={selectedSubItem}
        setSelectedSubItem={setSelectedSubItem}
        setSelectedVendor={setSelectedVendor}
      />
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search vendors, reports..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            {/* User Info */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">John Smith</div>
                  <div className="text-xs text-gray-500">D Pharma</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="flex-1 p-6 space-y-8">
          {view === 'dashboard' && !selectedVendor && (
            <>
              {/* Quick Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                {quickStats.map((stat, idx) => (
                  <div key={stat.label} className="flex items-center bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-3 space-x-3 min-h-[64px]">
                    <div>{stat.icon}</div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                      <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-2">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Risk Overview</h1>
                <p className="text-gray-600">Monitor your vendor cybersecurity posture across all risk pillars</p>
              </div>

              {/* 4 Pillar Boxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-2">
                {/* Cybersecurity Posture */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between min-h-[220px] transition-transform hover:shadow-lg hover:-translate-y-1">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-6 h-6 text-blue-600" />
                      </div>
                      <span className="text-2xl font-bold text-blue-600">{dashboardCybersecurity}%</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Cybersecurity Posture</h3>
                    <p className="text-sm text-gray-600 mb-4">External attack surface, technical controls, threat readiness</p>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-600 h-3 rounded-full transition-all duration-300" style={{ width: `${dashboardCybersecurity}%` }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{dashboardCybersecurity}</span>
                  </div>
                </div>

                {/* Compliance & Legal Risk */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between min-h-[220px] transition-transform hover:shadow-lg hover:-translate-y-1">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-green-600" />
                      </div>
                      <span className="text-2xl font-bold text-green-600">{dashboardCompliance}%</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Compliance & Legal</h3>
                    <p className="text-sm text-gray-600 mb-4">Standards adherence, regulatory compliance, legal posture</p>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div className="bg-green-600 h-3 rounded-full transition-all duration-300" style={{ width: `${dashboardCompliance}%` }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{dashboardCompliance}</span>
                  </div>
                </div>

                {/* Geopolitical & Sector Risk */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between min-h-[220px] transition-transform hover:shadow-lg hover:-translate-y-1">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Globe className="w-6 h-6 text-purple-600" />
                      </div>
                      <span className="text-2xl font-bold text-purple-600">{dashboardGeopolitical}%</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Geopolitical & Sector</h3>
                    <p className="text-sm text-gray-600 mb-4">Regional stability, industry risk, infrastructure jurisdiction</p>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div className="bg-purple-600 h-3 rounded-full transition-all duration-300" style={{ width: `${dashboardGeopolitical}%` }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{dashboardGeopolitical}</span>
                  </div>
                </div>

                {/* Reputation & Exposure */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between min-h-[220px] transition-transform hover:shadow-lg hover:-translate-y-1">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                      </div>
                      <span className="text-2xl font-bold text-red-600">{dashboardReputation}%</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Reputation & Exposure</h3>
                    <p className="text-sm text-gray-600 mb-4">Breach history, credential leaks, brand spoofing</p>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div className="bg-red-600 h-3 rounded-full transition-all duration-300" style={{ width: `${dashboardReputation}%` }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{dashboardReputation}</span>
                  </div>
                </div>
              </div>

              {/* Risk Trend Chart & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Risk Trend Chart Placeholder */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between min-h-[180px]">
                  <div className="flex items-center space-x-3 mb-4">
                    <LineChart className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Risk Trend</h2>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">(Trend chart coming soon)</span>
                  </div>
                </div>
                {/* Recent Activity Feed */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[180px]">
                  <div className="flex items-center space-x-3 mb-4">
                    <TrendingUp className="w-5 h-5 text-gray-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                  </div>
                  <ul className="divide-y divide-gray-100">
                    {recentActivity.map((item, idx) => (
                      <li key={idx} className="flex items-center py-2 space-x-3">
                        <div>{item.icon}</div>
                        <div className="flex-1 text-sm text-gray-700">{item.text}</div>
                        <div className="text-xs text-gray-400">{item.time}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
          {view === 'vendors' && !selectedVendor && <VendorsTable onSelect={setSelectedVendor} />}
          {view === 'vendors' && selectedVendor && <VendorDetails vendor={selectedVendor} onBack={() => setSelectedVendor(null)} />}
          {view === 'intelligence' && selectedPillar === 'Cybersecurity' && !selectedSubItem && <CybersecurityHome />}
          {view === 'intelligence' && selectedPillar && selectedPillar !== 'Cybersecurity' && !selectedSubItem && <PillarHome pillar={selectedPillar} />}
          {view === 'intelligence' && selectedPillar && selectedSubItem && !(selectedPillar === 'Cybersecurity' && selectedSubItem === 'Vulnerabilities') && <IntelligenceComingSoon pillar={selectedPillar} item={selectedSubItem} />}
          {view === 'intelligence' && selectedPillar === 'Cybersecurity' && selectedSubItem === 'Vulnerabilities' && <VulnerabilitiesTable />}
          {view === 'reports' && (
            <ReportsTable />
          )}
        </div>
      </div>
    </div>
  )
}

function ReportsTable() {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [vendorFilter, setVendorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const reports = [
    { name: 'Acme Q2 Risk', type: 'Risk', vendor: 'Acme Corp', date: '2024-06-10', status: 'Completed' },
    { name: 'CyberSafe Compliance', type: 'Compliance', vendor: 'CyberSafe', date: '2024-06-09', status: 'In Progress' },
    { name: 'D Pharma Geopolitical', type: 'Geopolitical', vendor: 'D Pharma', date: '2024-06-08', status: 'Completed' },
    { name: 'DataVault Reputation', type: 'Reputation', vendor: 'DataVault', date: '2024-06-07', status: 'Completed' },
  ];

  const filteredReports = reports.filter(r =>
    (!search || r.name.toLowerCase().includes(search.toLowerCase())) &&
    (!typeFilter || r.type === typeFilter) &&
    (!vendorFilter || r.vendor === vendorFilter) &&
    (!statusFilter || r.status === statusFilter) &&
    (!dateFilter || r.date === dateFilter)
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <FileText className="w-6 h-6 text-blue-600" />
          <span>Reports</span>
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Report</span>
        </button>
      </div>
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search reports..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48"
        />
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
          <option value="">All Types</option>
          <option value="Risk">Risk</option>
          <option value="Compliance">Compliance</option>
          <option value="Geopolitical">Geopolitical</option>
          <option value="Reputation">Reputation</option>
        </select>
        <select value={vendorFilter} onChange={e => setVendorFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
          <option value="">All Vendors</option>
          <option value="Acme Corp">Acme Corp</option>
          <option value="CyberSafe">CyberSafe</option>
          <option value="D Pharma">D Pharma</option>
          <option value="DataVault">DataVault</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
          <option value="">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="In Progress">In Progress</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Report Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vendor</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredReports.map((report, idx) => (
              <tr key={report.name} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{report.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{report.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{report.vendor}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{report.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${report.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{report.status}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                  <button className="text-blue-600 hover:underline text-sm">View</button>
                  <button className="text-gray-600 hover:underline text-sm">Download</button>
                  <button className="text-red-600 hover:underline text-sm">Delete</button>
                </td>
              </tr>
            ))}
            {filteredReports.length === 0 && (
              <tr><td colSpan={6} className="text-center text-gray-400 py-8">No reports found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Create Report Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Create New Report</h2>
              </div>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Name</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Enter report name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>Risk</option>
                  <option>Compliance</option>
                  <option>Geopolitical</option>
                  <option>Reputation</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>Acme Corp</option>
                  <option>CyberSafe</option>
                  <option>D Pharma</option>
                  <option>DataVault</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
            <div className="flex justify-end gap-2 p-6 border-t border-gray-200">
              <button className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 

function PillarHome({ pillar }: { pillar: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-32">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl font-bold text-gray-900">{pillar} Intelligence</span>
      </div>
      <div className="bg-blue-50 text-blue-700 px-6 py-4 rounded-xl shadow text-lg font-semibold">Pillar Overview Coming Soon</div>
      <div className="mt-4 text-gray-500">This page will show an overview and analytics for <span className="font-bold">{pillar}</span> intelligence.</div>
    </div>
  );
}

function IntelligenceComingSoon({ pillar, item }: { pillar: string, item: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-32">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl font-bold text-gray-900">{pillar} - {item}</span>
      </div>
      <div className="bg-blue-50 text-blue-700 px-6 py-4 rounded-xl shadow text-lg font-semibold">Coming Soon</div>
      <div className="mt-4 text-gray-500">This page will show detailed intelligence for <span className="font-bold">{item}</span> under <span className="font-bold">{pillar}</span>.</div>
    </div>
  );
}