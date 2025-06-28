'use client'

import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { 
  Shield, 
  AlertTriangle, 
  Calendar, 
  Users, 
  TrendingUp, 
  Eye,
  Search,
  Filter,
  Download,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  MapPin
} from 'lucide-react'

interface DataBreach {
  id: number
  vendor_name: string
  breach_date: string
  breach_type: string
  records_affected: number
  severity: string
  description: string
  resolution_status: string
  detection_date: string
  country: string
  sector: string
  financial_impact: string
  affected_data_types: string[]
}

export default function DataBreaches() {
  const [breaches, setBreaches] = useState<DataBreach[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSeverity, setFilterSeverity] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    // Simulate fetching breach data
    const mockBreaches: DataBreach[] = [
      {
        id: 1,
        vendor_name: "TechFlow Solutions",
        breach_date: "2024-11-15",
        breach_type: "Phishing Attack",
        records_affected: 2500,
        severity: "Medium",
        description: "Employee fell victim to sophisticated phishing attack, credentials compromised",
        resolution_status: "Resolved",
        detection_date: "2024-11-16",
        country: "United States",
        sector: "Technology",
        financial_impact: "$50,000",
        affected_data_types: ["Personal Information", "Credentials", "Internal Documents"]
      },
      {
        id: 2,
        vendor_name: "GlobalBank Financial",
        breach_date: "2024-10-22",
        breach_type: "Ransomware Attack",
        records_affected: 15000,
        severity: "High",
        description: "Ransomware encrypted critical systems, data exfiltration detected",
        resolution_status: "In Progress",
        detection_date: "2024-10-23",
        country: "United Kingdom",
        sector: "Financial Services",
        financial_impact: "$500,000",
        affected_data_types: ["Customer Data", "Financial Records", "System Backups"]
      },
      {
        id: 3,
        vendor_name: "Pharmexis BioTech",
        breach_date: "2024-09-08",
        breach_type: "Insider Threat",
        records_affected: 800,
        severity: "Low",
        description: "Former employee accessed company systems after termination",
        resolution_status: "Resolved",
        detection_date: "2024-09-10",
        country: "India",
        sector: "Pharmaceuticals",
        financial_impact: "$15,000",
        affected_data_types: ["Employee Data", "Research Documents"]
      },
      {
        id: 4,
        vendor_name: "DataVault Cloud",
        breach_date: "2024-12-01",
        breach_type: "API Vulnerability",
        records_affected: 5000,
        severity: "Medium",
        description: "Exposed API endpoint allowed unauthorized data access",
        resolution_status: "Investigating",
        detection_date: "2024-12-02",
        country: "Australia",
        sector: "Cloud Services",
        financial_impact: "$75,000",
        affected_data_types: ["Customer Data", "API Keys", "Configuration Files"]
      },
      {
        id: 5,
        vendor_name: "SecureNet Cybersecurity",
        breach_date: "2024-08-14",
        breach_type: "Supply Chain Attack",
        records_affected: 300,
        severity: "High",
        description: "Compromised third-party software update led to system breach",
        resolution_status: "Resolved",
        detection_date: "2024-08-15",
        country: "Canada",
        sector: "Cybersecurity",
        financial_impact: "$100,000",
        affected_data_types: ["System Logs", "Security Configurations", "Client Data"]
      }
    ]
    
    setBreaches(mockBreaches)
    setLoading(false)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return 'text-green-600 bg-green-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'High': return 'text-orange-600 bg-orange-100'
      case 'Critical': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'text-green-600 bg-green-100'
      case 'In Progress': return 'text-blue-600 bg-blue-100'
      case 'Investigating': return 'text-yellow-600 bg-yellow-100'
      case 'Open': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const filteredBreaches = breaches.filter(breach => {
    const matchesSearch = breach.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         breach.breach_type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = filterSeverity === 'all' || breach.severity === filterSeverity
    const matchesStatus = filterStatus === 'all' || breach.resolution_status === filterStatus
    
    return matchesSearch && matchesSeverity && matchesStatus
  })

  const severityLevels = ['Low', 'Medium', 'High', 'Critical']
  const statusOptions = ['Open', 'Investigating', 'In Progress', 'Resolved']

  const totalRecordsAffected = breaches.reduce((sum, breach) => sum + breach.records_affected, 0)
  const totalFinancialImpact = breaches.reduce((sum, breach) => sum + parseInt(breach.financial_impact.replace(/[$,]/g, '')), 0)
  const resolvedBreaches = breaches.filter(breach => breach.resolution_status === 'Resolved').length

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Data Breach Management</h1>
            <p className="text-gray-600">Track, analyze, and manage security incidents across your vendor network</p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              <AlertTriangle className="h-4 w-4" />
              <span>Report New Breach</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Breach Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Breaches</p>
                <p className="text-2xl font-bold text-gray-900">{breaches.length}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">This year</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Records Affected</p>
                <p className="text-2xl font-bold text-orange-600">{totalRecordsAffected.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">Across all incidents</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Financial Impact</p>
                <p className="text-2xl font-bold text-red-600">${totalFinancialImpact.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">Total estimated cost</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{resolvedBreaches}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">Successfully closed</span>
            </div>
          </div>
        </div>

        {/* Breach Trends Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Breach Trends Analysis</h2>
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Interactive breach trends and patterns visualization</p>
            <p className="text-sm text-gray-400">Shows breach frequency, types, and impact over time</p>
            <button className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              View Detailed Analytics
            </button>
          </div>
        </div>

        {/* Breaches Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <h2 className="text-lg font-semibold text-gray-900">Security Incidents</h2>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search breaches..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                {/* Severity Filter */}
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Severities</option>
                  {severityLevels.map(severity => (
                    <option key={severity} value={severity}>{severity}</option>
                  ))}
                </select>
                
                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Breach Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Records
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBreaches.map((breach) => (
                  <tr key={breach.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{breach.vendor_name}</div>
                        <div className="text-sm text-gray-500">{breach.sector}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{breach.breach_type}</div>
                        <div className="text-sm text-gray-500">{breach.description.substring(0, 50)}...</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(breach.severity)}`}>
                        {breach.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{breach.records_affected.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(breach.resolution_status)}`}>
                        {breach.resolution_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(breach.breach_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-900 flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBreaches.length === 0 && (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No breaches found matching your criteria</p>
            </div>
          )}
        </div>

        {/* Breach Analysis Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Breach Types</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Phishing Attacks</span>
                <span className="text-sm font-medium text-red-600">40%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Ransomware</span>
                <span className="text-sm font-medium text-orange-600">25%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Insider Threats</span>
                <span className="text-sm font-medium text-yellow-600">20%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Vulnerabilities</span>
                <span className="text-sm font-medium text-blue-600">15%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Detection Time</span>
                <span className="text-sm font-medium text-gray-900">1.2 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Resolution Time</span>
                <span className="text-sm font-medium text-gray-900">15.3 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Incident Response Rate</span>
                <span className="text-sm font-medium text-green-600">95%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Regulatory Compliance</span>
                <span className="text-sm font-medium text-green-600">100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
} 