import { useState } from 'react';
import { BarChart2, Shield, FileText, Globe, AlertTriangle, ChevronRight, ChevronDown } from 'lucide-react';

const PILLARS = [
  {
    name: 'Cybersecurity',
    color: 'blue',
    icon: <Shield className="w-5 h-5 text-blue-600" />,
    items: [
      'Vulnerabilities', 'Attack Surface', 'Web/App Security', 'Cloud & Infra', 'Email Security', 'Code Repo Exposure', 'Endpoint Hygiene', 'IOC & Infra Threat', 'Detection & Response',
    ],
  },
  {
    name: 'Compliance',
    color: 'green',
    icon: <FileText className="w-5 h-5 text-green-600" />,
    items: [
      'Certifications', 'Questionnaire Results', 'Regulatory Violations', 'Privacy Compliance', 'Contractual Clauses',
    ],
  },
  {
    name: 'Geopolitical',
    color: 'purple',
    icon: <Globe className="w-5 h-5 text-purple-600" />,
    items: [
      'Country Risk', 'Sector Risk', 'Company Size', 'Infra Jurisdiction', 'Concentration Risk', 'Environmental Exposure',
    ],
  },
  {
    name: 'Reputation',
    color: 'red',
    icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
    items: [
      'Data Breach History', 'Credential/Data Leaks', 'Brand Spoofing', 'Dark Web Presence', 'Social Sentiment',
    ],
  },
];

export default function IntelligenceSidebar({
  expanded,
  onExpand,
  selectedPillar,
  selectedSubItem,
  onSelectPillar,
  onSelectSubItem,
}: {
  expanded: boolean;
  onExpand: () => void;
  selectedPillar: string | null;
  selectedSubItem: string | null;
  onSelectPillar: (pillar: string) => void;
  onSelectSubItem: (pillar: string, item: string) => void;
}) {
  return (
    <div className="mt-2">
      <button
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition text-left font-semibold text-gray-700 hover:bg-blue-50 ${expanded ? 'bg-blue-50 text-blue-700' : ''}`}
        onClick={onExpand}
      >
        <BarChart2 className="w-5 h-5 text-blue-600" />
        <span className="text-base">Intelligence</span>
        {expanded ? <ChevronDown className="w-4 h-4 ml-auto" /> : <ChevronRight className="w-4 h-4 ml-auto" />}
      </button>
      {expanded && (
        <div className="mt-2 space-y-2">
          {PILLARS.map(pillar => (
            <div key={pillar.name}>
              <button
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition text-left font-medium text-${pillar.color}-700 hover:bg-${pillar.color}-50 ${selectedPillar === pillar.name && !selectedSubItem ? 'bg-' + pillar.color + '-100 font-bold' : ''}`}
                onClick={() => onSelectPillar(pillar.name)}
              >
                {pillar.icon}
                <span>{pillar.name}</span>
                {selectedPillar === pillar.name ? <ChevronDown className="w-4 h-4 ml-auto" /> : <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
              {selectedPillar === pillar.name && (
                <div className="ml-6 mt-1 space-y-1">
                  {pillar.items.map(item => (
                    <button
                      key={item}
                      className={`w-full text-left px-3 py-1 rounded text-sm transition ${selectedSubItem === item ? 'bg-' + pillar.color + '-100 text-' + pillar.color + '-900 font-bold' : 'text-gray-700 hover:bg-' + pillar.color + '-50'}`}
                      onClick={() => onSelectSubItem(pillar.name, item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 