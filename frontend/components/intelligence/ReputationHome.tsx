import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ReputationHome() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-32">
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className="w-8 h-8 text-red-600" />
        <span className="text-3xl font-bold text-gray-900">Reputation Intelligence</span>
      </div>
      <div className="bg-red-50 text-red-700 px-6 py-4 rounded-xl shadow text-lg font-semibold">Pillar Overview Coming Soon</div>
      <div className="mt-4 text-gray-500">This page will show an overview and analytics for <span className="font-bold">Reputation</span> intelligence.</div>
    </div>
  );
} 