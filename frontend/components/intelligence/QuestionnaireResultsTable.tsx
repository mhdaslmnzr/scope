import React, { useState } from 'react';

const mockData = [
  { id: 1, questionnaire: 'NIST SP', vendor: 'Acme Corp', score: 92, date: '2024-06-10' },
  { id: 2, questionnaire: 'SIG', vendor: 'CyberSafe', score: 85, date: '2024-06-09' },
  { id: 3, questionnaire: 'OpenFAIR', vendor: 'D Pharma', score: 78, date: '2024-06-08' },
];

export default function QuestionnaireResultsTable() {
  const [search, setSearch] = useState('');
  const [questionnaireFilter, setQuestionnaireFilter] = useState('');

  const filtered = mockData.filter(row =>
    (!search || row.vendor.toLowerCase().includes(search.toLowerCase())) &&
    (!questionnaireFilter || row.questionnaire === questionnaireFilter)
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Questionnaire Results</h1>
      </div>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search vendors..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg w-48"
        />
        <select value={questionnaireFilter} onChange={e => setQuestionnaireFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
          <option value="">All Questionnaires</option>
          <option value="NIST SP">NIST SP</option>
          <option value="SIG">SIG</option>
          <option value="OpenFAIR">OpenFAIR</option>
        </select>
      </div>
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Questionnaire</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vendor</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {filtered.map(row => (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{row.questionnaire}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.vendor}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.score}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{row.date}</td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={4} className="text-center text-gray-400 py-8">No results found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 