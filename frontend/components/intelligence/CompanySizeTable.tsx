import React, { useState } from 'react';

const mockData = [
  { id: 1, company: 'Acme Corp', size: 'Large', risk: 'Medium', lastUpdated: '2024-06-10' },
  { id: 2, company: 'CyberSafe', size: 'Small', risk: 'High', lastUpdated: '2024-06-09' },
  { id: 3, company: 'D Pharma', size: 'Medium', risk: 'Low', lastUpdated: '2024-06-08' },
];

export default function CompanySizeTable() {
  const [search, setSearch] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');

  const filtered = mockData.filter(row =>
    (!search || row.company.toLowerCase().includes(search.toLowerCase())) &&
    (!sizeFilter || row.size === sizeFilter)
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Company Size</h1>
      </div>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search companies..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg w-48"
        />
        <select value={sizeFilter} onChange={e => setSizeFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
          <option value="">All Sizes</option>
          <option value="Small">Small</option>
          <option value="Medium">Medium</option>
          <option value="Large">Large</option>
        </select>
      </div>
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Size</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Risk</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Updated</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {filtered.map(row => (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{row.company}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.size}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.risk}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.lastUpdated}</td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={4} className="text-center text-gray-400 py-8">No companies found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 