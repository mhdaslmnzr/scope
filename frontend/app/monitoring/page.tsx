'use client'

import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { 
  AlertTriangle, 
  Bell, 
  CheckCircle, 
  Clock, 
  Eye, 
  Filter,
  RefreshCw,
  Search,
  Shield,
  XCircle,
  Zap,
  Activity,
  TrendingUp,
  AlertCircle
} from 'lucide-react'

interface SecurityAlert {
  id: number
  vendor_id: number
  vendor_name: string
  alert_type: string
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
  title: string
  description: string
  status: 'Active' | 'Acknowledged' | 'Resolved'
  created_at: string
  resolved_at?: string
}

interface MonitoringEvent {
  id: number
  vendor_id: number
  vendor_name: string
  event_type: string
  event_data: any
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
  created_at: string
}

interface MonitoringStats {
  total_alerts: number
  active_alerts: number
  critical_alerts: number
  total_events: number
  vendors_monitored: number
}

export default function MonitoringPage() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([])
  const [events, setEvents] = useState<MonitoringEvent[]>([])
  const [stats, setStats] = useState<MonitoringStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterSeverity, setFilterSeverity] = useState('all')
  const [filterStatus, setFilterStatus] = useState('Active')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchMonitoringData()
    // Set up polling for real-time updates
    const interval = setInterval(fetchMonitoringData, 30000) // Poll every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchMonitoringData = async () => {
    try {
      setLoading(true)
      setError(null)
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      
      const [alertsResponse, eventsResponse] = await Promise.all([
        fetch(`${apiBase}/api/alerts?status=${filterStatus}`),
        fetch(`${apiBase}/api/monitoring/events`)
      ])
      
      if (!alertsResponse.ok || !eventsResponse.ok) {
        throw new Error('Failed to fetch monitoring data')
      }
      
      const alertsData = await alertsResponse.json()
      const eventsData = await eventsResponse.json()
      
      setAlerts(alertsData.alerts || [])
      setEvents(eventsData.events || [])
      
      // Calculate stats
      const activeAlerts = alertsData.alerts?.filter((a: SecurityAlert) => a.status === 'Active') || []
      const criticalAlerts = activeAlerts.filter((a: SecurityAlert) => a.severity === 'Critical')
      
      setStats({
        total_alerts: alertsData.alerts?.length || 0,
        active_alerts: activeAlerts.length,
        critical_alerts: criticalAlerts.length,
        total_events: eventsData.events?.length || 0,
        vendors_monitored: new Set(eventsData.events?.map((e: MonitoringEvent) => e.vendor_id)).size
      })
    } catch (error) {
      console.error('Error fetching monitoring data:', error)
      setError('Failed to load monitoring data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const runMonitoringCheck = async () => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiBase}/api/monitoring/check`, {
        method: 'POST'
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('Monitoring check completed:', result)
        // Refresh data after check
        fetchMonitoringData()
      }
    } catch (error) {
      console.error('Error running monitoring check:', error)
    }
  }

  const updateAlertStatus = async (alertId: number, status: string) => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiBase}/api/alerts/${alertId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      
      if (response.ok) {
        // Update local state
        setAlerts(prev => prev.map(alert => 
          alert.id === alertId ? { ...alert, status: status as any } : alert
        ))
      }
    } catch (error) {
      console.error('Error updating alert status:', error)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return 'text-green-600 bg-green-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'High': return 'text-orange-600 bg-orange-100'
      case 'Critical': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Low': return <CheckCircle className="h-4 w-4" />
      case 'Medium': return <AlertCircle className="h-4 w-4" />
      case 'High': return <AlertTriangle className="h-4 w-4" />
      case 'Critical': return <XCircle className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity
    return matchesSearch && matchesSeverity
  })

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
            <h1 className="text-2xl font-bold text-gray-900">Security Monitoring</h1>
            <p className="text-gray-600">Real-time security alerts and monitoring events</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={runMonitoringCheck}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Zap className="h-4 w-4" />
              <span>Run Check</span>
            </button>
            <button
              onClick={fetchMonitoringData}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
            <XCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Alerts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_alerts}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Bell className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.active_alerts}</p>
                </div>
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
                  <p className="text-2xl font-bold text-red-600">{stats.critical_alerts}</p>
                </div>
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monitoring Events</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_events}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Vendors Monitored</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.vendors_monitored}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Severities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="Active">Active</option>
                <option value="Acknowledged">Acknowledged</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Security Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredAlerts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No alerts found</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div key={alert.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                          {getSeverityIcon(alert.severity)}
                          <span className="ml-1">{alert.severity}</span>
                        </span>
                        <span className="text-sm text-gray-500">{alert.alert_type}</span>
                        <span className="text-sm text-gray-500">{alert.vendor_name}</span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{alert.title}</h3>
                      <p className="text-gray-600 mb-3">{alert.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {new Date(alert.created_at).toLocaleString()}
                        </span>
                        {alert.resolved_at && (
                          <span className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Resolved: {new Date(alert.resolved_at).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {alert.status === 'Active' && (
                        <>
                          <button
                            onClick={() => updateAlertStatus(alert.id, 'Acknowledged')}
                            className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors"
                          >
                            Acknowledge
                          </button>
                          <button
                            onClick={() => updateAlertStatus(alert.id, 'Resolved')}
                            className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                          >
                            Resolve
                          </button>
                        </>
                      )}
                      {alert.status === 'Acknowledged' && (
                        <button
                          onClick={() => updateAlertStatus(alert.id, 'Resolved')}
                          className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Monitoring Events</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {events.slice(0, 10).map((event) => (
              <div key={event.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(event.severity)}`}>
                      {getSeverityIcon(event.severity)}
                      <span className="ml-1">{event.severity}</span>
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{event.event_type}</p>
                      <p className="text-sm text-gray-500">{event.vendor_name}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(event.created_at).toLocaleString()}
                  </div>
                </div>
                {event.event_data && (
                  <div className="mt-2 text-sm text-gray-600">
                    <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto">
                      {JSON.stringify(event.event_data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
} 