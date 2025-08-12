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
  setUseNewDetailsView,
}: {
  view: string;
  setView: (v: 'dashboard' | 'vendors' | 'intelligence' | 'reports' | 'cortex' | 'add-vendor') => void;
  selectedPillar: string | null;
  setSelectedPillar: (p: string | null) => void;
  selectedSubItem: string | null;
  setSelectedSubItem: (s: string | null) => void;
  setSelectedVendor: (v: any) => void;
  setUseNewDetailsView: (v: boolean) => void;
}) {
  const [intelligenceExpanded, setIntelligenceExpanded] = useState(false);
  return (
    <div className="w-full h-full flex flex-col">
      {/* Navigation Items - No Icons, Clean Text - More Compact */}
      <div className="px-4 py-6 flex-1 space-y-2">
        <button
          className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 font-medium ${view === 'dashboard' ? 'text-blue-600 bg-blue-50 border-l-3 border-blue-500' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:border-l-3 hover:border-blue-200'}`}
          onClick={() => { setView('dashboard'); setSelectedVendor(null); setSelectedPillar(null); setSelectedSubItem(null); setUseNewDetailsView(false); }}
        >
          <span className="text-sm">Dashboard</span>
        </button>
        <button
          className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 font-medium ${view === 'vendors' ? 'text-blue-600 bg-blue-50 border-l-3 border-blue-500' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:border-l-3 hover:border-blue-200'}`}
          onClick={() => { setView('vendors'); setSelectedVendor(null); setSelectedPillar(null); setSelectedSubItem(null); setUseNewDetailsView(false); }}
        >
          <span className="text-sm">Vendors</span>
        </button>
        <button
          className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 font-medium ${view === 'add-vendor' ? 'text-blue-600 bg-blue-50 border-l-3 border-blue-500' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:border-l-3 hover:border-blue-200'}`}
          onClick={() => { setView('add-vendor'); setSelectedVendor(null); setSelectedPillar(null); setSelectedSubItem(null); setUseNewDetailsView(false); }}
        >
          <span className="text-sm">Add Vendor</span>
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
          className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 font-medium ${view === 'reports' ? 'text-blue-600 bg-blue-50 border-l-3 border-blue-500' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:border-l-3 hover:border-blue-200'}`}
          onClick={() => { setView('reports'); setSelectedVendor(null); setSelectedPillar(null); setSelectedSubItem(null); setUseNewDetailsView(false); }}
        >
          <span className="text-sm">Reports</span>
        </button>
        <button
          className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 font-medium ${view === 'cortex' ? 'text-blue-600 bg-blue-50 border-l-3 border-blue-500' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:border-l-3 hover:border-blue-200'}`}
          onClick={() => { setView('cortex'); setSelectedVendor(null); setSelectedPillar(null); setSelectedSubItem(null); setUseNewDetailsView(false); }}
        >
          <span className="text-sm">Cortex</span>
        </button>
      </div>
    </div>
  );
} 