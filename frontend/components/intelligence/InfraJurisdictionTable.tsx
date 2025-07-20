import React, { useState } from 'react';

const mockData = [
  { id: 1, region: 'US-East', jurisdiction: 'USA', risk: 'Medium', lastChecked: '2024-06-10' },
  { id: 2, region: 'EU-West', jurisdiction: 'Germany', risk: 'Low', lastChecked: '2024-06-09' },
  { id: 3, region: 'APAC', jurisdiction: 'Singapore', risk: 'High', lastChecked: '2024-06-08' },
];

export default function InfraJurisdictionTable() {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('');

  const filtered = mockData.filter(row =>
    (!search || row.region.toLowerCase().includes(search.toLowerCase())) &&
    (!riskFilter || row.risk === riskFilter)
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Infra Jurisdiction</h1>
      </div>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search regions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg w-48"
        />
        <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
          <option value="">All Risks</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Region</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Jurisdiction</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Risk</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Checked</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {filtered.map(row => (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{row.region}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.jurisdiction}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.risk}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.lastChecked}</td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={4} className="text-center text-gray-400 py-8">No regions found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 