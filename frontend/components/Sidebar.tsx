import IntelligenceSidebar from './IntelligenceSidebar';
import { BarChart3, Users, FileText } from 'lucide-react';
import { useState } from 'react';

export default function Sidebar({
  view,
  setView,
  selectedPillar,
  setSelectedPillar,
  selectedSubItem,
  setSelectedSubItem,
  setSelectedVendor,
}: {
  view: string;
  setView: (v: 'dashboard' | 'vendors' | 'intelligence' | 'reports') => void;
  selectedPillar: string | null;
  setSelectedPillar: (p: string | null) => void;
  selectedSubItem: string | null;
  setSelectedSubItem: (s: string | null) => void;
  setSelectedVendor: (v: any) => void;
}) {
  const [intelligenceExpanded, setIntelligenceExpanded] = useState(false);
  return (
    <div className="w-64 bg-white shadow-lg sticky top-0 h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">SCOPE</span>
        </div>
      </div>
      {/* Navigation Items */}
      <div className="px-4 py-6 flex-1 space-y-2">
        <button
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition text-left font-medium ${view === 'dashboard' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
          onClick={() => { setView('dashboard'); setSelectedVendor(null); setSelectedPillar(null); setSelectedSubItem(null); }}
        >
          <BarChart3 className="w-5 h-5" />
          <span>Dashboard</span>
        </button>
        <button
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition text-left font-medium ${view === 'vendors' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
          onClick={() => { setView('vendors'); setSelectedVendor(null); setSelectedPillar(null); setSelectedSubItem(null); }}
        >
          <Users className="w-5 h-5" />
          <span>Vendors</span>
        </button>
        <IntelligenceSidebar
          expanded={intelligenceExpanded}
          onExpand={() => setIntelligenceExpanded(e => !e)}
          selectedPillar={selectedPillar}
          selectedSubItem={selectedSubItem}
          onSelectPillar={pillar => { setSelectedPillar(pillar); setSelectedSubItem(null); setView('intelligence'); }}
          onSelectSubItem={(pillar, item) => { setSelectedPillar(pillar); setSelectedSubItem(item); setView('intelligence'); }}
        />
        <button
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition text-left font-medium ${view === 'reports' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
          onClick={() => { setView('reports'); setSelectedVendor(null); setSelectedPillar(null); setSelectedSubItem(null); }}
        >
          <FileText className="w-5 h-5" />
          <span>Reports</span>
        </button>
      </div>
    </div>
  );
} 