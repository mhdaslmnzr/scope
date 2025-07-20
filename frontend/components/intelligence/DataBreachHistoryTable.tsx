import React, { useState } from 'react';

const mockData = [
  { id: 1, vendor: 'Acme Corp', breach: 'Ransomware', date: '2023-12-01', records: 10000 },
  { id: 2, vendor: 'CyberSafe', breach: 'Phishing', date: '2024-01-15', records: 5000 },
  { id: 3, vendor: 'D Pharma', breach: 'Insider', date: '2022-08-20', records: 2000 },
];

export default function DataBreachHistoryTable() {
  const [search, setSearch] = useState('');
  const [vendorFilter, setVendorFilter] = useState('');

  const filtered = mockData.filter(row =>
    (!search || row.breach.toLowerCase().includes(search.toLowerCase())) &&
    (!vendorFilter || row.vendor === vendorFilter)
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Data Breach History</h1>
      </div>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search breach types..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg w-48"
        />
        <select value={vendorFilter} onChange={e => setVendorFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
          <option value="">All Vendors</option>
          <option value="Acme Corp">Acme Corp</option>
          <option value="CyberSafe">CyberSafe</option>
          <option value="D Pharma">D Pharma</option>
        </select>
      </div>
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vendor</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Breach</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Records</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {filtered.map(row => (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{row.vendor}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.breach}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.records}</td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={4} className="text-center text-gray-400 py-8">No breaches found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 