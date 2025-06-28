"use client"

import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { AlertCircle, Shield, Search, Flame, Bug, Globe, Download, BarChart3 } from "lucide-react";

interface ThreatIntel {
  id: number;
  vendor_name: string;
  threat_type: string;
  severity: string;
  description: string;
  detected_on: string;
  ioc: string;
  status: string;
}

export default function ThreatIntelPage() {
  const [threats, setThreats] = useState<ThreatIntel[]>([]);
  const [search, setSearch] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");

  useEffect(() => {
    // Mock threat intelligence data
    setThreats([
      {
        id: 1,
        vendor_name: "TechFlow Solutions",
        threat_type: "Malware",
        severity: "High",
        description: "Detected Emotet malware beaconing from vendor network.",
        detected_on: "2024-06-01",
        ioc: "192.168.1.100",
        status: "Active",
      },
      {
        id: 2,
        vendor_name: "GlobalBank Financial",
        threat_type: "Phishing Domain",
        severity: "Medium",
        description: "Suspicious domain targeting employees: login-globalbank.com.",
        detected_on: "2024-06-03",
        ioc: "login-globalbank.com",
        status: "Mitigated",
      },
      {
        id: 3,
        vendor_name: "Pharmexis BioTech",
        threat_type: "Zero-Day Vulnerability",
        severity: "Critical",
        description: "Zero-day exploit in vendor's web portal (CVE-2024-12345).",
        detected_on: "2024-06-05",
        ioc: "CVE-2024-12345",
        status: "Investigating",
      },
      {
        id: 4,
        vendor_name: "DataVault Cloud",
        threat_type: "Botnet Activity",
        severity: "Low",
        description: "Low-level botnet scanning detected from external IPs.",
        detected_on: "2024-06-07",
        ioc: "203.0.113.45",
        status: "Active",
      },
    ]);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Low":
        return "text-green-600 bg-green-100";
      case "Medium":
        return "text-yellow-600 bg-yellow-100";
      case "High":
        return "text-orange-600 bg-orange-100";
      case "Critical":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const filteredThreats = threats.filter((t) => {
    const matchesSearch =
      t.vendor_name.toLowerCase().includes(search.toLowerCase()) ||
      t.threat_type.toLowerCase().includes(search.toLowerCase()) ||
      t.ioc.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity = filterSeverity === "all" || t.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Threat Intelligence</h1>
            <p className="text-gray-600">Monitor and analyze real-time threat indicators across your supply chain</p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export Threats</span>
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <h2 className="text-lg font-semibold text-gray-900">Recent Threats</h2>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search threats..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
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
            </div>
          </div>
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Threat Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IOC</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detected On</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredThreats.map((threat) => (
                  <tr key={threat.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{threat.vendor_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{threat.threat_type}</div>
                      <div className="text-sm text-gray-500">{threat.description.substring(0, 50)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(threat.severity)}`}>
                        {threat.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{threat.ioc}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(threat.detected_on).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{threat.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-900 flex items-center space-x-1">
                        <Shield className="h-4 w-4" />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredThreats.length === 0 && (
            <div className="text-center py-12">
              <Flame className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No threats found matching your criteria</p>
            </div>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Threat Analysis & Trends</h2>
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Visualize threat types, frequency, and vendor exposure</p>
            <p className="text-sm text-gray-400">Charts and analytics coming soon</p>
          </div>
        </div>
      </div>
    </Layout>
  );
} 