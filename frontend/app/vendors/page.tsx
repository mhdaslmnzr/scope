'use client'

import { useState } from 'react'
import { Plus, X, Users, Shield } from 'lucide-react'

const vendors = [
  { name: 'Acme Corp', criticality: 'Critical', score: 45, sector: 'Finance', country: 'USA' },
  { name: 'CyberSafe', criticality: 'High', score: 68, sector: 'Healthcare', country: 'UK' },
  { name: 'D Pharma', criticality: 'Medium', score: 82, sector: 'Pharma', country: 'India' },
  { name: 'DataVault', criticality: 'Low', score: 91, sector: 'Cloud', country: 'Australia' },
]

const criticalityColors: Record<string, string> = {
  Critical: 'bg-red-100 text-red-700',
  High: 'bg-orange-100 text-orange-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-green-100 text-green-700',
}

const scoreColors = (score: number) => {
  if (score < 50) return 'bg-red-100 text-red-700';
  if (score < 70) return 'bg-orange-100 text-orange-700';
  if (score < 85) return 'bg-yellow-100 text-yellow-700';
  return 'bg-green-100 text-green-700';
}

export default function VendorsPage() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <Users className="w-6 h-6 text-blue-600" />
          <span>Vendors</span>
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vendor</span>
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vendor Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Criticality</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Risk Score</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sector</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Country</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {vendors.map((vendor, idx) => (
              <tr key={vendor.name} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{vendor.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${criticalityColors[vendor.criticality]}`}>{vendor.criticality}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${scoreColors(vendor.score)}`}>{vendor.score}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{vendor.sector}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{vendor.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Vendor Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowModal(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span>Add New Vendor</span>
            </h2>
            {/* Blank for now */}
          </div>
        </div>
      )}
    </div>
  )
} 