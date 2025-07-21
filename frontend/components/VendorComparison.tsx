// frontend/components/VendorComparison.tsx
'use client';

import { ArrowLeft } from 'lucide-react';
import { vendors, criticalityColors, scoreColors } from '../mock-data';

interface VendorComparisonProps {
  selectedVendorIds: string[];
  onBack: () => void;
}

// Define a type for the score keys
type ScoreKey = keyof (typeof vendors[0]['scores']);

export default function VendorComparison({ selectedVendorIds, onBack }: VendorComparisonProps) {
  const selectedVendors = vendors.filter(v => selectedVendorIds.includes(v.name));

  const generalAttributes = [
    { label: 'Criticality', key: 'criticality' },
    { label: 'Sector', key: 'sector' },
    { label: 'Country', key: 'country' },
    { label: 'Employee Count', key: 'employeeCount' },
    { label: 'Certifications', key: 'certifications' },
  ];

  const scoreCategories: { label: string; key: ScoreKey; scoreKey: boolean }[] = [
    { label: 'Aggregate Score', key: 'aggregate', scoreKey: true },
    { label: 'Cybersecurity', key: 'cybersecurity', scoreKey: true },
    { label: 'Compliance', key: 'compliance', scoreKey: true },
    { label: 'Geopolitical', key: 'geopolitical', scoreKey: true },
    { label: 'Reputation', key: 'reputation', scoreKey: true },
  ];

  const renderScore = (score: number | string) => {
    if (typeof score === 'number') {
      return <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${scoreColors(score)}`}>{score}</span>;
    }
    return score;
  };

  return (
    <div className="p-0">
      <div className="flex items-center space-x-2 mb-6">
        <button onClick={onBack} className="flex items-center text-blue-600 hover:underline"><ArrowLeft className="w-4 h-4 mr-1" /> Back to Vendors</button>
        <h1 className="text-2xl font-bold text-gray-900">Vendor Comparison</h1>
      </div>
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Attribute</th>
              {selectedVendors.map(vendor => (
                <th key={vendor.name} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{vendor.name}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {generalAttributes.map(attr => (
              <tr key={attr.key}>
                <td className="px-6 py-4 font-medium text-gray-700">{attr.label}</td>
                {selectedVendors.map(vendor => (
                  <td key={vendor.name} className="px-6 py-4">
                    {attr.key === 'criticality' ? 
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${criticalityColors[(vendor as any)[attr.key]]}`}>{(vendor as any)[attr.key]}</span> :
                      (vendor as any)[attr.key]
                    }
                  </td>
                ))}
              </tr>
            ))}
            {scoreCategories.map(cat => (
              <tr key={cat.key}>
                <td className="px-6 py-4 font-medium text-gray-700">{cat.label}</td>
                {selectedVendors.map(vendor => (
                  <td key={vendor.name} className="px-6 py-4">
                    {renderScore(cat.scoreKey ? vendor.scores[cat.key] : (vendor as any)[cat.key])}
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
