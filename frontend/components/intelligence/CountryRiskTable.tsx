import React, { useState } from 'react';

const mockData = [
  { id: 1, country: 'USA', risk: 'Medium', lastUpdated: '2024-06-10' },
  { id: 2, country: 'China', risk: 'High', lastUpdated: '2024-06-09' },
  { id: 3, country: 'Germany', risk: 'Low', lastUpdated: '2024-06-08' },
];

export default function CountryRiskTable() {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('');

  const filtered = mockData.filter(row =>
    (!search || row.country.toLowerCase().includes(search.toLowerCase())) &&
    (!riskFilter || row.risk === riskFilter)
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Country Risk</h1>
      </div>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search countries..."
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
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Country</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Risk</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Updated</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {filtered.map(row => (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{row.country}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.risk}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.lastUpdated}</td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={3} className="text-center text-gray-400 py-8">No countries found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 