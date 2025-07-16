import { useState } from 'react';

const MOCK_VULNS = [
  { cve: 'CVE-2024-1234', vendor: 'Acme Corp', severity: 'Critical', status: 'Open', date: '2024-06-10' },
  { cve: 'CVE-2024-2345', vendor: 'CyberSafe', severity: 'High', status: 'In Progress', date: '2024-06-09' },
  { cve: 'CVE-2023-9999', vendor: 'D Pharma', severity: 'Medium', status: 'Closed', date: '2024-06-08' },
  { cve: 'CVE-2022-8888', vendor: 'DataVault', severity: 'Low', status: 'Open', date: '2024-06-07' },
  { cve: 'CVE-2024-5678', vendor: 'Acme Corp', severity: 'High', status: 'Open', date: '2024-06-06' },
];

const SEVERITIES = ['Critical', 'High', 'Medium', 'Low'];
const STATUSES = ['Open', 'In Progress', 'Closed'];
const VENDORS = ['Acme Corp', 'CyberSafe', 'D Pharma', 'DataVault'];

export default function VulnerabilitiesTable() {
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('');
  const [status, setStatus] = useState('');
  const [vendor, setVendor] = useState('');

  const filtered = MOCK_VULNS.filter(vuln =>
    (!search || vuln.cve.toLowerCase().includes(search.toLowerCase())) &&
    (!severity || vuln.severity === severity) &&
    (!status || vuln.status === status) &&
    (!vendor || vuln.vendor === vendor)
  );

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl font-bold text-blue-700">Vulnerabilities</span>
        <span className="text-gray-400">({filtered.length})</span>
      </div>
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search CVE..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48"
        />
        <select value={severity} onChange={e => setSeverity(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
          <option value="">All Severities</option>
          {SEVERITIES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={vendor} onChange={e => setVendor(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
          <option value="">All Vendors</option>
          {VENDORS.map(v => <option key={v}>{v}</option>)}
        </select>
      </div>
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">CVE</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vendor</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Severity</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Found</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filtered.map((vuln, idx) => (
              <tr key={vuln.cve + vuln.vendor} className="hover:bg-blue-50">
                <td className="px-6 py-4 whitespace-nowrap font-mono text-blue-700 font-semibold">{vuln.cve}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">{vuln.vendor}</td>
                <td className={`px-6 py-4 whitespace-nowrap font-semibold ${vuln.severity === 'Critical' ? 'text-red-700' : vuln.severity === 'High' ? 'text-orange-700' : vuln.severity === 'Medium' ? 'text-yellow-700' : 'text-green-700'}`}>{vuln.severity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{vuln.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{vuln.date}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="text-center text-gray-400 py-8">No vulnerabilities found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 