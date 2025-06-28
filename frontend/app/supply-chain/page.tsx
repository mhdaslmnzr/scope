'use client'

import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { 
  Network, 
  MapPin, 
  Globe, 
  TrendingUp, 
  AlertTriangle, 
  Shield,
  Search,
  Filter,
  Download,
  Eye,
  BarChart3,
  Link,
  Building2,
  Users,
  Activity
} from 'lucide-react'

interface SupplyChainData {
  vendor_id: number
  vendor_name: string
  sector: string
  country: string
  risk_score: number
  risk_level: string
  connection_type: string
  criticality: string
  last_assessment: string
  dependencies: string[]
}

export default function SupplyChainIntel() {
  const [supplyChainData, setSupplyChainData] = useState<SupplyChainData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRisk, setFilterRisk] = useState('all')
  const [filterSector, setFilterSector] = useState('all')

  useEffect(() => {
    // Simulate fetching supply chain data
    const mockData: SupplyChainData[] = [
      {
        vendor_id: 1,
        vendor_name: "Pharmexis BioTech",
        sector: "Pharmaceuticals",
        country: "India",
        risk_score: 45,
        risk_level: "Medium",
        connection_type: "Direct",
        criticality: "High",
        last_assessment: "2024-12-15",
        dependencies: ["AWS", "Twilio", "Netlify"]
      },
      {
        vendor_id: 2,
        vendor_name: "TechFlow Solutions",
        sector: "Technology",
        country: "United States",
        risk_score: 38,
        risk_level: "Medium",
        connection_type: "Direct",
        criticality: "Medium",
        last_assessment: "2024-12-10",
        dependencies: ["Azure", "Slack", "GitHub"]
      },
      {
        vendor_id: 3,
        vendor_name: "GlobalBank Financial",
        sector: "Financial Services",
        country: "United Kingdom",
        risk_score: 52,
        risk_level: "Medium",
        connection_type: "Indirect",
        criticality: "Critical",
        last_assessment: "2024-12-20",
        dependencies: ["Oracle", "Salesforce", "Workday"]
      },
      {
        vendor_id: 4,
        vendor_name: "SecureNet Cybersecurity",
        sector: "Cybersecurity",
        country: "Canada",
        risk_score: 28,
        risk_level: "Low",
        connection_type: "Direct",
        criticality: "Medium",
        last_assessment: "2024-12-05",
        dependencies: ["AWS", "CrowdStrike", "Palo Alto"]
      },
      {
        vendor_id: 5,
        vendor_name: "DataVault Cloud",
        sector: "Cloud Services",
        country: "Australia",
        risk_score: 42,
        risk_level: "Medium",
        connection_type: "Direct",
        criticality: "High",
        last_assessment: "2024-12-18",
        dependencies: ["Google Cloud", "MongoDB", "Redis"]
      }
    ]
    
    setSupplyChainData(mockData)
    setLoading(false)
  }, [])

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'High': return 'text-orange-600 bg-orange-100'
      case 'Critical': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'Low': return 'text-gray-600 bg-gray-100'
      case 'Medium': return 'text-blue-600 bg-blue-100'
      case 'High': return 'text-orange-600 bg-orange-100'
      case 'Critical': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const filteredData = supplyChainData.filter(item => {
    const matchesSearch = item.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sector.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRisk = filterRisk === 'all' || item.risk_level === filterRisk
    const matchesSector = filterSector === 'all' || item.sector === filterSector
    
    return matchesSearch && matchesRisk && matchesSector
  })

  const riskLevels = ['Low', 'Medium', 'High', 'Critical']
  const sectors = [...new Set(supplyChainData.map(item => item.sector))]

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
            <h1 className="text-2xl font-bold text-gray-900">Supply Chain Intelligence</h1>
            <p className="text-gray-600">Comprehensive vendor network analysis and risk mapping</p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              <BarChart3 className="h-4 w-4" />
              <span>Generate Report</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </button>
          </div>
        </div>

        {/* Supply Chain Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                <p className="text-2xl font-bold text-gray-900">{supplyChainData.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Network className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">In supply chain</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Dependencies</p>
                <p className="text-2xl font-bold text-red-600">
                  {supplyChainData.filter(item => item.criticality === 'Critical').length}
                </p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">Require immediate attention</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Countries</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(supplyChainData.map(item => item.country)).size}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Globe className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">Geographic spread</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Risk Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(supplyChainData.reduce((sum, item) => sum + item.risk_score, 0) / supplyChainData.length)}
                </p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">Across all vendors</span>
            </div>
          </div>
        </div>

        {/* Supply Chain Map Visualization */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Supply Chain Network Map</h2>
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <Network className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Interactive supply chain network visualization</p>
            <p className="text-sm text-gray-400">Shows vendor relationships, dependencies, and risk flows</p>
            <button className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              View Full Network Map
            </button>
          </div>
        </div>

        {/* Vendor Network Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <h2 className="text-lg font-semibold text-gray-900">Vendor Network Analysis</h2>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search vendors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                {/* Risk Filter */}
                <select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Risk Levels</option>
                  {riskLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                
                {/* Sector Filter */}
                <select
                  value={filterSector}
                  onChange={(e) => setFilterSector(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Sectors</option>
                  {sectors.map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
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
                    Sector
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Criticality
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dependencies
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.vendor_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.vendor_name}</div>
                        <div className="text-sm text-gray-500">{item.country}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{item.sector}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              item.risk_score < 30 ? 'bg-green-500' :
                              item.risk_score < 60 ? 'bg-yellow-500' :
                              item.risk_score < 80 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${item.risk_score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{item.risk_score}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCriticalityColor(item.criticality)}`}>
                        {item.criticality}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {item.dependencies.slice(0, 2).map((dep, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                            {dep}
                          </span>
                        ))}
                        {item.dependencies.length > 2 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                            +{item.dependencies.length - 2}
                          </span>
                        )}
                      </div>
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

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <Network className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No vendors found matching your criteria</p>
            </div>
          )}
        </div>

        {/* Risk Analysis Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Risk Factors</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Third-party dependencies</span>
                <span className="text-sm font-medium text-red-600">High</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Geographic concentration</span>
                <span className="text-sm font-medium text-yellow-600">Medium</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Single points of failure</span>
                <span className="text-sm font-medium text-orange-600">Medium</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Compliance gaps</span>
                <span className="text-sm font-medium text-green-600">Low</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-primary-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Diversify critical vendors</p>
                  <p className="text-xs text-gray-500">Reduce dependency on single vendors</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Geographic distribution</p>
                  <p className="text-xs text-gray-500">Spread vendors across regions</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <TrendingUp className="h-5 w-5 text-primary-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Continuous monitoring</p>
                  <p className="text-xs text-gray-500">Real-time risk assessment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
} 