'use client'

import { useState } from 'react'
import { Search, User, Shield, Users, FileText, BarChart3, Eye, AlertTriangle, Globe, TrendingUp, Bell, Activity, LineChart, Plus, X, ChevronLeft, ChevronRight, Upload, Building, MapPin, Users as UsersIcon, DollarSign, Server, Lock, Shield as ShieldIcon, Globe as GlobeIcon, FileText as FileTextIcon, ArrowLeft, RefreshCw, FileDown, FileUp, BarChart2, Pencil as EditIcon } from 'lucide-react'
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

import Sidebar from '../components/Sidebar';
import VendorsTable from '../components/VendorsTable';
import VendorComparison from '../components/VendorComparison';
import Card from '../components/ui/Card';
import Sparkline from '../components/ui/Sparkline';
import { vendors } from '../mock-data';

// Intelligence Page Components
import CybersecurityHome from '../components/intelligence/CybersecurityHome';
import ComplianceHome from '../components/intelligence/ComplianceHome';
import GeopoliticalHome from '../components/intelligence/GeopoliticalHome';
import ReputationHome from '../components/intelligence/ReputationHome';
import VulnerabilitiesTable from '../components/intelligence/VulnerabilitiesTable';
import AttackSurfaceTable from '../components/intelligence/AttackSurfaceTable';
import WebAppSecurityTable from '../components/intelligence/WebAppSecurityTable';
import CloudInfraTable from '../components/intelligence/CloudInfraTable';
import EmailSecurityTable from '../components/intelligence/EmailSecurityTable';
import CodeRepoExposureTable from '../components/intelligence/CodeRepoExposureTable';
import EndpointHygieneTable from '../components/intelligence/EndpointHygieneTable';
import IOCInfraThreatTable from '../components/intelligence/IOCInfraThreatTable';
import DetectionResponseTable from '../components/intelligence/DetectionResponseTable';
import CertificationsTable from '../components/intelligence/CertificationsTable';
import QuestionnaireResultsTable from '../components/intelligence/QuestionnaireResultsTable';
import RegulatoryViolationsTable from '../components/intelligence/RegulatoryViolationsTable';
import PrivacyComplianceTable from '../components/intelligence/PrivacyComplianceTable';
import ContractualClausesTable from '../components/intelligence/ContractualClausesTable';
import CountryRiskTable from '../components/intelligence/CountryRiskTable';
import SectorRiskTable from '../components/intelligence/SectorRiskTable';
import CompanySizeTable from '../components/intelligence/CompanySizeTable';
import InfraJurisdictionTable from '../components/intelligence/InfraJurisdictionTable';
import ConcentrationRiskTable from '../components/intelligence/ConcentrationRiskTable';
import EnvironmentalExposureTable from '../components/intelligence/EnvironmentalExposureTable';
import DataBreachHistoryTable from '../components/intelligence/DataBreachHistoryTable';
import CredentialDataLeaksTable from '../components/intelligence/CredentialDataLeaksTable';
import BrandSpoofingTable from '../components/intelligence/BrandSpoofingTable';
import DarkWebPresenceTable from '../components/intelligence/DarkWebPresenceTable';
import SocialSentimentTable from '../components/intelligence/SocialSentimentTable';

const quickStats = [
  { label: 'Total Vendors', value: 42, icon: <Users className="w-5 h-5 text-blue-600" /> },
  { label: 'High Risk Vendors', value: 5, icon: <AlertTriangle className="w-5 h-5 text-red-600" /> },
  { label: 'Open Alerts', value: 3, icon: <Bell className="w-5 h-5 text-yellow-500" /> },
  { label: 'Last Scan', value: '2h ago', icon: <Activity className="w-5 h-5 text-green-600" /> },
];

const recentActivity = [
  { icon: <AlertTriangle className="w-4 h-4 text-red-500" />, text: 'Vendor "Acme Corp" flagged as High Risk', time: '5 min ago' },
  { icon: <Users className="w-4 h-4 text-blue-500" />, text: 'New vendor "CyberSafe" onboarded', time: '30 min ago' },
  { icon: <FileText className="w-4 h-4 text-green-500" />, text: 'Compliance report generated for "D Pharma"', time: '1 hr ago' },
  { icon: <Globe className="w-4 h-4 text-purple-500" />, text: 'Geopolitical risk updated for "Asia-Pacific"', time: '2 hr ago' },
];

const criticalityColors: Record<string, string> = {
  Critical: 'bg-red-100 text-red-700',
  High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-green-100 text-green-700',
};

const scoreColors = (score: number) => {
  if (score < 50) return 'bg-red-100 text-red-700';
  if (score < 70) return 'bg-orange-100 text-orange-700';
  if (score < 85) return 'bg-yellow-100 text-yellow-700';
  return 'bg-green-100 text-green-700';
};

const riskColor = (score: number) => {
  if (score < 50) return 'bg-red-100 text-red-700 border-red-300';
  if (score < 70) return 'bg-orange-100 text-orange-700 border-orange-300';
  if (score < 85) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
  return 'bg-green-100 text-green-700 border-green-300';
};

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

function calculatePillarScore(scoreDetails: any[], pillarCategories: string[]) {
  const items = scoreDetails.filter(item => pillarCategories.includes(item.category));
  const weightedSum = items.reduce((sum, item) => sum + item.score * item.weight, 0);
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}

function calculateAggregateScore(scoreDetails: any[]) {
  const weightedSum = scoreDetails.reduce((sum, item) => sum + item.score * item.weight, 0);
  const totalWeight = scoreDetails.reduce((sum, item) => sum + item.weight, 0);
  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}

function applyCriticalityMultiplier(aggregateScore: number, criticality: string) {
  const multipliers: Record<string, number> = {
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
  const [simulateMode, setSimulateMode] = useState(false);
  const [simulatedScores, setSimulatedScores] = useState(vendor.scoreDetails);

  const timeline = [
    { date: vendor.lastAssessment, label: 'Last Assessment', icon: <BarChart3 className="w-4 h-4 text-blue-600" /> },
    { date: vendor.lastScan, label: 'Last Scan', icon: <Activity className="w-4 h-4 text-green-600" /> },
    { date: '2024-05-01', label: 'Breach Detected', icon: <AlertTriangle className="w-4 h-4 text-red-600" /> },
    { date: '2024-04-01', label: 'Onboarded', icon: <Users className="w-4 h-4 text-purple-600" /> },
  ];

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

  const handleScoreChange = (category: string, newScore: number) => {
    setSimulatedScores(
      simulatedScores.map((item: any) =>
        item.category === category ? { ...item, score: newScore } : item
      )
    );
  };

  const scoresToUse = simulateMode ? simulatedScores : vendor.scoreDetails;

  const cybersecurity = calculatePillarScore(scoresToUse, pillarGroups[0].keys);
  const compliance = calculatePillarScore(scoresToUse, pillarGroups[1].keys);
  const geopolitical = calculatePillarScore(scoresToUse, pillarGroups[2].keys);
  const reputation = calculatePillarScore(scoresToUse, pillarGroups[3].keys);
  const aggregate = calculateAggregateScore(scoresToUse);
  const aggregateWithMultiplier = applyCriticalityMultiplier(aggregate, vendor.criticality);

  const pillarScores = [
    { name: 'Cybersecurity', icon: <Shield className="w-6 h-6 mb-2" />, score: cybersecurity },
    { name: 'Compliance', icon: <FileText className="w-6 h-6 mb-2" />, score: compliance },
    { name: 'Geopolitical', icon: <Globe className="w-6 h-6 mb-2" />, score: geopolitical },
    { name: 'Reputation', icon: <AlertTriangle className="w-6 h-6 mb-2" />, score: reputation },
  ];

  const groupedScores = pillarGroups.map(group => ({
    ...group,
    items: scoresToUse.filter((item: any) => group.keys.includes(item.category)) || [],
  }));

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
      
      <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Pillar Scores</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Score Simulator</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={simulateMode} onChange={() => setSimulateMode(!simulateMode)} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {pillarScores.map((pillar) => (
          <div key={pillar.name} className={`rounded-2xl shadow-lg border p-8 flex flex-col items-center min-h-[140px] transition ${riskColor(pillar.score)} w-full`}>
            {pillar.icon}
            <div className="text-2xl font-bold mb-1">{pillar.score}</div>
            <div className="text-sm text-gray-700 font-semibold">{pillar.name}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 flex flex-col justify-center min-h-[120px">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 flex flex-col items-center">
          <div className="font-semibold text-gray-900 mb-4 flex items-center"><LineChart className="w-5 h-5 text-blue-600 mr-2" />Risk Trend</div>
          <div className="w-full h-40">
            <Line data={trendData} options={trendOptions} />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6">
        <div className="font-semibold text-gray-900 mb-4 flex items-center"><BarChart3 className="w-5 h-5 text-blue-600 mr-2" />Score Breakdown</div>
        <div className="divide-y divide-gray-100">
          {groupedScores.map((group) => (
            <div key={group.name}>
              <div className="py-3 px-2 text-left font-semibold text-lg text-blue-700 flex items-center gap-2">{group.name}</div>
              <table className="min-w-full text-sm mb-4">
                <thead className="bg-gray-50">
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left font-semibold text-gray-500 w-1/4">Category</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-500 w-1/2">Score</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-500">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {group.items.map((item: any) => (
                    <tr key={item.category} className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer" onClick={() => console.log('Show details for', item.category)}>
                      <td className="px-4 py-2 text-gray-700 whitespace-nowrap">{item.category}</td>
                      <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
                        {simulateMode ? (
                          <div className="flex items-center space-x-3">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={item.score}
                              onChange={(e) => handleScoreChange(item.category, parseInt(e.target.value))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="font-bold w-12 text-center">{item.score}</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-3">
                            <div className="w-full bg-gray-200 rounded-full h-4">
                              <div className={`h-4 rounded-full ${riskColor(item.score).split(' ')[0]}`} style={{ width: `${item.score}%` }}></div>
                            </div>
                            <span className="font-bold w-12 text-center">{item.score}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2 text-gray-500 whitespace-nowrap">{item.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
      
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


export default function Dashboard() {
  const [view, setView] = useState<'dashboard' | 'vendors' | 'intelligence' | 'reports'>('dashboard');
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);
  const [selectedSubItem, setSelectedSubItem] = useState<string | null>(null);
  const [comparisonVendorIds, setComparisonVendorIds] = useState<string[]>([]);

  const dashboardVendor = vendors[0];
  const dashboardCybersecurity = calculatePillarScore(dashboardVendor.scoreDetails, pillarGroups[0].keys);
  const dashboardCompliance = calculatePillarScore(dashboardVendor.scoreDetails, pillarGroups[1].keys);
  const dashboardGeopolitical = calculatePillarScore(dashboardVendor.scoreDetails, pillarGroups[2].keys);
  const dashboardReputation = calculatePillarScore(dashboardVendor.scoreDetails, pillarGroups[3].keys);
  const dashboardAggregate = calculateAggregateScore(dashboardVendor.scoreDetails);

  const sparklineData = [
    { value: 60 }, { value: 62 }, { value: 65 }, { value: 58 }, { value: 70 },
  ];

  const handleCompare = (vendorsToCompare: any[]) => {
    setComparisonVendorIds(vendorsToCompare.map(v => v.name));
  };

  const handleBackToVendors = () => {
    setComparisonVendorIds([]);
  };

  const handleSelectVendor = (vendor: any) => {
    setSelectedVendor(vendor);
    setView('vendors');
  }

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
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type="text" placeholder="Search vendors, reports..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"><User className="w-4 h-4 text-white" /></div>
                <div>
                  <div className="text-sm font-medium text-gray-900">John Smith</div>
                  <div className="text-xs text-gray-500">D Pharma</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-8">
          {comparisonVendorIds.length > 0 ? (
            <VendorComparison selectedVendorIds={comparisonVendorIds} onBack={handleBackToVendors} />
          ) : view === 'dashboard' && !selectedVendor ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                {quickStats.map((stat) => (
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-2">
                {/* Cybersecurity Card */}
                <div className="flex flex-col justify-between min-h-[220px] transition-transform hover:shadow-lg hover:-translate-y-1 cursor-pointer" onClick={() => { setView('intelligence'); setSelectedPillar('Cybersecurity'); setSelectedSubItem(null); }}>
                  <Card className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-primary-foreground rounded-lg flex items-center justify-center"><Shield className="w-6 h-6 text-primary" /></div>
                        <span className="text-2xl font-bold text-primary">{dashboardCybersecurity}%</span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Cybersecurity Posture</h3>
                      <p className="text-sm text-muted-foreground mb-4">External attack surface, technical controls, threat readiness</p>
                    </div>
                    <Sparkline data={sparklineData} color="hsl(var(--primary))" />
                  </Card>
                </div>

                {/* Compliance Pillar */}
                <div className="flex flex-col justify-between min-h-[220px] transition-transform hover:shadow-lg hover:-translate-y-1 cursor-pointer p-6 bg-white rounded-xl shadow-sm border" onClick={() => { setView('intelligence'); setSelectedPillar('Compliance'); setSelectedSubItem(null); }}>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center"><FileText className="w-6 h-6 text-success" /></div>
                      <span className="text-2xl font-bold text-success">{dashboardCompliance}%</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Compliance & Legal</h3>
                    <p className="text-sm text-muted-foreground mb-4">Standards adherence, regulatory compliance, legal posture</p>
                  </div>
                  <Sparkline data={sparklineData} color="hsl(var(--success))" />
                </div>

                {/* Geopolitical Pillar */}
                <div className="flex flex-col justify-between min-h-[220px] transition-transform hover:shadow-lg hover:-translate-y-1 cursor-pointer p-6 bg-white rounded-xl shadow-sm border" onClick={() => { setView('intelligence'); setSelectedPillar('Geopolitical'); setSelectedSubItem(null); }}>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center"><Globe className="w-6 h-6 text-info" /></div>
                      <span className="text-2xl font-bold text-info">{dashboardGeopolitical}%</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Geopolitical & Sector</h3>
                    <p className="text-sm text-muted-foreground mb-4">Regional stability, industry risk, infrastructure jurisdiction</p>
                  </div>
                  <Sparkline data={sparklineData} color="hsl(var(--info))" />
                </div>

                {/* Reputation Pillar */}
                <div className="flex flex-col justify-between min-h-[220px] transition-transform hover:shadow-lg hover:-translate-y-1 cursor-pointer p-6 bg-white rounded-xl shadow-sm border" onClick={() => { setView('intelligence'); setSelectedPillar('Reputation'); setSelectedSubItem(null); }}>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center"><AlertTriangle className="w-6 h-6 text-destructive" /></div>
                      <span className="text-2xl font-bold text-destructive">{dashboardReputation}%</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Reputation & Exposure</h3>
                    <p className="text-sm text-muted-foreground mb-4">Breach history, credential leaks, brand spoofing</p>
                  </div>
                  <Sparkline data={sparklineData} color="hsl(var(--destructive))" />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between min-h-[180px]">
                  <div className="flex items-center space-x-3 mb-4"><LineChart className="w-5 h-5 text-blue-600" /><h2 className="text-lg font-semibold text-gray-900">Risk Trend</h2></div>
                  <div className="flex-1 flex items-center justify-center"><span className="text-gray-400 text-sm">(Trend chart coming soon)</span></div>
                </div>
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[180px]">
                  <div className="flex items-center space-x-3 mb-4"><TrendingUp className="w-5 h-5 text-gray-600" /><h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2></div>
                  <ul className="divide-y divide-gray-100">
                    {recentActivity.map((item) => (
                      <li key={item.text} className="flex items-center py-2 space-x-3">
                        <div>{item.icon}</div>
                        <div className="flex-1 text-sm text-gray-700">{item.text}</div>
                        <div className="text-xs text-gray-400">{item.time}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          ) : view === 'vendors' && !selectedVendor ? (
            <VendorsTable onSelect={handleSelectVendor} />
          ) : view === 'vendors' && selectedVendor ? (
            <VendorDetails vendor={selectedVendor} onBack={() => setSelectedVendor(null)} />
          ) : view === 'intelligence' && selectedPillar === 'Cybersecurity' && !selectedSubItem ? (
            <CybersecurityHome
              avgScore={Math.round(vendors.reduce((sum, v) => sum + (v.scores?.cybersecurity || 0), 0) / vendors.length)}
              vendorCount={vendors.length}
              highRiskCount={vendors.filter(v => (v.scores?.cybersecurity || 0) < 50).length}
              patchCompliance={Math.round(vendors.reduce((sum, v) => sum + (v.scores?.cybersecurity || 0), 0) / vendors.length)}
              subcategoryScores={pillarGroups[0].keys.map(key => ({
                name: key,
                avg: Math.round(vendors.reduce((sum, v) => {
                  const item = v.scoreDetails.find(i => i.category === key);
                  return sum + (item ? item.score : 0);
                }, 0) / vendors.length)
              }))}
            />
          ) :
          view === 'intelligence' && selectedPillar === 'Cybersecurity' && selectedSubItem === 'Vulnerabilities' ? <VulnerabilitiesTable /> :
          view === 'intelligence' && selectedPillar === 'Cybersecurity' && selectedSubItem === 'Attack Surface' ? <AttackSurfaceTable /> :
          view === 'intelligence' && selectedPillar === 'Cybersecurity' && selectedSubItem === 'Web/App Security' ? <WebAppSecurityTable /> :
          view === 'intelligence' && selectedPillar === 'Cybersecurity' && selectedSubItem === 'Cloud & Infra' ? <CloudInfraTable /> :
          view === 'intelligence' && selectedPillar === 'Cybersecurity' && selectedSubItem === 'Email Security' ? <EmailSecurityTable /> :
          view === 'intelligence' && selectedPillar === 'Cybersecurity' && selectedSubItem === 'Code Repo Exposure' ? <CodeRepoExposureTable /> :
          view === 'intelligence' && selectedPillar === 'Cybersecurity' && selectedSubItem === 'Endpoint Hygiene' ? <EndpointHygieneTable /> :
          view === 'intelligence' && selectedPillar === 'Cybersecurity' && selectedSubItem === 'IOC & Infra Threat' ? <IOCInfraThreatTable /> :
          view === 'intelligence' && selectedPillar === 'Cybersecurity' && selectedSubItem === 'Detection & Response' ? <DetectionResponseTable /> :
          view === 'intelligence' && selectedPillar === 'Compliance' && !selectedSubItem ? (
             <ComplianceHome
              avgScore={Math.round(vendors.reduce((sum, v) => sum + (v.scores?.compliance || 0), 0) / vendors.length)}
              vendorCount={vendors.length}
              highRiskCount={vendors.filter(v => (v.scores?.compliance || 0) < 50).length}
              subcategoryScores={pillarGroups[1].keys.map(key => ({
                name: key,
                avg: Math.round(vendors.reduce((sum, v) => {
                  const item = v.scoreDetails.find(i => i.category === key);
                  return sum + (item ? item.score : 0);
                }, 0) / vendors.length)
              }))}
            />
          ) :
          view === 'intelligence' && selectedPillar === 'Compliance' && selectedSubItem === 'Certifications' ? <CertificationsTable /> :
          view === 'intelligence' && selectedPillar === 'Compliance' && selectedSubItem === 'Questionnaire Results' ? <QuestionnaireResultsTable /> :
          view === 'intelligence' && selectedPillar === 'Compliance' && selectedSubItem === 'Regulatory Violations' ? <RegulatoryViolationsTable /> :
          view === 'intelligence' && selectedPillar === 'Compliance' && selectedSubItem === 'Privacy Compliance' ? <PrivacyComplianceTable /> :
          view === 'intelligence' && selectedPillar === 'Compliance' && selectedSubItem === 'Contractual Clauses' ? <ContractualClausesTable /> :
          view === 'intelligence' && selectedPillar === 'Geopolitical' && !selectedSubItem ? (
             <GeopoliticalHome
              avgScore={Math.round(vendors.reduce((sum, v) => sum + (v.scores?.geopolitical || 0), 0) / vendors.length)}
              vendorCount={vendors.length}
              highRiskCount={vendors.filter(v => (v.scores?.geopolitical || 0) < 50).length}
              subcategoryScores={pillarGroups[2].keys.map(key => ({
                name: key,
                avg: Math.round(vendors.reduce((sum, v) => {
                  const item = v.scoreDetails.find(i => i.category === key);
                  return sum + (item ? item.score : 0);
                }, 0) / vendors.length)
              }))}
            />
          ) :
          view === 'intelligence' && selectedPillar === 'Geopolitical' && selectedSubItem === 'Country Risk' ? <CountryRiskTable /> :
          view === 'intelligence' && selectedPillar === 'Geopolitical' && selectedSubItem === 'Sector Risk' ? <SectorRiskTable /> :
          view === 'intelligence' && selectedPillar === 'Geopolitical' && selectedSubItem === 'Company Size' ? <CompanySizeTable /> :
          view === 'intelligence' && selectedPillar === 'Geopolitical' && selectedSubItem === 'Infra Jurisdiction' ? <InfraJurisdictionTable /> :
          view === 'intelligence' && selectedPillar === 'Geopolitical' && selectedSubItem === 'Concentration Risk' ? <ConcentrationRiskTable /> :
          view === 'intelligence' && selectedPillar === 'Geopolitical' && selectedSubItem === 'Environmental Exposure' ? <EnvironmentalExposureTable /> :
          view === 'intelligence' && selectedPillar === 'Reputation' && !selectedSubItem ? (
            <ReputationHome
              avgScore={Math.round(vendors.reduce((sum, v) => sum + (v.scores?.reputation || 0), 0) / vendors.length)}
              vendorCount={vendors.length}
              highRiskCount={vendors.filter(v => (v.scores?.reputation || 0) < 50).length}
              subcategoryScores={pillarGroups[3].keys.map(key => ({
                name: key,
                avg: Math.round(vendors.reduce((sum, v) => {
                  const item = v.scoreDetails.find(i => i.category === key);
                  return sum + (item ? item.score : 0);
                }, 0) / vendors.length)
              }))}
            />
          ) :
          view === 'intelligence' && selectedPillar === 'Reputation' && selectedSubItem === 'Data Breach History' ? <DataBreachHistoryTable /> :
          view === 'intelligence' && selectedPillar === 'Reputation' && selectedSubItem === 'Credential/Data Leaks' ? <CredentialDataLeaksTable /> :
          view === 'intelligence' && selectedPillar === 'Reputation' && selectedSubItem === 'Brand Spoofing' ? <BrandSpoofingTable /> :
          view === 'intelligence' && selectedPillar === 'Reputation' && selectedSubItem === 'Dark Web Presence' ? <DarkWebPresenceTable /> :
          view === 'intelligence' && selectedPillar === 'Reputation' && selectedSubItem === 'Social Sentiment' ? <SocialSentimentTable /> :
          view === 'reports' ? (
            <ReportsTable />
          ) : null}
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
            {filteredReports.map((report) => (
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