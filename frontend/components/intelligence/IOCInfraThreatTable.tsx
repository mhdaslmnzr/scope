import React, { useState } from 'react';

const mockData = [
  { id: 1, indicator: '1.2.3.4', type: 'IP', threat: 'Botnet', lastSeen: '2024-06-10' },
  { id: 2, indicator: 'malicious.com', type: 'Domain', threat: 'Phishing', lastSeen: '2024-06-09' },
  { id: 3, indicator: 'abcd1234', type: 'Hash', threat: 'Malware', lastSeen: '2024-06-08' },
];

export default function IOCInfraThreatTable() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filtered = mockData.filter(row =>
    (!search || row.indicator.toLowerCase().includes(search.toLowerCase())) &&
    (!typeFilter || row.type === typeFilter)
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">IOC & Infra Threat</h1>
      </div>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search indicators..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg w-48"
        />
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
          <option value="">All Types</option>
          <option value="IP">IP</option>
          <option value="Domain">Domain</option>
          <option value="Hash">Hash</option>
        </select>
      </div>
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Indicator</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Threat</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Seen</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {filtered.map(row => (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{row.indicator}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.type}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.threat}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.lastSeen}</td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={4} className="text-center text-gray-400 py-8">No indicators found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 