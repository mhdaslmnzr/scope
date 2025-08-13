'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Brain, Calculator, BarChart3, TrendingUp, Shield, FileText, Globe, AlertTriangle,
  Sliders, Play, RotateCcw, Download, Copy, Zap, Activity, Target, Settings
} from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { vendors, riskColor, criticalityColors } from '../mock-data';
import Card from './ui/Card';
import Skeleton from './ui/Skeleton';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Updated pillar groups to match the 25-category breakdown with proper category mapping
const pillarGroups = [
  { 
    name: 'Cybersecurity', 
    weight: 0.35,
    categories: ['Vulnerability Management', 'Attack Surface', 'Web/App Security', 'Cloud & Infra', 'Email Security', 'Code Repo Exposure', 'Endpoint Hygiene', 'IOC & Infra Threat', 'Detection & Response'],
    color: '#3B82F6',
    description: 'External attack surface, vulnerability management, endpoint protection, cloud infrastructure, code security (9 categories)'
  },
  { 
    name: 'Compliance', 
    weight: 0.25,
    categories: ['Certifications', 'Questionnaire Quality', 'Regulatory Violations', 'Privacy Compliance', 'Contractual Clauses'],
    color: '#10B981',
    description: 'Regulatory compliance, certifications, questionnaire responses, contractual obligations (5 categories)'
  },
  { 
    name: 'Geopolitical', 
    weight: 0.20,
    categories: ['Country Risk', 'Sector Risk', 'Company Size', 'Infra Jurisdiction', 'Concentration Risk', 'Environmental Exposure'],
    color: '#8B5CF6',
    description: 'Geographic and political risk factors, company characteristics, infrastructure location (6 categories)'
  },
  { 
    name: 'Reputation', 
    weight: 0.20,
    categories: ['Data Breach History', 'Credential/Data Leaks', 'Brand Spoofing', 'Dark Web Presence', 'Social Sentiment'],
    color: '#EF4444',
    description: 'Historical breaches, public sentiment, data leaks, brand protection, dark web monitoring (5 categories)'
  }
];

export default function CortexEngine() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [simulatorMode, setSimulatorMode] = useState(false);
  
  // Independent simulator state - not tied to vendors (all 25 categories)
  const [simulatedCriticality, setSimulatedCriticality] = useState('Medium');
  const [simulatedScores, setSimulatedScores] = useState([
    // Cybersecurity Components (9 categories)
    { category: 'Vulnerability Management', score: 75, weight: 5, pillar: 'Cybersecurity' },
    { category: 'Attack Surface', score: 65, weight: 5, pillar: 'Cybersecurity' },
    { category: 'Web/App Security', score: 80, weight: 5, pillar: 'Cybersecurity' },
    { category: 'Cloud & Infra', score: 70, weight: 5, pillar: 'Cybersecurity' },
    { category: 'Email Security', score: 85, weight: 5, pillar: 'Cybersecurity' },
    { category: 'Code Repo Exposure', score: 60, weight: 5, pillar: 'Cybersecurity' },
    { category: 'Endpoint Hygiene', score: 60, weight: 5, pillar: 'Cybersecurity' },
    { category: 'IOC & Infra Threat', score: 70, weight: 3, pillar: 'Cybersecurity' },
    { category: 'Detection & Response', score: 70, weight: 2, pillar: 'Cybersecurity' },
    
    // Compliance Components (5 categories)
    { category: 'Certifications', score: 90, weight: 6, pillar: 'Compliance' },
    { category: 'Questionnaire Quality', score: 85, weight: 5, pillar: 'Compliance' },
    { category: 'Regulatory Violations', score: 95, weight: 5, pillar: 'Compliance' },
    { category: 'Privacy Compliance', score: 85, weight: 2, pillar: 'Compliance' },
    { category: 'Contractual Clauses', score: 75, weight: 2, pillar: 'Compliance' },
    
    // Geopolitical Components (6 categories)
    { category: 'Country Risk', score: 80, weight: 6, pillar: 'Geopolitical' },
    { category: 'Sector Risk', score: 70, weight: 4, pillar: 'Geopolitical' },
    { category: 'Company Size', score: 75, weight: 3, pillar: 'Geopolitical' },
    { category: 'Infra Jurisdiction', score: 85, weight: 3, pillar: 'Geopolitical' },
    { category: 'Concentration Risk', score: 60, weight: 2, pillar: 'Geopolitical' },
    { category: 'Environmental Exposure', score: 70, weight: 2, pillar: 'Geopolitical' },
    
    // Reputation Components (5 categories)
    { category: 'Data Breach History', score: 90, weight: 6, pillar: 'Reputation' },
    { category: 'Credential/Data Leaks', score: 85, weight: 5, pillar: 'Reputation' },
    { category: 'Brand Spoofing', score: 80, weight: 3, pillar: 'Reputation' },
    { category: 'Dark Web Presence', score: 95, weight: 3, pillar: 'Reputation' },
    { category: 'Social Sentiment', score: 80, weight: 3, pillar: 'Reputation' },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Calculate pillar score from individual components by pillar name
  const calculatePillarScore = (scoreDetails: any[], pillarName: string) => {
    const relevantScores = scoreDetails.filter(item => item.pillar === pillarName);
    if (relevantScores.length === 0) return 0;
    
    const weightedSum = relevantScores.reduce((sum, item) => sum + (item.score * item.weight), 0);
    const totalWeight = relevantScores.reduce((sum, item) => sum + item.weight, 0);
    
    return Math.round(weightedSum / totalWeight);
  };

  // Calculate aggregate score
  const calculateAggregateScore = (pillarScores: any[], criticality: string) => {
    const weightedSum = pillarScores.reduce((sum, pillar) => sum + (pillar.score * pillar.weight), 0);
    const criticalityMultiplier = criticality === 'Critical' ? 0.9 : criticality === 'High' ? 0.95 : 1.0;
    
    return Math.round(weightedSum * criticalityMultiplier);
  };

  // Calculate breach probability
  const calculateBreachProbability = (aggregateScore: number, criticality: string) => {
    const baseRisk = (100 - aggregateScore) / 100;
    const criticalityFactor = criticality === 'Critical' ? 1.5 : criticality === 'High' ? 1.2 : 1.0;
    
    return Math.min(baseRisk * criticalityFactor, 0.95);
  };

  // Simulate score changes
  const handleScoreChange = (category: string, newScore: number) => {
    setSimulatedScores(prev => 
      prev.map(item => 
        item.category === category ? { ...item, score: newScore } : item
      )
    );
  };

  // Calculate current simulated results
  const currentPillarScores = pillarGroups.map(pillar => ({
    ...pillar,
    score: calculatePillarScore(simulatedScores, pillar.name)
  }));

  const currentAggregateScore = calculateAggregateScore(currentPillarScores, simulatedCriticality);
  const currentBreachProbability = calculateBreachProbability(currentAggregateScore, simulatedCriticality);

  // Reset simulator to default values (all 25 categories)
  const resetSimulator = () => {
    setSimulatedScores([
      // Cybersecurity Components (9 categories)
      { category: 'Vulnerability Management', score: 75, weight: 5, pillar: 'Cybersecurity' },
      { category: 'Attack Surface', score: 65, weight: 5, pillar: 'Cybersecurity' },
      { category: 'Web/App Security', score: 80, weight: 5, pillar: 'Cybersecurity' },
      { category: 'Cloud & Infra', score: 70, weight: 5, pillar: 'Cybersecurity' },
      { category: 'Email Security', score: 85, weight: 5, pillar: 'Cybersecurity' },
      { category: 'Code Repo Exposure', score: 60, weight: 5, pillar: 'Cybersecurity' },
      { category: 'Endpoint Hygiene', score: 60, weight: 5, pillar: 'Cybersecurity' },
      { category: 'IOC & Infra Threat', score: 70, weight: 3, pillar: 'Cybersecurity' },
      { category: 'Detection & Response', score: 70, weight: 2, pillar: 'Cybersecurity' },
      
      // Compliance Components (5 categories)
      { category: 'Certifications', score: 90, weight: 6, pillar: 'Compliance' },
      { category: 'Questionnaire Quality', score: 85, weight: 5, pillar: 'Compliance' },
      { category: 'Regulatory Violations', score: 95, weight: 5, pillar: 'Compliance' },
      { category: 'Privacy Compliance', score: 85, weight: 2, pillar: 'Compliance' },
      { category: 'Contractual Clauses', score: 75, weight: 2, pillar: 'Compliance' },
      
      // Geopolitical Components (6 categories)
      { category: 'Country Risk', score: 80, weight: 6, pillar: 'Geopolitical' },
      { category: 'Sector Risk', score: 70, weight: 4, pillar: 'Geopolitical' },
      { category: 'Company Size', score: 75, weight: 3, pillar: 'Geopolitical' },
      { category: 'Infra Jurisdiction', score: 85, weight: 3, pillar: 'Geopolitical' },
      { category: 'Concentration Risk', score: 60, weight: 2, pillar: 'Geopolitical' },
      { category: 'Environmental Exposure', score: 70, weight: 2, pillar: 'Geopolitical' },
      
      // Reputation Components (5 categories)
      { category: 'Data Breach History', score: 90, weight: 6, pillar: 'Reputation' },
      { category: 'Credential/Data Leaks', score: 85, weight: 5, pillar: 'Reputation' },
      { category: 'Brand Spoofing', score: 80, weight: 3, pillar: 'Reputation' },
      { category: 'Dark Web Presence', score: 95, weight: 3, pillar: 'Reputation' },
      { category: 'Social Sentiment', score: 80, weight: 3, pillar: 'Reputation' },
    ]);
    setSimulatedCriticality('Medium');
  };

  // Chart configurations
  const algorithmFlowData = {
    labels: ['Data Collection', 'Score Calculation', 'Weight Application', 'Criticality Adjustment', 'Final Score'],
    datasets: [{
      label: 'Processing Time (ms)',
      data: [150, 85, 45, 30, 20],
      backgroundColor: '#3B82F6',
      borderColor: '#2563EB',
      borderWidth: 1
    }]
  };

  const pillarWeightData = {
    labels: pillarGroups.map(p => p.name),
    datasets: [{
      data: pillarGroups.map(p => p.weight * 100),
      backgroundColor: pillarGroups.map(p => p.color),
      borderWidth: 0
    }]
  };

  const scoreDistributionData = {
    labels: ['0-25 (Critical)', '26-50 (High Risk)', '51-75 (Medium Risk)', '76-100 (Low Risk)'],
    datasets: [{
      label: 'Vendor Count',
      data: [
        vendors.filter(v => v.scores.aggregate <= 25).length,
        vendors.filter(v => v.scores.aggregate > 25 && v.scores.aggregate <= 50).length,
        vendors.filter(v => v.scores.aggregate > 50 && v.scores.aggregate <= 75).length,
        vendors.filter(v => v.scores.aggregate > 75).length,
      ],
      backgroundColor: ['#EF4444', '#F59E0B', '#F97316', '#10B981']
    }]
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center">
          <Image 
              src="/images/cortex.png" 
              alt="SCOPE Logo" 
              width={100} 
              height={100}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">CORTEX</h1>
            <p className="text-gray-600">Contextual Risk, Threat & Exposure risk calculation engine</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <Zap className="w-4 h-4" />
            Online
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            Export Config
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview(mock)', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'algorithm', label: 'Algorithm(mvp)', icon: <Calculator className="w-4 h-4" /> },
            { id: 'simulator', label: 'Score Simulator', icon: <Sliders className="w-4 h-4" /> },
            { id: 'analytics', label: 'Analytics(mock)', icon: <TrendingUp className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Key Metrics */}
          <Card className="col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Engine Stats</h3>
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Vendors</span>
                <span className="font-semibold">{vendors.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Pillars</span>
                <span className="font-semibold">{pillarGroups.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Score Components</span>
                <span className="font-semibold">25</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Component Weight</span>
                <span className="font-semibold">{simulatedScores.reduce((sum, item) => sum + item.weight, 0)}</span>
              </div>
    
              <div className="flex justify-between">
                <span className="text-gray-600">Engine Version</span>
                <span className="font-semibold">v2.1.0</span>
              </div>
            </div>
          </Card>

          {/* Pillar Weights */}
          <Card className="col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pillar Weights</h3>
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <div className="h-48">
              <Doughnut 
                data={pillarWeightData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                      labels: { usePointStyle: true, padding: 15 }
                    }
                  }
                }}
              />
            </div>
          </Card>

          {/* Score Distribution */}
          <Card className="col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Risk Distribution</h3>
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div className="h-48">
              <Bar 
                data={scoreDistributionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } }
                  }
                }}
              />
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'algorithm' && (
        <div className="space-y-6">
          {/* Algorithm Flow */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Scoring Algorithm Flow</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">1. Data Collection</h4>
                  <p className="text-blue-700 text-sm">Gather intelligence data from multiple sources including OSINT, vulnerability scanners, and compliance databases.</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">2. Component Scoring</h4>
                  <p className="text-green-700 text-sm">Calculate individual scores for each component using weighted algorithms and normalization techniques.</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">3. Pillar Aggregation</h4>
                  <p className="text-purple-700 text-sm">Combine component scores into pillar scores using predefined weights and decay functions.</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">4. Final Calculation</h4>
                  <p className="text-orange-700 text-sm">Apply criticality multipliers and calculate final aggregate score with breach probability.</p>
                </div>
              </div>
              <div className="h-64">
                <Bar data={algorithmFlowData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } }
                }} />
              </div>
            </div>
          </Card>

          {/* Detailed Formulas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pillar Score Formula</h3>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                <div>pillarScore = Σ(componentScore × weight) / Σ(weight)</div>
                <div className="mt-2 text-gray-400">// Weighted average of components</div>
                <div className="mt-4">where:</div>
                <div>• componentScore ∈ [0, 100]</div>
                <div>• weight ∈ [2.0, 4.0]</div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aggregate Score Formula</h3>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                <div>aggregateScore = (Σ(pillarScore × pillarWeight) × criticalityMultiplier)</div>
                <div className="mt-2 text-gray-400">// Weighted sum with criticality adjustment</div>
                <div className="mt-4">criticalityMultiplier:</div>
                <div>• Critical: 0.90</div>
                <div>• High: 0.95</div>
                <div>• Medium/Low: 1.00</div>
              </div>
            </Card>
          </div>

          {/* Detailed Penalty Structure */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Penalty Structure & OSINT Sources</h3>
            <p className="text-gray-600 mb-4">Comprehensive breakdown of how each component is scored with specific penalty values and data sources</p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Pillar</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Component</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">OSINT Data Sources</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Penalty Structure (Starting from 100)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Cybersecurity Row */}
                  <tr className="bg-blue-50">
                    <td className="px-4 py-3 text-sm font-medium text-blue-900 border-r border-gray-200" rowSpan={9}>Cybersecurity (9)</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Vulnerability Management</td>
                    <td className="px-4 py-3 text-sm text-gray-600">CVE databases (NVD, Mitre), Exploit DB, Vendor advisories</td>
                    <td className="px-4 py-3 text-sm text-gray-600">-15 per unpatched critical CVE, -10 per unpatched high-severity CVE, -5 per old vuln (&gt;90 days), -20 per active exploit</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Attack Surface</td>
                    <td className="px-4 py-3 text-sm text-gray-600">DNS records, Subdomain scanners, Shodan, Censys</td>
                    <td className="px-4 py-3 text-sm text-gray-600">-7 per exposed critical service, -10 per unauthorized subdomain, -8 per misconfig, -15 per sensitive interface exposed</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Web/Application Security</td>
                    <td className="px-4 py-3 text-sm text-gray-600">SSL Labs, Security header scanners, OWASP reports</td>
                    <td className="px-4 py-3 text-sm text-gray-600">-20 for SSL/TLS grade below B, -10 per missing critical header, -15 per OWASP critical vuln, -5-10 for minor vulns</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Cloud & Infrastructure</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Cloud misconfig scanners (AWS Config), Black Duck, Open Buckets</td>
                    <td className="px-4 py-3 text-sm text-gray-600">-20 per critical misconfig, -25 for public database, -10 per excessive IAM role</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Email Security</td>
                    <td className="px-4 py-3 text-sm text-gray-600">SPF/DKIM/DMARC checkers, Phishing databases</td>
                    <td className="px-4 py-3 text-sm text-gray-600">-25 SPF fail, -25 DKIM fail, -30 DMARC fail, -20 per phishing incident</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Code Repository Exposure</td>
                    <td className="px-4 py-3 text-sm text-gray-600">GitHub leaks, Token scanners</td>
                    <td className="px-4 py-3 text-sm text-gray-600">-30 per leaked token, -20 for public repo without controls, cumulative -10 for repeated leaks</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Endpoint Hygiene</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Endpoint management tools, device vulnerability scans</td>
                    <td className="px-4 py-3 text-sm text-gray-600">-10 per outdated endpoint, -15 per insecure config, -5 per vulnerable device beyond threshold</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">IOC & Infra Threat</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Threat intelligence feeds (VirusTotal, MISP), Malware reports</td>
                    <td className="px-4 py-3 text-sm text-gray-600">-15 per malware indicator, -20 if listed on multiple threat feeds, -25 per infra compromise</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Detection & Response</td>
                    <td className="px-4 py-3 text-sm text-gray-600">SOC reports, Incident response assessments</td>
                    <td className="px-4 py-3 text-sm text-gray-600">-20 per unmitigated incident, -25 for low SOC maturity, -10 per response delay</td>
                  </tr>

                  {/* Compliance Row */}
                  <tr className="bg-green-50">
                    <td className="px-4 py-3 text-sm font-medium text-green-900 border-r border-gray-200" rowSpan={5}>Compliance (5)</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Certifications</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Certification bodies, Vendor disclosures</td>
                    <td className="px-4 py-3 text-sm text-gray-600">-25 per missing critical cert, -15 per expired cert</td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Questionnaire Quality</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Vendor surveys, Third-party audit results</td>
                    <td className="px-4 py-3 text-sm text-gray-600">-10 per negative answer, -15 per missing section</td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Regulatory Violations</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Public fines, Government disclosures</td>
                    <td className="px-4 py-3 text-sm text-gray-600">-15 per minor violation, -30 per major violation/fine</td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Privacy Compliance</td>
                    <td className="px-4 py-3 text-sm text-gray-600">GDPR, CCPA audit reports</td>
                    <td className="px-4 py-3 text-sm text-gray-600">-20 per non-compliance issue, -30 for privacy breaches</td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Contractual Clauses</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Contract repositories, Legal disclosures</td>
                    <td className="px-4 py-3 text-sm text-gray-600">-15 per missing critical clause, -10 per weak clause</td>
                  </tr>

                  {/* Geopolitical Row */}
                  <tr className="bg-purple-50">
                    <td className="px-4 py-3 text-sm font-medium text-purple-900 border-r border-gray-200" rowSpan={6}>Geopolitical (6)</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Country Risk</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Political risk indices, Sanctions lists, Cyber threat reports</td>
                    <td className="px-4 py-3 text-sm text-gray-600">-30 for high political risk, -40 for sanctions, -20 for elevated cyber threat</td>
                  </tr>
                  <tr className="bg-purple-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Sector Risk</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Industry threat advisories, Historical sector cyber events</td>
                    <td className="px-4 py-3 text-sm text-gray-600">-25 for high threat industry, -15 for recent incidents</td>
                  </tr>
                  <tr className="bg-purple-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Company Size</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Public registries, Financial filings</td>
                    <td className="px-4 py-3 text-sm text-gray-600">-10 for small size, -5 medium, 0 large</td>
                  </tr>
                  <tr className="bg-purple-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Infrastructure Jurisdiction</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Data sovereignty reports, Legal frameworks</td>
                    <td className="px-4 py-3 text-sm text-gray-600">-25 for high risk jurisdiction, -15 moderate risk</td>
                  </tr>
                  <tr className="bg-purple-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Concentration Risk</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Supply chain maps, Vendor dependency data</td>
                    <td className="px-4 py-3 text-sm text-gray-600">-30 for high dependency, -15 moderate</td>
                  </tr>
                  <tr className="bg-purple-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Environmental Exposure</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Geo hazard reports, Climate risk data</td>
                    <td className="px-4 py-3 text-sm text-gray-600">-25 for high risk, -15 for moderate</td>
                  </tr>

                  {/* Reputation Row */}
                  <tr className="bg-red-50">
                    <td className="px-4 py-3 text-sm font-medium text-red-900 border-r border-gray-200" rowSpan={5}>Reputation (5)</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Data Breach History</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Breach databases (HIBP), News archives</td>
                    <td className="px-4 py-3 text-sm text-gray-600">-20 per breach, -40 for large-scale breach</td>
                  </tr>
                  <tr className="bg-red-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Credential/Data Leaks</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Dark web monitoring platforms, Leak repositories</td>
                    <td className="px-4 py-3 text-sm text-gray-600">-15 per leak, -20 additional for high privilege leaks</td>
                  </tr>
                  <tr className="bg-red-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Brand Spoofing</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Phishing watchlists, Domain fraud databases</td>
                    <td className="px-4 py-3 text-sm text-gray-600">-20 per incident, -30 for major phishing campaigns</td>
                  </tr>
                  <tr className="bg-red-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Dark Web Presence</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Dark web monitoring services</td>
                    <td className="px-4 py-3 text-sm text-gray-600">-15 per credible mention</td>
                  </tr>
                  <tr className="bg-red-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Social Sentiment</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Social media sentiment tools, News analysis</td>
                    <td className="px-4 py-3 text-sm text-gray-600">-10 for moderate negative sentiment, -25 for severe negative media coverage</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Key Scoring Principles</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Base Score:</strong> All components start at 100 points</li>
                <li>• <strong>Penalty Application:</strong> Deductions applied based on OSINT findings</li>
                <li>• <strong>Cumulative Impact:</strong> Multiple violations compound penalties</li>
                <li>• <strong>Source Verification:</strong> All penalties require verified OSINT data</li>
                <li>• <strong>Dynamic Updates:</strong> Scores updated as new intelligence emerges</li>
              </ul>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'simulator' && (
        <div className="space-y-6">
          {/* Simulator Controls */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Score Simulator</h3>
                <p className="text-gray-600">Interactive demonstration of how component scores affect overall risk calculations</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Preset Scenarios:</label>
                  <select
                    onChange={(e) => {
                      if (e.target.value === 'reset') {
                        resetSimulator();
                      } else if (e.target.value === 'high-risk') {
                        setSimulatedScores(prev => prev.map(item => ({...item, score: Math.floor(Math.random() * 30) + 10})));
                        setSimulatedCriticality('Critical');
                      } else if (e.target.value === 'low-risk') {
                        setSimulatedScores(prev => prev.map(item => ({...item, score: Math.floor(Math.random() * 20) + 80})));
                        setSimulatedCriticality('Low');
                      }
                      e.target.value = '';
                    }}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                    defaultValue=""
                  >
                    <option value="">Choose scenario</option>
                    <option value="reset">Balanced (Default)</option>
                    <option value="high-risk">High Risk Vendor</option>
                    <option value="low-risk">Low Risk Vendor</option>
                  </select>
                </div>
                <button
                  onClick={resetSimulator}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
                <div className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                  Demo Mode
                </div>
              </div>
            </div>

            {/* Scoring Process Explanation */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <h5 className="font-medium text-gray-900 mb-3">How Scores Are Calculated</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                <div>
                  <p className="font-medium text-gray-800 mb-1">1. Component Level</p>
                  <p>Each category gets a score (0-100) and relative weight (2-4)</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800 mb-1">2. Pillar Level</p>
                  <p>Weighted average of components within each pillar</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800 mb-1">3. Final Score</p>
                  <p>Pillar scores weighted by pillar importance, then adjusted by criticality</p>
                </div>
              </div>
            </div>

            {/* Current Results */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{currentAggregateScore}</div>
                <div className="text-sm text-blue-800">Aggregate Score</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600">{Math.round(currentBreachProbability * 100)}%</div>
                <div className="text-sm text-red-800">Breach Probability</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-lg font-bold text-purple-600">{simulatedCriticality}</div>
                <div className="text-sm text-purple-800">Asset Criticality Level</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-lg font-bold text-green-600">{riskColor(currentAggregateScore).includes('green') ? 'Low' : riskColor(currentAggregateScore).includes('yellow') ? 'Medium' : riskColor(currentAggregateScore).includes('red') ? 'High' : 'Critical'}</div>
                <div className="text-sm text-green-800">Risk Level</div>
              </div>
            </div>

            {/* Criticality Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Asset Criticality Level</label>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                <p className="text-sm text-yellow-800">
                  <strong>Criticality Multiplier:</strong> Critical assets get a 0.9x multiplier (10% score reduction), 
                  High assets get 0.95x (5% reduction), Medium/Low assets get 1.0x (no change)
                </p>
              </div>
              <select
                value={simulatedCriticality}
                onChange={(e) => setSimulatedCriticality(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            {/* Score Adjusters - Organized by Pillar */}
            <div className="space-y-6">
              <h4 className="font-semibold text-gray-900">Component Scores by Risk Pillar</h4>
              
              {/* Weight System Explanation */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h5 className="font-medium text-blue-900 mb-2">Weight System Explanation</h5>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>Component Weights:</strong> Individual category weights (2-6) represent relative importance within each pillar</p>
                  <p><strong>Pillar Weights:</strong> Cybersecurity (35%), Compliance (25%), Geopolitical (20%), Reputation (20%)</p>
                  <p><strong>Final Score:</strong> Weighted average of all components, then adjusted by criticality level</p>
                </div>
              </div>
              
              {pillarGroups.map((pillar) => (
                <div key={pillar.name} className="space-y-3">
                  <div className="flex items-center gap-2">
                    {pillar.name === 'Cybersecurity' && <Shield className="w-4 h-4 text-blue-600" />}
                    {pillar.name === 'Compliance' && <FileText className="w-4 h-4 text-green-600" />}
                    {pillar.name === 'Geopolitical' && <Globe className="w-4 h-4 text-purple-600" />}
                    {pillar.name === 'Reputation' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                    <h5 className="font-medium text-gray-800">{pillar.name}</h5>
                    <span className="text-xs text-gray-500">({pillar.description})</span>
                    <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      Weight: {(pillar.weight * 100)}%
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pl-6">
                    {simulatedScores
                      .filter(item => item.pillar === pillar.name)
                      .map((item: any) => (
                        <div key={item.category} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-gray-700">{item.category}</label>
                            <span className="text-sm font-bold text-gray-900">{item.score}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={item.score}
                            onChange={(e) => handleScoreChange(item.category, parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>0</span>
                            <span className="font-medium">Weight: {item.weight} (Relative)</span>
                            <span>100</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Pillar Breakdown */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pillar Breakdown</h3>
            
            {/* Weight Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h6 className="font-medium text-blue-900 mb-2">Total Weights by Pillar</h6>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {pillarGroups.map((pillar) => {
                  const totalComponentWeight = simulatedScores
                    .filter(item => item.pillar === pillar.name)
                    .reduce((sum, item) => sum + item.weight, 0);
                  return (
                    <div key={pillar.name} className="text-center">
                      <div className="font-medium text-blue-800">{pillar.name}</div>
                      <div className="text-blue-600">Component: {totalComponentWeight}</div>
                      <div className="text-blue-600">Pillar: {(pillar.weight * 100)}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentPillarScores.map((pillar) => (
                <div key={pillar.name} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {pillar.name === 'Cybersecurity' && <Shield className="w-4 h-4 text-blue-600" />}
                    {pillar.name === 'Compliance' && <FileText className="w-4 h-4 text-green-600" />}
                    {pillar.name === 'Geopolitical' && <Globe className="w-4 h-4 text-purple-600" />}
                    {pillar.name === 'Reputation' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                    <span className="font-medium text-gray-900">{pillar.name}</span>
                  </div>
                  <div className="text-2xl font-bold mb-1" style={{ color: pillar.color }}>
                    {pillar.score}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">Weight: {(pillar.weight * 100)}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300" 
                      style={{ 
                        width: `${pillar.score}%`, 
                        backgroundColor: pillar.color 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Score Calculation Summary */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Calculation Summary</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h6 className="font-medium text-gray-800 mb-2">Current Pillar Scores</h6>
                  <div className="space-y-2 text-sm">
                    {currentPillarScores.map((pillar) => (
                      <div key={pillar.name} className="flex justify-between">
                        <span className="text-gray-600">{pillar.name}:</span>
                        <span className="font-medium">{pillar.score}/100</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h6 className="font-medium text-gray-800 mb-2">Final Calculation</h6>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Base Score: {Math.round(currentPillarScores.reduce((sum, pillar) => sum + (pillar.score * pillar.weight), 0))}</p>
                    <p>Criticality: {simulatedCriticality} (×{simulatedCriticality === 'Critical' ? '0.9' : simulatedCriticality === 'High' ? '0.95' : '1.0'})</p>
                    <p className="font-medium text-gray-800">Final Score: {currentAggregateScore}/100</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Response Time</span>
                  <span className="font-semibold text-green-600">330ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cache Hit Rate</span>
                  <span className="font-semibold text-blue-600">94.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Error Rate</span>
                  <span className="font-semibold text-green-600">0.01%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Uptime</span>
                  <span className="font-semibold text-green-600">99.9%</span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Quality</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Completeness</span>
                  <span className="font-semibold text-green-600">98.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Freshness</span>
                  <span className="font-semibold text-blue-600">97.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Accuracy</span>
                  <span className="font-semibold text-green-600">96.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Source Reliability</span>
                  <span className="font-semibold text-green-600">95.1%</span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Insights</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">High Risk Vendors</span>
                  <span className="font-semibold text-red-600">{vendors.filter(v => v.scores.aggregate < 50).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Critical Assets</span>
                  <span className="font-semibold text-orange-600">{vendors.filter(v => v.criticality === 'Critical').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Improving Trends</span>
                  <span className="font-semibold text-green-600">{Math.floor(vendors.length * 0.6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Breach Risk</span>
                  <span className="font-semibold text-yellow-600">{Math.round(vendors.reduce((sum, v) => sum + (v.breachChance || 0), 0) / vendors.length * 100)}%</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Score Trends */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Evolution Over Time</h3>
            <div className="h-64">
              <Line
                data={{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                  datasets: [
                    {
                      label: 'Average Aggregate Score',
                      data: [65, 67, 69, 66, 71, 73],
                      borderColor: '#3B82F6',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      tension: 0.4
                    },
                    {
                      label: 'Cybersecurity Average',
                      data: [68, 70, 72, 69, 74, 76],
                      borderColor: '#10B981',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      tension: 0.4
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' }
                  },
                  scales: {
                    y: { min: 50, max: 80 }
                  }
                }}
              />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
