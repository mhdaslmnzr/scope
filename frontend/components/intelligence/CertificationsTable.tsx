import React, { useState } from 'react';

const mockData = [
  { id: 1, certification: 'ISO 27001', vendor: 'Acme Corp', status: 'Valid', expiry: '2025-01-01' },
  { id: 2, certification: 'SOC 2', vendor: 'CyberSafe', status: 'Expired', expiry: '2023-12-31' },
  { id: 3, certification: 'HIPAA', vendor: 'D Pharma', status: 'Valid', expiry: '2026-06-30' },
];

export default function CertificationsTable() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = mockData.filter(row =>
    (!search || row.certification.toLowerCase().includes(search.toLowerCase())) &&
    (!statusFilter || row.status === statusFilter)
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Certifications</h1>
      </div>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search certifications..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg w-48"
        />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
          <option value="">All Statuses</option>
          <option value="Valid">Valid</option>
          <option value="Expired">Expired</option>
        </select>
      </div>
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Certification</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vendor</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Expiry</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {filtered.map(row => (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{row.certification}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.vendor}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.status}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.expiry}</td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={4} className="text-center text-gray-400 py-8">No certifications found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 