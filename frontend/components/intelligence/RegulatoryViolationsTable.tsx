import React, { useState } from 'react';

const mockData = [
  { id: 1, regulation: 'GDPR', vendor: 'Acme Corp', violation: 'Data Breach', date: '2024-06-10' },
  { id: 2, regulation: 'HIPAA', vendor: 'D Pharma', violation: 'Unauthorized Access', date: '2024-06-09' },
  { id: 3, regulation: 'SOX', vendor: 'CyberSafe', violation: 'Audit Failure', date: '2024-06-08' },
];

export default function RegulatoryViolationsTable() {
  const [search, setSearch] = useState('');
  const [regulationFilter, setRegulationFilter] = useState('');

  const filtered = mockData.filter(row =>
    (!search || row.vendor.toLowerCase().includes(search.toLowerCase())) &&
    (!regulationFilter || row.regulation === regulationFilter)
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Regulatory Violations</h1>
      </div>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search vendors..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg w-48"
        />
        <select value={regulationFilter} onChange={e => setRegulationFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
          <option value="">All Regulations</option>
          <option value="GDPR">GDPR</option>
          <option value="HIPAA">HIPAA</option>
          <option value="SOX">SOX</option>
        </select>
      </div>
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Regulation</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vendor</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Violation</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {filtered.map(row => (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{row.regulation}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.vendor}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.violation}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.date}</td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={4} className="text-center text-gray-400 py-8">No violations found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 