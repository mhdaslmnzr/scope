'use client';

import { useState, useEffect } from 'react';
import {
  Shield, FileText, Globe, AlertTriangle, ArrowLeft, RefreshCw, EditIcon, FileDown,
  Building, MapPin, Users as UsersIcon, Link as LinkIcon, BarChart3, Tag, Activity, FileUp
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { vendors, criticalityColors, scoreColors, riskColor } from '../mock-data';
import Skeleton from './ui/Skeleton';
import Card from './ui/Card';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function NewVendorDetails({ onBack, vendor }: { onBack: () => void; vendor?: any }) {
  // Use the passed vendor or fallback to first vendor for safety
  const vendorData = vendor || vendors[0];

  const timeline = [
    { date: vendorData.lastAssessment, label: 'Last Assessment', icon: <BarChart3 className="w-4 h-4 text-blue-600" /> },
    { date: vendorData.lastScan, label: 'Last Scan', icon: <Activity className="w-4 h-4 text-green-600" /> },
    { date: '2024-05-01', label: 'Breach Detected', icon: <AlertTriangle className="w-4 h-4 text-red-600" /> },
    { date: '2024-04-01', label: 'Onboarded', icon: <UsersIcon className="w-4 h-4 text-purple-600" /> },
  ];

  const statCards = [
    { label: 'Aggregate Score', value: vendorData.scores.aggregate, icon: <BarChart3 className="w-5 h-5 text-blue-600" /> },
    { label: 'Criticality', value: vendorData.criticality, icon: <AlertTriangle className="w-5 h-5 text-red-600" /> },
    { label: 'Sector', value: vendorData.sector, icon: <Building className="w-5 h-5 text-gray-600" /> },
    { label: 'Country', value: vendorData.country, icon: <MapPin className="w-5 h-5 text-green-600" /> },
    { label: 'Employees', value: vendorData.employeeCount, icon: <UsersIcon className="w-5 h-5 text-blue-600" /> },
    { label: 'Asset Importance', value: vendorData.assetImportance, icon: <BarChart3 className="w-5 h-5 text-yellow-600" /> },
  ];

  const pillarGroups = [
    { name: 'Cybersecurity', color: 'blue', icon: <Shield className="w-5 h-5 text-blue-600" />, score: vendorData.scores.cybersecurity, desc: 'External attack surface, controls...' },
    { name: 'Compliance', color: 'green', icon: <FileText className="w-5 h-5 text-green-600" />, score: vendorData.scores.compliance, desc: 'Standards adherence, regulations...' },
    { name: 'Geopolitical', color: 'purple', icon: <Globe className="w-5 h-5 text-purple-600" />, score: vendorData.scores.geopolitical, desc: 'Regional stability, industry risk...' },
    { name: 'Reputation', color: 'red', icon: <AlertTriangle className="w-5 h-5 text-red-600" />, score: vendorData.scores.reputation, desc: 'Breach history, data leaks...' },
  ];
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);
  const [notes, setNotes] = useState([
    { id: 1, text: 'Follow up on compliance docs before next assessment.', date: '2024-06-10' },
    { id: 2, text: 'Vendor flagged for high breach risk last quarter.', date: '2024-05-15' },
  ]);
  const [newNote, setNewNote] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(vendorData.tags || []);


  const handleAddNote = () => {
    if (newNote.trim()) {
      setNotes([{ id: Date.now(), text: newNote, date: new Date().toISOString().slice(0, 10) }, ...notes]);
      setNewNote('');
    }
  };
  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter(n => n.id !== id));
  };
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };


  // Risk Trend Data
  const trendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Aggregate Score',
        data: [60, 62, 65, 58, vendorData.scores?.aggregate || 70, vendorData.scores?.aggregate || 70],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.1)',
        tension: 0.4,
        pointRadius: 3,
      },
    ],
  };
  const trendOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { min: 0, max: 100, ticks: { stepSize: 20 } } },
  };

  return (
    <div className="bg-gray-50 min-h-full">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{vendorData.name}</h1>
                  <a href={vendorData.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                    <LinkIcon className="w-3 h-3" />
                    {vendorData.website}
                  </a>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {/* <span className={`px-4 py-2 rounded-full text-xl font-bold border-2 ${riskColor(vendorData.scores.aggregate)}`}>{vendorData.scores.aggregate}</span> */}
                {/* <span className={`px-3 py-1 rounded-full text-sm font-semibold ${criticalityColors[vendorData.criticality]}`}>{vendorData.criticality}</span> */}
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700">
                  <RefreshCw className="w-4 h-4" />
                  Reassess
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
                  <EditIcon className="w-4 h-4" />
                  Edit
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
                  <FileDown className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {statCards.map(card => (
              <div key={card.label} className="bg-white rounded-xl shadow-sm border flex flex-col items-center justify-center p-4 min-h-[80px] animate-slide-up">
                <div className="flex items-center gap-2 mb-1">{card.icon}<span className="font-semibold text-gray-700 text-xs">{card.label}</span></div>
                <div className="text-lg font-bold text-gray-900">{card.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Risk Analysis */}
          <div className="lg:col-span-8 space-y-6">
            {loading ? (
              <div className="space-y-6">
                <Skeleton className="h-40 rounded-xl" />
                <Skeleton className="h-80 rounded-xl" />
                <Skeleton className="h-56 rounded-xl" />
                <Skeleton className="h-64 rounded-xl" />
              </div>
            ) : null}
            {/* Risk Pillars Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Risk Pillars Overview</h2>
            {!loading && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pillarGroups.map((pillar) => (
                <Card key={pillar.name} className="flex flex-col justify-between transition-shadow hover:shadow-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">{pillar.icon}<span className={`font-semibold text-${pillar.color}-700`}>{pillar.name}</span></div>
                      <p className="text-xs text-gray-500 mt-1">{pillar.desc}</p>
                    </div>
                    <span className={`text-2xl font-bold text-${pillar.color}-600`}>{pillar.score}</span>
                  </div>
                  <div className="mt-4">
                    <div className="h-16 bg-gradient-to-r from-blue-50 to-blue-100 rounded flex items-center justify-center relative overflow-hidden">
                      <div className="flex items-end space-x-1 h-8">
                        {/* Generate trend based on pillar score */}
                        {Array.from({length: 12}, (_, i) => {
                          const baseScore = pillar.score;
                          const variation = (Math.sin(i * 0.5) * 10) + (Math.random() * 5 - 2.5);
                          const trendScore = Math.max(10, Math.min(100, baseScore + variation));
                          return trendScore;
                        }).map((height, index) => (
                          <div 
                            key={index} 
                            className={`w-1 rounded-t ${pillar.score > 70 ? 'bg-green-500' : pillar.score > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ height: `${(height / 100) * 32}px` }}
                          />
                        ))}
                  </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>)}
            </div>
            {/* Score Breakdown Table with Simulator */}
            {!loading && (<Card>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Risk Breakdown</h2>
              
              {/* Pillar-based categorization of all 25 risk categories */}
              <div className="space-y-6">
                {/* Cybersecurity Pillar */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-md font-semibold text-blue-700 mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Cybersecurity (9 categories)
                  </h3>
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-2 text-gray-600">Category</th>
                        <th className="text-left py-2 px-2 text-gray-600">Score</th>
                        {/* <th className="text-left py-2 px-2 text-gray-600">Weight</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {vendorData.scoreDetails.filter((item: any) => 
                        ['Vulnerability Management', 'Attack Surface', 'Web/App Security', 'Cloud & Infra', 'Email Security', 'Code Repo Exposure', 'Endpoint Hygiene', 'IOC & Infra Threat', 'Detection & Response'].includes(item.category)
                      ).map((item: any) => (
                        <tr key={item.category} className="border-b border-gray-100 last:border-b-0 hover:bg-blue-50">
                          <td className="py-2 px-2 font-medium text-gray-900" title={item.category}>{item.category}</td>
                          <td className="py-2 px-2">
                            <div className="flex items-center space-x-3">
                              <div className="w-full bg-gray-200 rounded-full h-4">
                                <div className={`h-4 rounded-full ${riskColor(item.score).split(' ')[0]}`} style={{ width: `${item.score}%` }}></div>
                              </div>
                              <span className="font-bold w-12 text-center">{item.score}</span>
                            </div>
                          </td>
                          {/* <td className="py-2 px-2">{item.weight}%</td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Compliance Pillar */}
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-md font-semibold text-green-700 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Compliance (5 categories)
                  </h3>
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-2 text-gray-600">Category</th>
                        <th className="text-left py-2 px-2 text-gray-600">Score</th>
                        <th className="text-left py-2 px-2 text-gray-600">Weight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendorData.scoreDetails.filter((item: any) => 
                        ['Certifications', 'Questionnaire Quality', 'Regulatory Violations', 'Privacy Compliance', 'Contractual Clauses'].includes(item.category)
                      ).map((item: any) => (
                        <tr key={item.category} className="border-b border-gray-100 last:border-b-0 hover:bg-green-50">
                          <td className="py-2 px-2 font-medium text-gray-900" title={item.category}>{item.category}</td>
                          <td className="py-2 px-2">
                            <div className="flex items-center space-x-3">
                              <div className="w-full bg-gray-200 rounded-full h-4">
                                <div className={`h-4 rounded-full ${riskColor(item.score).split(' ')[0]}`} style={{ width: `${item.score}%` }}></div>
                              </div>
                              <span className="font-bold w-12 text-center">{item.score}</span>
                            </div>
                          </td>
                          <td className="py-2 px-2">{item.weight}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Geopolitical Pillar */}
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="text-md font-semibold text-purple-700 mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Geopolitical (6 categories)
                  </h3>
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-2 text-gray-600">Category</th>
                        <th className="text-left py-2 px-2 text-gray-600">Score</th>
                        <th className="text-left py-2 px-2 text-gray-600">Weight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendorData.scoreDetails.filter((item: any) => 
                        ['Country Risk', 'Sector Risk', 'Company Size', 'Infra Jurisdiction', 'Concentration Risk', 'Environmental Exposure'].includes(item.category)
                      ).map((item: any) => (
                        <tr key={item.category} className="border-b border-gray-100 last:border-b-0 hover:bg-purple-50">
                          <td className="py-2 px-2 font-medium text-gray-900" title={item.category}>{item.category}</td>
                          <td className="py-2 px-2">
                            <div className="flex items-center space-x-3">
                              <div className="w-full bg-gray-200 rounded-full h-4">
                                <div className={`h-4 rounded-full ${riskColor(item.score).split(' ')[0]}`} style={{ width: `${item.score}%` }}></div>
                              </div>
                              <span className="font-bold w-12 text-center">{item.score}</span>
                            </div>
                          </td>
                          <td className="py-2 px-2">{item.weight}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Reputation Pillar */}
                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="text-md font-semibold text-red-700 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Reputation (5 categories)
                  </h3>
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-2 text-gray-600">Category</th>
                        <th className="text-left py-2 px-2 text-gray-600">Score</th>
                        <th className="text-left py-2 px-2 text-gray-600">Weight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendorData.scoreDetails.filter((item: any) => 
                        ['Data Breach History', 'Credential/Data Leaks', 'Brand Spoofing', 'Dark Web Presence', 'Social Sentiment'].includes(item.category)
                      ).map((item: any) => (
                        <tr key={item.category} className="border-b border-gray-100 last:border-b-0 hover:bg-red-50">
                          <td className="py-2 px-2 font-medium text-gray-900" title={item.category}>{item.category}</td>
                          <td className="py-2 px-2">
                            <div className="flex items-center space-x-3">
                              <div className="w-full bg-gray-200 rounded-full h-4">
                                <div className={`h-4 rounded-full ${riskColor(item.score).split(' ')[0]}`} style={{ width: `${item.score}%` }}></div>
                              </div>
                              <span className="font-bold w-12 text-center">{item.score}</span>
                            </div>
                          </td>
                          <td className="py-2 px-2">{item.weight}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>)}
 
            {!loading && (<Card>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Insights</h2>
              <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
                <li>{vendorData.scores.reputation < 50 ? 'Reputation is a top concern — recent breaches and leaks observed.' : 'Reputation risks are under control.'}</li>
                <li>{vendorData.scores.cybersecurity < 60 ? 'Improve patch cadence and external exposure hardening.' : 'Cybersecurity posture is trending stable.'}</li>
                <li>{vendorData.scores.compliance < 70 ? 'Review gaps in certifications and contractual clauses.' : 'Compliance posture is healthy.'}</li>
              </ul>
            </Card>)}
            {/* Chances of Breach */}
            {!loading && (<Card>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Chances of Breach</h2>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                                    <div className="bg-red-600 h-4 rounded-full transition-all duration-300" style={{ width: `${Math.round((vendorData.breachChance || 0) * 100)}%` }}></div>
                    </div>
                <span className="text-lg font-bold text-red-600">{Math.round((vendorData.breachChance || 0) * 100)}%</span>
                  </div>
            </Card>)}
            {/* Risk Trend */}
            {!loading && (<Card>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Risk Trend</h2>
              <div className="w-full h-40">
                <Line data={trendData} options={trendOptions} />
                  </div>
            </Card>)}
            {/* Timeline/History */}
            {!loading && (<Card>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Timeline & History</h2>
              <ol className="relative border-l-2 border-blue-200 ml-2">
                {timeline.map((event, idx) => (
                  <li key={idx} className="mb-6 ml-4">
                    <div className="absolute -left-5 flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full border-2 border-blue-300">{event.icon}</div>
                    <div className="pl-6">
                      <div className="text-xs text-gray-400">{event.date}</div>
                      <div className="font-medium text-gray-900">{event.label}</div>
                    </div>
                  </li>
                ))}
              </ol>
                </Card>)}
            {/* Notes Section */}
            {!loading && (<Card>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Notes</h2>
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Add a note..."
                />
                <button onClick={handleAddNote} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add</button>
                  </div>
              <ul className="space-y-2">
                {notes.map(note => (
                  <li key={note.id} className="flex items-center justify-between bg-gray-100 rounded-lg px-3 py-2">
                    <span>{note.text}</span>
                    <span className="text-xs text-gray-400 ml-4">{note.date}</span>
                    <button onClick={() => handleDeleteNote(note.id)} className="ml-2 text-red-400 hover:text-red-700 text-xs">Delete</button>
                  </li>
                ))}
              </ul>
            </Card>)}
          </div>
          {/* Right: Profile, Questionnaires, Tags */}
          <div className="lg:col-span-4 space-y-6">
            {loading ? (
              <Skeleton className="h-80 rounded-xl" />
            ) : (
            <Card>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">At-a-Glance</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 flex items-center gap-2"><Building className="w-4 h-4" /> Industry</span>
                  <span className="font-medium text-gray-800 text-right">{vendor.sector}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 flex items-center gap-2"><MapPin className="w-4 h-4" /> Location</span>
                  <span className="font-medium text-gray-800 text-right">{vendor.country}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 flex items-center gap-2"><UsersIcon className="w-4 h-4" /> Employees</span>
                  <span className="font-medium text-gray-800 text-right">{vendor.employeeCount}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Asset Criticality</span>
                  <span className="font-medium text-gray-800 text-right">{vendor.assetImportance}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 flex items-center gap-2"><FileText className="w-4 h-4" /> Certifications</span>
                  <span className="font-medium text-gray-800 text-right">{vendor.certifications}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 flex items-center gap-2"><FileText className="w-4 h-4" /> Frameworks</span>
                  <span className="font-medium text-gray-800 text-right">{vendor.frameworks}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 flex items-center gap-2"><FileText className="w-4 h-4" /> Products</span>
                  <span className="font-medium text-gray-800 text-right">{Array.isArray(vendor.products) ? vendor.products.join(', ') : vendor.products}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 flex items-center gap-2"><FileText className="w-4 h-4" /> Revenue</span>
                  <span className="font-medium text-gray-800 text-right">{vendor.revenue}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 flex items-center gap-2"><FileText className="w-4 h-4" /> Data Center Region</span>
                  <span className="font-medium text-gray-800 text-right">{vendor.dataCenterRegion}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 flex items-center gap-2"><Globe className="w-4 h-4" /> Global Footprint</span>
                  <span className="font-medium text-gray-800 text-right">{vendor.globalFootprint}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 flex items-center gap-2"><FileText className="w-4 h-4" /> Internal Dependencies</span>
                  <span className="font-medium text-gray-800 text-right">{vendor.internalDependencies}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 flex items-center gap-2"><FileText className="w-4 h-4" /> EDR/AV</span>
                  <span className="font-medium text-gray-800 text-right">{vendor.edrAv ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 flex items-center gap-2"><FileText className="w-4 h-4" /> MDM/BYOD</span>
                  <span className="font-medium text-gray-800 text-right">{vendor.mdmByod ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 flex items-center gap-2"><FileText className="w-4 h-4" /> Incident Response Plan</span>
                  <span className="font-medium text-gray-800 text-right">{vendor.incidentResponsePlan ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 flex items-center gap-2"><FileText className="w-4 h-4" /> Public IP</span>
                  <span className="font-medium text-gray-800 text-right">{vendor.publicIp}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 flex items-center gap-2"><FileText className="w-4 h-4" /> Known Subdomains</span>
                  <span className="font-medium text-gray-800 text-right text-xs">{vendor.subdomains}</span>
                </div>
                 <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 flex items-center gap-2"><FileText className="w-4 h-4" /> GitHub Org</span>
                  <span className="font-medium text-gray-800 text-right">{vendor.githubOrg}</span>
                </div>
                 <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500 flex items-center gap-2"><FileText className="w-4 h-4" /> Compliance Document</span>
                  <span className="font-medium text-gray-800 text-right">{vendor.complianceDoc ? 'Yes' : 'No'}</span>
                </div>
                 <div className="flex items-center justify-between py-2">
                  <span className="text-gray-500 flex items-center gap-2"><FileText className="w-4 h-4" /> Last Audit Date</span>
                  <span className="font-medium text-gray-800 text-right">{vendor.lastAuditDate}</span>
                </div>
              </div>
            </Card>)}
            {loading ? (
              <Skeleton className="h-40 rounded-xl" />
            ) : (
            <Card>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Questionnaires & Compliance Docs</h2>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <FileDown className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">NIST:</span>
                  <span className={vendor.questionnaires.nist ? 'text-green-600' : 'text-gray-400'}>{vendor.questionnaires.nist ? 'Available' : 'Not Provided'}</span>
                  {vendor.questionnaires.nist && <button className="ml-2 text-blue-600 hover:underline flex items-center gap-1"><FileDown className="w-4 h-4" />Download</button>}
                </div>
                <div className="flex items-center gap-2">
                  <FileDown className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">SIG:</span>
                  <span className={vendor.questionnaires.sig ? 'text-green-600' : 'text-gray-400'}>{vendor.questionnaires.sig ? 'Available' : 'Not Provided'}</span>
                  {vendor.questionnaires.sig && <button className="ml-2 text-blue-600 hover:underline flex items-center gap-1"><FileDown className="w-4 h-4" />Download</button>}
                </div>
                <div className="flex items-center gap-2">
                  <FileDown className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">OpenFAIR:</span>
                  <span className={vendor.questionnaires.openfair ? 'text-green-600' : 'text-gray-400'}>{vendor.questionnaires.openfair ? 'Available' : 'Not Provided'}</span>
                  {vendor.questionnaires.openfair && <button className="ml-2 text-blue-600 hover:underline flex items-center gap-1"><FileDown className="w-4 h-4" />Download</button>}
                </div>
              </div>
            </Card>)}
            {loading ? (
              <Skeleton className="h-32 rounded-xl" />
            ) : (
            <Card>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag: string) => (
                  <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {tag}
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && tagInput.trim()) { setTags([...tags, tagInput.trim()]); setTagInput(''); }}}
                  placeholder="Add tag"
                  className="w-20 px-2 py-1 border border-gray-300 rounded-full text-xs focus:ring-1 focus:ring-blue-500"
                />
                <button onClick={handleAddTag} className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs">Add</button>
                </div>
            </Card>)}
          </div>
        </div>
      </main>
    </div>
  );
}
