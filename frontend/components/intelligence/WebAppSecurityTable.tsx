import React, { useState } from 'react';

const mockData = [
  { id: 1, app: 'Portal', issue: 'XSS', severity: 'High', lastTested: '2024-06-10' },
  { id: 2, app: 'API', issue: 'Broken Auth', severity: 'Medium', lastTested: '2024-06-09' },
  { id: 3, app: 'Admin', issue: 'CSRF', severity: 'Low', lastTested: '2024-06-08' },
];

export default function WebAppSecurityTable() {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');

  const filtered = mockData.filter(row =>
    (!search || row.app.toLowerCase().includes(search.toLowerCase())) &&
    (!severityFilter || row.severity === severityFilter)
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Web/App Security</h1>
      </div>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search apps..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg w-48"
        />
        <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
          <option value="">All Severities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">App</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Issue</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Severity</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Tested</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filtered.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{row.app}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.issue}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.severity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.lastTested}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={4} className="text-center text-gray-400 py-8">No issues found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 