import React, { useState } from 'react';

const mockData = [
  { id: 1, vendor: 'Acme Corp', sentiment: 'Positive', mentions: 120, lastChecked: '2024-06-10' },
  { id: 2, vendor: 'CyberSafe', sentiment: 'Negative', mentions: 45, lastChecked: '2024-06-09' },
  { id: 3, vendor: 'D Pharma', sentiment: 'Neutral', mentions: 60, lastChecked: '2024-06-08' },
];

export default function SocialSentimentTable() {
  const [search, setSearch] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('');

  const filtered = mockData.filter(row =>
    (!search || row.vendor.toLowerCase().includes(search.toLowerCase())) &&
    (!sentimentFilter || row.sentiment === sentimentFilter)
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Social Sentiment</h1>
      </div>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search vendors..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg w-48"
        />
        <select value={sentimentFilter} onChange={e => setSentimentFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
          <option value="">All Sentiments</option>
          <option value="Positive">Positive</option>
          <option value="Negative">Negative</option>
          <option value="Neutral">Neutral</option>
        </select>
      </div>
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vendor</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sentiment</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mentions</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Checked</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {filtered.map(row => (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{row.vendor}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.sentiment}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.mentions}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.lastChecked}</td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={4} className="text-center text-gray-400 py-8">No sentiment found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 