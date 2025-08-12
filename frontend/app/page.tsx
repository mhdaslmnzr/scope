'use client';

import { useState, useEffect } from 'react';
import { 
  Shield, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  Bell, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  LineChart,
  BarChart3
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import Sidebar from '@/components/Sidebar';
import VendorsTable from '@/components/VendorsTable';
import NewVendorDetails from '@/components/NewVendorDetails';
import VendorComparison from '@/components/VendorComparison';
import AddVendor from '@/components/AddVendor';
import Reports from '@/components/Reports';
import HeatmapGrid from '@/components/charts/HeatmapGrid';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import { vendors, riskColor, criticalityColors } from '@/mock-data';
import CybersecurityHome from '@/components/intelligence/CybersecurityHome';
import ComplianceHome from '@/components/intelligence/ComplianceHome';
import GeopoliticalHome from '@/components/intelligence/GeopoliticalHome';
import ReputationHome from '@/components/intelligence/ReputationHome';
import VulnerabilitiesTable from '@/components/intelligence/VulnerabilitiesTable';
import AttackSurfaceTable from '@/components/intelligence/AttackSurfaceTable';
import WebAppSecurityTable from '@/components/intelligence/WebAppSecurityTable';
import CloudInfraTable from '@/components/intelligence/CloudInfraTable';
import EmailSecurityTable from '@/components/intelligence/EmailSecurityTable';
import CodeRepoExposureTable from '@/components/intelligence/CodeRepoExposureTable';
import EndpointHygieneTable from '@/components/intelligence/EndpointHygieneTable';
import IOCInfraThreatTable from '@/components/intelligence/IOCInfraThreatTable';
import DetectionResponseTable from '@/components/intelligence/DetectionResponseTable';
import CertificationsTable from '@/components/intelligence/CertificationsTable';
import QuestionnaireResultsTable from '@/components/intelligence/QuestionnaireResultsTable';
import RegulatoryViolationsTable from '@/components/intelligence/RegulatoryViolationsTable';
import PrivacyComplianceTable from '@/components/intelligence/PrivacyComplianceTable';
import ContractualClausesTable from '@/components/intelligence/ContractualClausesTable';
import CountryRiskTable from '@/components/intelligence/CountryRiskTable';
import SectorRiskTable from '@/components/intelligence/SectorRiskTable';
import CompanySizeTable from '@/components/intelligence/CompanySizeTable';
import InfraJurisdictionTable from '@/components/intelligence/InfraJurisdictionTable';
import ConcentrationRiskTable from '@/components/intelligence/ConcentrationRiskTable';
import EnvironmentalExposureTable from '@/components/intelligence/EnvironmentalExposureTable';
import DataBreachHistoryTable from '@/components/intelligence/DataBreachHistoryTable';
import CredentialDataLeaksTable from '@/components/intelligence/CredentialDataLeaksTable';
import BrandSpoofingTable from '@/components/intelligence/BrandSpoofingTable';
import DarkWebPresenceTable from '@/components/intelligence/DarkWebPresenceTable';
import SocialSentimentTable from '@/components/intelligence/SocialSentimentTable';
import CortexEngine from '@/components/CortexEngine';

export default function Home() {
  const [view, setView] = useState<'dashboard' | 'vendors' | 'intelligence' | 'reports' | 'cortex' | 'add-vendor'>('dashboard');
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [selectedPillar, setSelectedPillar] = useState<string | null>('Cybersecurity');
  const [selectedSubItem, setSelectedSubItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [comparisonVendorIds, setComparisonVendorIds] = useState<string[]>([]);
  const [useNewDetailsView, setUseNewDetailsView] = useState(false);

  const dashboardVendor = vendors[0];

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

const quickStats = [
    { label: 'Total Vendors', value: vendors.length, icon: <Shield className="w-5 h-5 text-blue-600" /> },
    { label: 'High Risk Vendors', value: vendors.filter(v => (v.scores?.aggregate || 0) < 50).length, icon: <AlertTriangle className="w-5 h-5 text-red-600" /> },
  { label: 'Open Alerts', value: 3, icon: <Bell className="w-5 h-5 text-yellow-500" /> },
    { label: 'Last Scan', value: '2h ago', icon: <Activity className="w-5 h-5 text-green-600" /> }
  ];

  const riskDistribution = [
    { label: 'Critical', count: vendors.filter(v => (v.scores?.aggregate || 0) < 30).length, color: 'bg-red-500' },
    { label: 'High', count: vendors.filter(v => (v.scores?.aggregate || 0) >= 30 && (v.scores?.aggregate || 0) < 50).length, color: 'bg-orange-500' },
    { label: 'Medium', count: vendors.filter(v => (v.scores?.aggregate || 0) >= 50 && (v.scores?.aggregate || 0) < 70).length, color: 'bg-yellow-500' },
    { label: 'Low', count: vendors.filter(v => (v.scores?.aggregate || 0) >= 70).length, color: 'bg-green-500' }
  ];

  const trendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Aggregate Score',
      data: [60, 62, 65, 58, dashboardVendor.scores?.aggregate || 70, dashboardVendor.scores?.aggregate || 70],
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37,99,235,0.1)',
      tension: 0.4,
      pointRadius: 3,
    }]
  };

const recentActivity = [
  { icon: <AlertTriangle className="w-4 h-4 text-red-500" />, text: 'Vendor "Acme Corp" flagged as High Risk', time: '5 min ago' },
    { icon: <Shield className="w-4 h-4 text-blue-500" />, text: 'New vulnerability detected in Cloud Infrastructure', time: '15 min ago' },
    { icon: <TrendingUp className="w-4 h-4 text-green-500" />, text: 'Compliance score improved for 3 vendors', time: '1 hour ago' }
  ];

const pillarGroups = [
  {
    name: 'Cybersecurity',
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      color: 'bg-blue-100 text-blue-600',
      avgScore: Math.round(vendors.reduce((sum, v) => sum + (v.scores?.cybersecurity || 0), 0) / vendors.length),
      keys: ['Vulnerability Management', 'Attack Surface', 'Web/App Security', 'Cloud & Infra', 'Email Security', 'Code Repo Exposure', 'Endpoint Hygiene', 'IOC & Infra Threat', 'Detection & Response']
  },
  {
    name: 'Compliance',
      icon: <FileText className="w-8 h-8 text-green-600" />,
      color: 'bg-green-100 text-green-600',
      avgScore: Math.round(vendors.reduce((sum, v) => sum + (v.scores?.compliance || 0), 0) / vendors.length),
      keys: ['Certifications', 'Questionnaire Results', 'Regulatory Violations', 'Privacy Compliance', 'Contractual Clauses']
  },
  {
    name: 'Geopolitical',
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      color: 'bg-purple-100 text-purple-600',
      avgScore: Math.round(vendors.reduce((sum, v) => sum + (v.scores?.geopolitical || 0), 0) / vendors.length),
      keys: ['Country Risk', 'Sector Risk', 'Company Size', 'Infra Jurisdiction', 'Concentration Risk', 'Environmental Exposure']
  },
  {
    name: 'Reputation',
      icon: <AlertTriangle className="w-8 h-8 text-red-600" />,
      color: 'bg-red-100 text-red-600',
      avgScore: Math.round(vendors.reduce((sum, v) => sum + (v.scores?.reputation || 0), 0) / vendors.length),
      keys: ['Data Breach History', 'Credential/Data Leaks', 'Brand Spoofing', 'Dark Web Presence', 'Social Sentiment']
    }
  ];

  const dashboardCybersecurity = calculatePillarScore(dashboardVendor.scoreDetails, pillarGroups[0].keys);
  const dashboardCompliance = calculatePillarScore(dashboardVendor.scoreDetails, pillarGroups[1].keys);
  const dashboardGeopolitical = calculatePillarScore(dashboardVendor.scoreDetails, pillarGroups[2].keys);
  const dashboardReputation = calculatePillarScore(dashboardVendor.scoreDetails, pillarGroups[3].keys);

  function calculatePillarScore(scoreDetails: any[], keys: string[]): number {
    const relevantScores = scoreDetails.filter(item => keys.includes(item.category));
    if (relevantScores.length === 0) return 0;
    
    const totalWeight = relevantScores.reduce((sum, item) => sum + (item.weight || 1), 0);
    const weightedSum = relevantScores.reduce((sum, item) => sum + (item.score * (item.weight || 1)), 0);
    
    return Math.round(weightedSum / totalWeight);
  }

  const handleBackToVendors = () => {
    setComparisonVendorIds([]);
    setView('vendors');
  };

  // Removed - vendor details will show in main content area instead

  if (comparisonVendorIds.length > 0) {
    return <VendorComparison selectedVendorIds={comparisonVendorIds} onBack={handleBackToVendors} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Full-Width Header - Better Height with Subtitle */}
      <div className="sticky top-0 z-40 bg-white shadow-md border-b border-gray-200 w-full">
        <div className="w-full px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left: SCOPE Logo - Clickable Home Button with Subtitle */}
            <button 
              onClick={() => {
                setView('dashboard');
                setSelectedVendor(null);
                setSelectedPillar(null);
                setSelectedSubItem(null);
                setUseNewDetailsView(false);
              }}
              className="flex items-center space-x-3 hover:scale-105 transition-transform duration-200"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  SCOPE
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  Supply Chain OSINT & Prediction Engine
              </span>
              </div>
            </button>

            {/* Center: Enhanced Search Bar with Live Results - More Compact */}
            <div className="flex-1 max-w-xl mx-6">
              <div className="relative group">
            <input
              type="text"
                  placeholder="Search vendors, sectors, countries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
          </div>
                {searchQuery && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <button
                      onClick={() => setSearchQuery('')}
                      className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
        </div>
                )}
                
                {/* Live Search Results Dropdown */}
                {searchQuery && filteredVendors.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-50 animate-slide-up">
                    <div className="p-3 border-b border-gray-100">
                      <p className="text-sm text-gray-600">
                        Found {filteredVendors.length} vendor{filteredVendors.length !== 1 ? 's' : ''}
                      </p>
          </div>
                    {filteredVendors.slice(0, 8).map((vendor, index) => (
                      <button
                        key={vendor.name}
                        onClick={() => {
                          setSelectedVendor(vendor);
                          setUseNewDetailsView(true);
                          setView('vendors');
                          setSearchQuery('');
                        }}
                        className="w-full p-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-b-0 group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            (vendor.scores?.aggregate || 0) >= 70 ? 'bg-green-500' :
                            (vendor.scores?.aggregate || 0) >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              {vendor.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {vendor.sector} • {vendor.country} • Score: {vendor.scores?.aggregate || 0}
                            </p>
      </div>
                          <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
          </div>
                      </button>
                    ))}
                    {filteredVendors.length > 8 && (
                      <div className="p-3 text-center">
                        <button
                          onClick={() => {
                            setView('vendors');
                            setSearchQuery('');
                          }}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          View all {filteredVendors.length} results →
                        </button>
                      </div>
                    )}
      </div>
                )}
          </div>
            </div>

            {/* Right: Enhanced User Profile - Better Sized */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowUserModal(true)}
                className="flex items-center space-x-2 p-2.5 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:shadow-sm"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-sm font-semibold">JS</span>
          </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">John Smith</p>
                  <p className="text-xs text-gray-500">DHKNF Biotech</p>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
        </div>
          </div>
        </div>
      </div>
      
      {/* Main Layout: Sidebar + Content */}
      <div className="flex">
        {/* Sidebar - Sticky positioned below header */}
        <div className="w-56 bg-white shadow-lg border-r border-gray-200 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <Sidebar
        view={view}
        setView={setView}
        selectedPillar={selectedPillar}
        setSelectedPillar={setSelectedPillar}
        selectedSubItem={selectedSubItem}
        setSelectedSubItem={setSelectedSubItem}
        setSelectedVendor={setSelectedVendor}
            setUseNewDetailsView={setUseNewDetailsView}
          />
        </div>
        
        {/* Main Content Area - More Compact */}
        <div className="flex-1 bg-gray-50 min-h-screen">
          <div className="p-6 space-y-6">
            {/* Dashboard View */}
            {view === 'dashboard' ? (
              <div className="space-y-8">
                {/* Quick Stats - Enhanced KPI Cards - More Compact */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickStats.map((stat, index) => (
                    <Card 
                      key={index} 
                      className="group hover:scale-105 transition-all duration-300 hover:shadow-lg border-0 bg-gradient-to-br from-white to-gray-50"
                    >
                      <div className="flex items-center space-x-3 p-4">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 group-hover:from-blue-100 group-hover:to-indigo-200 transition-all duration-300">
                          {stat.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-600 mb-1">{stat.label}</p>
                          <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            {stat.value}
                          </p>
              </div>
            </div>
                      {/* Subtle border accent */}
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-600 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Card>
                  ))}
                </div>

                {/* Risk Overview - More Compact */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Risk Distribution - Beautiful Donut Chart */}
                  <Card header={<h3 className="text-base font-semibold text-gray-900">Risk Distribution</h3>}>
                    <div className="flex items-center justify-center h-36">
                      <div className="relative w-24 h-24">
                        {/* Donut Chart */}
                        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 32 32">
                          {riskDistribution.map((item, index) => {
                            const total = riskDistribution.reduce((sum, i) => sum + i.count, 0);
                            const percentage = total > 0 ? (item.count / total) * 100 : 0;
                            const circumference = 2 * Math.PI * 14; // radius = 14
                            const strokeDasharray = (percentage / 100) * circumference;
                            const strokeDashoffset = index === 0 ? 0 : 
                              riskDistribution.slice(0, index).reduce((sum, i) => {
                                const p = total > 0 ? (i.count / total) * 100 : 0;
                                return sum + (p / 100) * circumference;
                              }, 0);
                            
                            const colors = {
                              'Critical': '#ef4444',
                              'High': '#f97316', 
                              'Medium': '#eab308',
                              'Low': '#22c55e'
                            };
                            
                            return (
                              <circle
                                key={index}
                                cx="16"
                                cy="16"
                                r="14"
                                fill="transparent"
                                stroke={colors[item.label as keyof typeof colors] || '#6b7280'}
                                strokeWidth="3"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                className="transition-all duration-1000 ease-out"
                                style={{
                                  strokeDasharray: strokeDasharray,
                                  strokeDashoffset: strokeDashoffset
                                }}
                              />
                            );
                          })}
                        </svg>
                        
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="text-lg font-bold text-gray-900">
                            {riskDistribution.reduce((sum, item) => sum + item.count, 0)}
              </div>
                          <div className="text-xs text-gray-500">Total</div>
          </div>
        </div>

                      {/* Legend */}
                      <div className="ml-6 space-y-2">
                        {riskDistribution.map((item, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${item.color} shadow-sm`}></div>
                    <div>
                              <div className="text-xs font-medium text-gray-900">{item.label}</div>
                              <div className="text-xs text-gray-500">{item.count}</div>
                    </div>
                  </div>
                ))}
              </div>
              </div>
                  </Card>

                  {/* Risk Trend - Enhanced Chart - More Compact */}
                  <Card header={<h3 className="text-base font-semibold text-gray-900">Risk Trend</h3>}>
                    <div className="h-36">
                      <Line
                        data={{
                          ...trendData,
                          datasets: [{
                            ...trendData.datasets[0],
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            borderWidth: 3,
                            tension: 0.4,
                            pointRadius: 6,
                            pointBackgroundColor: '#ffffff',
                            pointBorderColor: '#3b82f6',
                            pointBorderWidth: 2,
                            pointHoverRadius: 8,
                            pointHoverBackgroundColor: '#3b82f6',
                            pointHoverBorderColor: '#ffffff',
                            pointHoverBorderWidth: 3,
                            fill: true,
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              mode: 'index',
                              intersect: false,
                              backgroundColor: 'rgba(0, 0, 0, 0.8)',
                              titleColor: '#ffffff',
                              bodyColor: '#ffffff',
                              borderColor: '#3b82f6',
                              borderWidth: 1,
                              cornerRadius: 8,
                              displayColors: false,
                            },
                          },
                          scales: {
                            x: {
                              grid: {
                                color: 'rgba(0, 0, 0, 0.05)',
                              },
                              ticks: {
                                color: '#6b7280',
                                font: {
                                  size: 12,
                                  weight: 'bold',
                                },
                              },
                            },
                            y: {
                              beginAtZero: true,
                              max: 100,
                              grid: {
                                color: 'rgba(0, 0, 0, 0.05)',
                              },
                              ticks: {
                                color: '#6b7280',
                                font: {
                                  size: 12,
                                  weight: 'bold',
                                },
                                callback: function(value) {
                                  return value + '%';
                                },
                              },
                            },
                          },
                          interaction: {
                            intersect: false,
                            mode: 'index',
                          },
                          elements: {
                            point: {
                              hoverBackgroundColor: '#3b82f6',
                            },
                          },
                        }}
                      />
                    </div>
                  </Card>
                </div>

                {/* Risk Pillars - Enhanced Cards - More Compact */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {pillarGroups.map((pillar, index) => (
                    <Card 
                      key={index} 
                      className="cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-300 group border-0 bg-gradient-to-br from-white to-gray-50"
                      onClick={() => {
                        setSelectedPillar(pillar.name);
                        setView('intelligence');
                      }}
                    >
                      <div className="text-center p-4">
                        <div className={`w-16 h-16 mx-auto mb-3 rounded-xl flex items-center justify-center ${pillar.color} group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                          {pillar.icon}
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 mb-2">{pillar.name}</h3>
                        <div className="mb-2">
                          <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            {Math.round(pillar.avgScore)}
                          </p>
                          <p className="text-xs text-gray-500">Average Score</p>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                          <div 
                            className={`h-1.5 rounded-full transition-all duration-1000 ease-out ${
                              pillar.avgScore >= 80 ? 'bg-green-500' :
                              pillar.avgScore >= 60 ? 'bg-yellow-500' :
                              pillar.avgScore >= 40 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${pillar.avgScore}%` }}
                          ></div>
                        </div>
                        
                        {/* Risk Level Indicator */}
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          pillar.avgScore >= 80 ? 'bg-green-100 text-green-800' :
                          pillar.avgScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          pillar.avgScore >= 40 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {pillar.avgScore >= 80 ? 'Low Risk' :
                           pillar.avgScore >= 60 ? 'Medium Risk' :
                           pillar.avgScore >= 40 ? 'High Risk' : 'Critical Risk'}
                        </div>
                  </div>
                      
                      {/* Hover Border Effect */}
                      <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-blue-200 transition-colors duration-300 pointer-events-none"></div>
                </Card>
                  ))}
                </div>

                {/* Enhanced Vendor Risk Heatmap */}
                <Card header={
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Vendor Risk Heatmap</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Showing top vendors by risk</span>
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 rounded bg-red-500"></div>
                        <div className="w-3 h-3 rounded bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded bg-green-500"></div>
                      </div>
                    </div>
                  </div>
                }>
                  <div className="space-y-4">
                    {/* Risk Legend */}
                    <div className="flex items-center justify-center space-x-6 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded bg-red-500"></div>
                        <span className="text-gray-600">High Risk (0-50)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded bg-yellow-500"></div>
                        <span className="text-gray-600">Medium Risk (51-70)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded bg-green-500"></div>
                        <span className="text-gray-600">Low Risk (71-100)</span>
                      </div>
                    </div>
                    
                    {/* Enhanced Heatmap */}
                    <HeatmapGrid 
                      rows={vendors
                        .sort((a, b) => (a.scores?.aggregate || 0) - (b.scores?.aggregate || 0))
                        .slice(0, 15)
                        .map(v => ({
                          label: v.name,
                          values: [
                            v.scores?.cybersecurity || 0,
                            v.scores?.compliance || 0,
                            v.scores?.geopolitical || 0,
                            v.scores?.reputation || 0
                          ]
                        }))}
                      columns={['Cybersecurity', 'Compliance', 'Geopolitical', 'Reputation']}
                    />
                    
                    {/* View All Button */}
                    <div className="text-center pt-4">
                      <button
                        onClick={() => setView('vendors')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        View All {vendors.length} Vendors
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </Card>

                {/* Recent Activity */}
                <Card header={<h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>}>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        {activity.icon}
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{activity.text}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
                </div>
                    ))}
                </div>
                </Card>
              </div>
          ) : view === 'vendors' && !selectedVendor ? (
              <VendorsTable
                onSelect={(vendor) => {
                  setSelectedVendor(vendor);
                  setUseNewDetailsView(true);
                }}
                vendors={searchQuery ? filteredVendors : vendors}
                searchQuery={searchQuery}
              />
            ) : view === 'vendors' && selectedVendor && useNewDetailsView ? (
              <NewVendorDetails 
                vendor={selectedVendor}
                onBack={() => {
                  setSelectedVendor(null);
                  setUseNewDetailsView(false);
                }} 
              />
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
            ) : view === 'intelligence' && selectedPillar === 'Cybersecurity' && selectedSubItem === 'Vulnerabilities' ? (
              <VulnerabilitiesTable />
            ) : view === 'intelligence' && selectedPillar === 'Cybersecurity' && selectedSubItem === 'Attack Surface' ? (
              <AttackSurfaceTable />
            ) : view === 'intelligence' && selectedPillar === 'Cybersecurity' && selectedSubItem === 'Web/App Security' ? (
              <WebAppSecurityTable />
            ) : view === 'intelligence' && selectedPillar === 'Cybersecurity' && selectedSubItem === 'Cloud & Infra' ? (
              <CloudInfraTable />
            ) : view === 'intelligence' && selectedPillar === 'Cybersecurity' && selectedSubItem === 'Email Security' ? (
              <EmailSecurityTable />
            ) : view === 'intelligence' && selectedPillar === 'Cybersecurity' && selectedSubItem === 'Code Repo Exposure' ? (
              <CodeRepoExposureTable />
            ) : view === 'intelligence' && selectedPillar === 'Cybersecurity' && selectedSubItem === 'Endpoint Hygiene' ? (
              <EndpointHygieneTable />
            ) : view === 'intelligence' && selectedPillar === 'Cybersecurity' && selectedSubItem === 'IOC & Infra Threat' ? (
              <IOCInfraThreatTable />
            ) : view === 'intelligence' && selectedPillar === 'Cybersecurity' && selectedSubItem === 'Detection & Response' ? (
              <DetectionResponseTable />
            ) : view === 'intelligence' && selectedPillar === 'Compliance' && !selectedSubItem ? (
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
            ) : view === 'intelligence' && selectedPillar === 'Compliance' && selectedSubItem === 'Certifications' ? (
              <CertificationsTable />
            ) : view === 'intelligence' && selectedPillar === 'Compliance' && selectedSubItem === 'Questionnaire Results' ? (
              <QuestionnaireResultsTable />
            ) : view === 'intelligence' && selectedPillar === 'Compliance' && selectedSubItem === 'Regulatory Violations' ? (
              <RegulatoryViolationsTable />
            ) : view === 'intelligence' && selectedPillar === 'Compliance' && selectedSubItem === 'Privacy Compliance' ? (
              <PrivacyComplianceTable />
            ) : view === 'intelligence' && selectedPillar === 'Compliance' && selectedSubItem === 'Contractual Clauses' ? (
              <ContractualClausesTable />
            ) : view === 'intelligence' && selectedPillar === 'Geopolitical' && !selectedSubItem ? (
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
            ) : view === 'intelligence' && selectedPillar === 'Geopolitical' && selectedSubItem === 'Country Risk' ? (
              <CountryRiskTable />
            ) : view === 'intelligence' && selectedPillar === 'Geopolitical' && selectedSubItem === 'Sector Risk' ? (
              <SectorRiskTable />
            ) : view === 'intelligence' && selectedPillar === 'Geopolitical' && selectedSubItem === 'Company Size' ? (
              <CompanySizeTable />
            ) : view === 'intelligence' && selectedPillar === 'Geopolitical' && selectedSubItem === 'Infra Jurisdiction' ? (
              <InfraJurisdictionTable />
            ) : view === 'intelligence' && selectedPillar === 'Geopolitical' && selectedSubItem === 'Concentration Risk' ? (
              <ConcentrationRiskTable />
            ) : view === 'intelligence' && selectedPillar === 'Geopolitical' && selectedSubItem === 'Environmental Exposure' ? (
              <EnvironmentalExposureTable />
            ) : view === 'intelligence' && selectedPillar === 'Reputation' && !selectedSubItem ? (
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
            ) : view === 'intelligence' && selectedPillar === 'Reputation' && selectedSubItem === 'Data Breach History' ? (
              <DataBreachHistoryTable />
            ) : view === 'intelligence' && selectedPillar === 'Reputation' && selectedSubItem === 'Credential/Data Leaks' ? (
              <CredentialDataLeaksTable />
            ) : view === 'intelligence' && selectedPillar === 'Reputation' && selectedSubItem === 'Brand Spoofing' ? (
              <BrandSpoofingTable />
            ) : view === 'intelligence' && selectedPillar === 'Reputation' && selectedSubItem === 'Dark Web Presence' ? (
              <DarkWebPresenceTable />
            ) : view === 'intelligence' && selectedPillar === 'Reputation' && selectedSubItem === 'Social Sentiment' ? (
              <SocialSentimentTable />
            ) : view === 'reports' ? (
              <Reports />
            ) : view === 'cortex' ? (
              <CortexEngine />
            ) : view === 'add-vendor' ? (
              <AddVendor onBack={() => setView('vendors')} />
          ) : null}
        </div>
      </div>
    </div>

      {/* Enhanced User Modal - More Compact - Positioned Below Profile */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 animate-fade-in" onClick={() => setShowUserModal(false)}>
          <div className="absolute top-22 right-4 bg-white rounded-xl p-6 w-80 shadow-xl animate-slide-up border border-gray-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-sm font-semibold">JS</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">John Smith</h3>
                <p className="text-sm text-gray-500">DHKNF Biotech</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <button className="w-full text-left p-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 border border-transparent hover:border-blue-200 group">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Settings</span>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-green-50 hover:text-green-600 transition-all duration-200 border border-transparent hover:border-green-200 group">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Change Portfolio</span>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-200 border border-transparent hover:border-red-200 group">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Logout</span>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
              </button>
            </div>
            
            <button
              onClick={() => setShowUserModal(false)}
              className="w-full p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}