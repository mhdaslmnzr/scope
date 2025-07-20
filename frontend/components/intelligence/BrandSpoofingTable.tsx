import React, { useState } from 'react';

const mockData = [
  { id: 1, brand: 'Acme Corp', type: 'Website', detected: '2024-05-01', status: 'Active' },
  { id: 2, brand: 'CyberSafe', type: 'Email', detected: '2024-05-10', status: 'Inactive' },
  { id: 3, brand: 'D Pharma', type: 'Social', detected: '2024-05-15', status: 'Active' },
];

export default function BrandSpoofingTable() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filtered = mockData.filter(row =>
    (!search || row.brand.toLowerCase().includes(search.toLowerCase())) &&
    (!typeFilter || row.type === typeFilter)
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Brand Spoofing</h1>
      </div>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search brands..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg w-48"
        />
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
          <option value="">All Types</option>
          <option value="Website">Website</option>
          <option value="Email">Email</option>
          <option value="Social">Social</option>
        </select>
      </div>
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Brand</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Detected</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {filtered.map(row => (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{row.brand}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.type}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.detected}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.status}</td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={4} className="text-center text-gray-400 py-8">No spoofing found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 