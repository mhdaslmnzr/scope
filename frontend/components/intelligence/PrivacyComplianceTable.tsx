import React, { useState } from 'react';

const mockData = [
  { id: 1, policy: 'GDPR', vendor: 'Acme Corp', status: 'Compliant', lastAudit: '2024-06-10' },
  { id: 2, policy: 'CCPA', vendor: 'CyberSafe', status: 'Non-Compliant', lastAudit: '2024-06-09' },
  { id: 3, policy: 'HIPAA', vendor: 'D Pharma', status: 'Compliant', lastAudit: '2024-06-08' },
];

export default function PrivacyComplianceTable() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = mockData.filter(row =>
    (!search || row.vendor.toLowerCase().includes(search.toLowerCase())) &&
    (!statusFilter || row.status === statusFilter)
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Privacy Compliance</h1>
      </div>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search vendors..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg w-48"
        />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
          <option value="">All Statuses</option>
          <option value="Compliant">Compliant</option>
          <option value="Non-Compliant">Non-Compliant</option>
        </select>
      </div>
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Policy</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vendor</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Audit</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {filtered.map(row => (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{row.policy}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.vendor}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.status}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.lastAudit}</td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={4} className="text-center text-gray-400 py-8">No results found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 