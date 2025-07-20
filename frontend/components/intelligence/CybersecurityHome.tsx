import { Shield, BarChart2 } from 'lucide-react';

export default function CybersecurityHome({
  avgScore,
  vendorCount,
  highRiskCount,
  patchCompliance,
  subcategoryScores,
}: {
  avgScore: number;
  vendorCount: number;
  highRiskCount: number;
  patchCompliance: number;
  subcategoryScores: { name: string; avg: number }[];
}) {
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Cybersecurity Intelligence</h1>
      </div>
      <p className="text-gray-600 mb-8 max-w-2xl">
        Overview of your vendor ecosystem's cybersecurity posture, including vulnerabilities, attack surface, endpoint hygiene, and more. Drill down into each area for detailed findings and trends.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 flex flex-col items-center">
          <div className="text-2xl font-bold text-blue-700 mb-1">{vendorCount}</div>
          <div className="text-sm text-gray-500">Vendors Monitored</div>
        </div>
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 flex flex-col items-center">
          <div className="text-2xl font-bold text-red-600 mb-1">{highRiskCount}</div>
          <div className="text-sm text-gray-500">High Risk Vendors</div>
        </div>
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 flex flex-col items-center">
          <div className="text-2xl font-bold text-green-700 mb-1">{patchCompliance}%</div>
          <div className="text-sm text-gray-500">Patch Compliance</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-900">Cybersecurity Subcategory Averages</span>
          </div>
          <ul className="pl-2 space-y-2 text-gray-700">
            {subcategoryScores.map(sub => (
              <li key={sub.name} className="flex justify-between">
                <span>{sub.name}</span>
                <span className="font-mono font-bold text-blue-700">{sub.avg}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 flex flex-col items-center justify-center min-h-[220px]">
          <div className="text-gray-400 mb-2">[Risk Trend Chart Placeholder]</div>
          <div className="w-full h-32 bg-blue-50 rounded-lg flex items-center justify-center text-blue-300">Chart Coming Soon</div>
        </div>
      </div>
    </div>
  );
} 