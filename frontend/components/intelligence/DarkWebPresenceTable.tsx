import React, { useState } from 'react';

const mockData = [
  { id: 1, vendor: 'Acme Corp', type: 'Credential', detected: '2024-02-01', status: 'Active' },
  { id: 2, vendor: 'CyberSafe', type: 'PII', detected: '2024-03-10', status: 'Inactive' },
  { id: 3, vendor: 'D Pharma', type: 'Financial', detected: '2024-04-15', status: 'Active' },
];

export default function DarkWebPresenceTable() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filtered = mockData.filter(row =>
    (!search || row.vendor.toLowerCase().includes(search.toLowerCase())) &&
    (!typeFilter || row.type === typeFilter)
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dark Web Presence</h1>
      </div>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search vendors..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg w-48"
        />
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
          <option value="">All Types</option>
          <option value="Credential">Credential</option>
          <option value="PII">PII</option>
          <option value="Financial">Financial</option>
        </select>
      </div>
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vendor</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Detected</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {filtered.map(row => (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{row.vendor}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.type}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.detected}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.status}</td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={4} className="text-center text-gray-400 py-8">No presence found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 