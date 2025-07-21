// frontend/components/VendorComparison.tsx
'use client';

import { ArrowLeft } from 'lucide-react';
import { vendors, criticalityColors, scoreColors } from '../mock-data';

interface VendorComparisonProps {
  selectedVendorIds: string[];
  onBack: () => void;
}

export default function VendorComparison({ selectedVendorIds, onBack }: VendorComparisonProps) {
  const selectedVendors = vendors.filter(v => selectedVendorIds.includes(v.name));

  const renderScore = (score: number) => (
    <div className="flex items-center space-x-2">
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div className={`h-4 rounded-full ${scoreColors(score).split(' ')[0]}`} style={{ width: `${score}%` }}></div>
      </div>
      <span className="font-bold w-12 text-center">{score}</span>
    </div>
  );

  const attributes = [
    { label: 'Criticality', key: 'criticality' },
    { label: 'Sector', key: 'sector' },
    { label: 'Country', key: 'country' },
    { label: 'Employee Count', key: 'employeeCount' },
    { label: 'Certifications', key: 'certifications' },
  ];

  const scoreCategories = [
    { label: 'Aggregate Score', key: 'score' },
    { label: 'Cybersecurity', key: 'cybersecurity', scoreKey: true },
    { label: 'Compliance', key: 'compliance', scoreKey: true },
    { label: 'Geopolitical', key: 'geopolitical', scoreKey: true },
    { label: 'Reputation', key: 'reputation', scoreKey: true },
  ];

  return (
    <div className="p-8">
      <button onClick={onBack} className="flex items-center text-blue-600 hover:underline mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Vendors
      </button>
      <h1 className="text-3xl font-bold mb-8">Vendor Comparison</h1>
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-lg font-semibold text-gray-700 w-1/4">Feature</th>
              {selectedVendors.map(vendor => (
                <th key={vendor.name} className="px-6 py-4 text-left text-lg font-semibold text-gray-900 w-1/4">{vendor.name}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {attributes.map(attr => (
              <tr key={attr.key}>
                <td className="px-6 py-4 font-semibold text-gray-600">{attr.label}</td>
                {selectedVendors.map(vendor => (
                  <td key={vendor.name} className="px-6 py-4 text-gray-800">
                     {attr.key === 'criticality' ? 
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${criticalityColors[vendor[attr.key]]}`}>{vendor[attr.key]}</span> : 
                      (vendor as any)[attr.key]
                    }
                  </td>
                ))}
              </tr>
            ))}
            {scoreCategories.map(cat => (
              <tr key={cat.key}>
                <td className="px-6 py-4 font-semibold text-gray-600">{cat.label}</td>
                {selectedVendors.map(vendor => (
                  <td key={vendor.name} className="px-6 py-4">
                    {renderScore(cat.scoreKey ? vendor.scores[cat.key] : vendor[cat.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
