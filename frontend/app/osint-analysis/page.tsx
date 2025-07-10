'use client'

import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { 
  Search, 
  Shield, 
  Globe, 
  Lock, 
  Mail, 
  Network, 
  Eye,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  Zap,
  Clock
} from 'lucide-react'

interface OSINTScores {
  ssl_score: number
  dns_email_score: number
  http_headers_score: number
  open_ports_score: number
  reputation_score: number
}

interface OSINTData {
  domain: string
  collection_timestamp: number
  basic_info: any
  ssl_info: any
  dns_info: any
  http_headers: any
  port_scan: any
  shodan_data: any
  dark_web_exposure: any
  scores: OSINTScores
}

export default function OSINTAnalysisPage() {
  const [domain, setDomain] = useState('')
  const [osintData, setOsintData] = useState<OSINTData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  const handleSearch = async () => {
    if (!domain.trim()) return

    setLoading(true)
    setError('')
    
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiBase}/api/osint/collect/${domain}`)
      
      if (!response.ok) {
        throw new Error('Failed to collect OSINT data')
      }
      
      const data = await response.json()
      setOsintData(data.osint_data)
      
      // Add to recent searches
      setRecentSearches(prev => {
        const newSearches = [domain, ...prev.filter(s => s !== domain)].slice(0, 5)
        return newSearches
      })
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    if (score >= 40) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-4 w-4" />
    if (score >= 60) return <AlertTriangle className="h-4 w-4" />
    return <XCircle className="h-4 w-4" />
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">OSINT Analysis</h1>
            <p className="text-gray-600">Collect and analyze cyber intelligence for vendor domains</p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter domain (e.g., example.com)"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !domain.trim()}
              className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span>{loading ? 'Analyzing...' : 'Analyze'}</span>
            </button>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Recent searches:</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => setDomain(search)}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}
        </div>

        {/* OSINT Results */}
        {osintData && (
          <div className="space-y-6">
            {/* Domain Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Domain Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Domain</p>
                  <p className="font-medium">{osintData.domain}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Analysis Date</p>
                  <p className="font-medium">{formatDate(osintData.collection_timestamp)}</p>
                </div>
                {osintData.basic_info && !osintData.basic_info.error && (
                  <>
                    <div>
                      <p className="text-sm text-gray-600">Registrar</p>
                      <p className="font-medium">{osintData.basic_info.registrar || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Country</p>
                      <p className="font-medium">{osintData.basic_info.country || 'N/A'}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Risk Scores */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment Scores</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lock className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">SSL/TLS Security</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(osintData.scores.ssl_score)}`}>
                      {getScoreIcon(osintData.scores.ssl_score)}
                      <span className="ml-1">{osintData.scores.ssl_score}/100</span>
                    </span>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Mail className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Email Security</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(osintData.scores.dns_email_score)}`}>
                      {getScoreIcon(osintData.scores.dns_email_score)}
                      <span className="ml-1">{osintData.scores.dns_email_score}/100</span>
                    </span>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">HTTP Headers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(osintData.scores.http_headers_score)}`}>
                      {getScoreIcon(osintData.scores.http_headers_score)}
                      <span className="ml-1">{osintData.scores.http_headers_score}/100</span>
                    </span>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Network className="h-5 w-5 text-orange-600" />
                    <span className="font-medium">Port Security</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(osintData.scores.open_ports_score)}`}>
                      {getScoreIcon(osintData.scores.open_ports_score)}
                      <span className="ml-1">{osintData.scores.open_ports_score}/100</span>
                    </span>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Globe className="h-5 w-5 text-indigo-600" />
                    <span className="font-medium">Reputation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(osintData.scores.reputation_score)}`}>
                      {getScoreIcon(osintData.scores.reputation_score)}
                      <span className="ml-1">{osintData.scores.reputation_score}/100</span>
                    </span>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Eye className="h-5 w-5 text-red-600" />
                    <span className="font-medium">Dark Web Exposure</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      osintData.dark_web_exposure.exposed 
                        ? 'text-red-600 bg-red-100' 
                        : 'text-green-600 bg-green-100'
                    }`}>
                      {osintData.dark_web_exposure.exposed ? (
                        <XCircle className="h-4 w-4" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      <span className="ml-1">
                        {osintData.dark_web_exposure.exposed ? 'Exposed' : 'Clean'}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* SSL/TLS Analysis */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">SSL/TLS Analysis</h3>
                {osintData.ssl_info && !osintData.ssl_info.error ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Certificate Valid:</span>
                      <span className={`text-sm font-medium ${osintData.ssl_info.certificate_valid ? 'text-green-600' : 'text-red-600'}`}>
                        {osintData.ssl_info.certificate_valid ? 'Yes' : 'No'}
                      </span>
                    </div>
                    {osintData.ssl_info.certificate_valid && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Days Until Expiry:</span>
                          <span className="text-sm font-medium">{osintData.ssl_info.days_until_expiry}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Cipher Suite:</span>
                          <span className="text-sm font-medium">{osintData.ssl_info.cipher_suite || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Protocol:</span>
                          <span className="text-sm font-medium">{osintData.ssl_info.protocol_version || 'N/A'}</span>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">SSL/TLS information unavailable</p>
                )}
              </div>

              {/* DNS Security Analysis */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">DNS Security Analysis</h3>
                {osintData.dns_info && !osintData.dns_info.error ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">SPF Record:</span>
                      <span className={`text-sm font-medium ${osintData.dns_info.spf_record ? 'text-green-600' : 'text-red-600'}`}>
                        {osintData.dns_info.spf_record ? 'Present' : 'Missing'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">DMARC Record:</span>
                      <span className={`text-sm font-medium ${osintData.dns_info.dmarc_record ? 'text-green-600' : 'text-red-600'}`}>
                        {osintData.dns_info.dmarc_record ? 'Present' : 'Missing'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">MX Records:</span>
                      <span className="text-sm font-medium">{osintData.dns_info.mx_records?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">A Records:</span>
                      <span className="text-sm font-medium">{osintData.dns_info.a_records?.length || 0}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">DNS information unavailable</p>
                )}
              </div>

              {/* Port Scan Results */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Port Scan Results</h3>
                {osintData.port_scan && !osintData.port_scan.error ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">IP Address:</span>
                      <span className="text-sm font-medium">{osintData.port_scan.ip_address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Open Ports:</span>
                      <span className="text-sm font-medium">{osintData.port_scan.open_ports?.length || 0}</span>
                    </div>
                    {osintData.port_scan.open_ports && osintData.port_scan.open_ports.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-600">Ports:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {osintData.port_scan.open_ports.map((port: number, index: number) => (
                            <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                              {port}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Port scan information unavailable</p>
                )}
              </div>

              {/* HTTP Security Headers */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">HTTP Security Headers</h3>
                {osintData.http_headers && !osintData.http_headers.error ? (
                  <div className="space-y-3">
                    {Object.entries(osintData.http_headers.security_headers || {}).map(([header, value]) => (
                      <div key={header} className="flex justify-between">
                        <span className="text-sm text-gray-600">{header.replace(/_/g, ' ').toUpperCase()}:</span>
                        <span className={`text-sm font-medium ${value ? 'text-green-600' : 'text-red-600'}`}>
                          {value ? 'Present' : 'Missing'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">HTTP headers information unavailable</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!osintData && !loading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start OSINT Analysis</h3>
            <p className="text-gray-500 mb-4">
              Enter a domain name above to begin collecting cyber intelligence data
            </p>
            <div className="text-sm text-gray-400">
              <p>• SSL/TLS certificate analysis</p>
              <p>• DNS security checks (SPF, DMARC)</p>
              <p>• HTTP security headers</p>
              <p>• Port scanning</p>
              <p>• Dark web exposure simulation</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
} 