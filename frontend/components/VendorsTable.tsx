'use client'

import { useState } from 'react'
import { Plus, X, ChevronLeft, ChevronRight, Upload, Building, MapPin, Users as UsersIcon, DollarSign, Server, Lock, Shield as ShieldIcon, Globe as GlobeIcon, FileText as FileTextIcon } from 'lucide-react'
import DataTable from './ui/DataTable'
import { ColumnDef } from '../types'
import { vendors, criticalityColors, scoreColors } from '../mock-data' // We will create this file next

export default function VendorsTable({ onSelect }: { onSelect: (vendor: any) => void }) {
  const [showModal, setShowModal] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    vendorName: '', country: '', industry: '', website: '',
    employeeCount: '', annualRevenue: '', globalFootprint: '', dataCenterRegion: '',
    assetImportance: '', vendorFunction: '', internalDependencies: '',
    certifications: '', frameworks: '', edrAv: false, mdmByod: false, incidentResponsePlan: false,
    publicIp: '', subdomains: '', githubOrg: '',
    complianceDoc: null, lastAuditDate: ''
  })
  const [search, setSearch] = useState('');
  const [criticalityFilter, setCriticalityFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [selectedVendors, setSelectedVendors] = useState<any[]>([]);

  const vendorsWithTags = vendors.map(v => ({
    ...v,
    tags: v.tags || (v.criticality === 'Critical' ? ['Critical', 'Watchlist'] : v.criticality === 'High' ? ['High'] : v.criticality === 'Medium' ? ['Medium'] : ['Low'])
  }));

  const filteredVendors = vendorsWithTags.filter(v =>
    (!search || v.name.toLowerCase().includes(search.toLowerCase())) &&
    (!criticalityFilter || v.criticality === criticalityFilter) &&
    (!sectorFilter || v.sector === sectorFilter) &&
    (!countryFilter || v.country === countryFilter)
  );

  const steps = [
    { title: 'Basic Information', icon: <Building className="w-5 h-5" /> },
    { title: 'Business Context', icon: <DollarSign className="w-5 h-5" /> },
    { title: 'Asset Criticality', icon: <Server className="w-5 h-5" /> },
    { title: 'Security Posture', icon: <ShieldIcon className="w-5 h-5" /> },
    { title: 'Infrastructure', icon: <GlobeIcon className="w-5 h-5" /> },
    { title: 'Compliance', icon: <FileTextIcon className="w-5 h-5" /> },
  ];

  const handleInputChange = (field: string, value: any) => { setFormData(prev => ({ ...prev, [field]: value })); };
  const nextStep = () => { if (currentStep < 6) setCurrentStep(currentStep + 1); };
  const prevStep = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };
  const handleSubmit = () => {
    setShowModal(false);
    setCurrentStep(1);
    setFormData({
      vendorName: '', country: '', industry: '', website: '',
      employeeCount: '', annualRevenue: '', globalFootprint: '', dataCenterRegion: '',
      assetImportance: '', vendorFunction: '', internalDependencies: '',
      certifications: '', frameworks: '', edrAv: false, mdmByod: false, incidentResponsePlan: false,
      publicIp: '', subdomains: '', githubOrg: '',
      complianceDoc: null, lastAuditDate: ''
    });
  };
  const handleSelectionChange = (selected: any[]) => { setSelectedVendors(selected); };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Vendor Name',
      cell: (row: any) => (
        <a onClick={(e) => { e.stopPropagation(); onSelect(row); }} className="hover:underline cursor-pointer font-medium text-gray-900">
          {row.name}
        </a>
      ),
    },
    {
      accessorKey: 'criticality',
      header: 'Criticality',
      cell: (row: any) => <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${criticalityColors[row.criticality]}`}>{row.criticality}</span>,
    },
    {
      accessorKey: 'score',
      header: 'Risk Score',
      cell: (row: any) => <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${scoreColors(row.score)}`}>{row.score}</span>,
    },
    { accessorKey: 'sector', header: 'Sector' },
    { accessorKey: 'country', header: 'Country' },
    {
      accessorKey: 'tags',
      header: 'Tags',
      cell: (row: any) => (
        <div className="flex flex-wrap gap-1">
          {row.tags.map((tag: string) => (
            <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">{tag}</span>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="p-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <UsersIcon className="w-6 h-6 text-blue-600" />
          <span>Vendors</span>
        </h1>
        <div className="flex flex-wrap gap-2 items-center">
          <input type="text" placeholder="Search vendors..." value={search} onChange={e => setSearch(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48" />
          <select value={criticalityFilter} onChange={e => setCriticalityFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">All Criticality</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select value={sectorFilter} onChange={e => setSectorFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">All Sectors</option>
            <option value="Finance">Finance</option>
            {/* ... other options */}
          </select>
          <button onClick={() => console.log('Comparing vendors:', selectedVendors)} disabled={selectedVendors.length < 2} className="flex items-center space-x-2 bg-info text-info-foreground px-4 py-2 rounded-lg shadow hover:bg-info/90 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
            <span>Compare ({selectedVendors.length})</span>
          </button>
          <button onClick={() => setShowModal(true)} className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow hover:bg-primary/90 transition">
            <Plus className="w-4 h-4" />
            <span>Add New Vendor</span>
          </button>
        </div>
      </div>
      <DataTable data={filteredVendors} columns={columns} filterKeys={['name', 'sector', 'country']} onSelectionChange={handleSelectionChange} />
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <ShieldIcon className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Add New Vendor</h2>
              </div>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowModal(false)}><X className="w-6 h-6" /></button>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className={`flex items-center space-x-2 ${idx + 1 <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${idx + 1 < currentStep ? 'bg-blue-600 text-white' : idx + 1 === currentStep ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-400'}`}>
                        {idx + 1 < currentStep ? '✓' : idx + 1}
                      </div>
                      <span className="hidden sm:block text-sm font-medium">{step.title}</span>
                    </div>
                    {idx < steps.length - 1 && (<div className={`w-8 h-1 mx-2 ${idx + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`}></div>)}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Vendor Name</label>
                    <input
                      type="text"
                      value={formData.vendorName}
                      onChange={e => handleInputChange('vendorName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={e => handleInputChange('country', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Industry</label>
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={e => handleInputChange('industry', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Website</label>
                    <input
                      type="text"
                      value={formData.website}
                      onChange={e => handleInputChange('website', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              )}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Employee Count</label>
                    <input
                      type="text"
                      value={formData.employeeCount}
                      onChange={e => handleInputChange('employeeCount', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Annual Revenue</label>
                    <input
                      type="text"
                      value={formData.annualRevenue}
                      onChange={e => handleInputChange('annualRevenue', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Global Footprint</label>
                    <input
                      type="text"
                      value={formData.globalFootprint}
                      onChange={e => handleInputChange('globalFootprint', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Data Center Region</label>
                    <input
                      type="text"
                      value={formData.dataCenterRegion}
                      onChange={e => handleInputChange('dataCenterRegion', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              )}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Asset Importance</label>
                    <input
                      type="text"
                      value={formData.assetImportance}
                      onChange={e => handleInputChange('assetImportance', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Vendor Function</label>
                    <input
                      type="text"
                      value={formData.vendorFunction}
                      onChange={e => handleInputChange('vendorFunction', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Internal Dependencies</label>
                    <input
                      type="text"
                      value={formData.internalDependencies}
                      onChange={e => handleInputChange('internalDependencies', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              )}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Certifications</label>
                    <input
                      type="text"
                      value={formData.certifications}
                      onChange={e => handleInputChange('certifications', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Frameworks</label>
                    <input
                      type="text"
                      value={formData.frameworks}
                      onChange={e => handleInputChange('frameworks', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input type="checkbox" checked={formData.edrAv} onChange={e => handleInputChange('edrAv', e.target.checked)} className="mr-2" /> EDR/AV
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" checked={formData.mdmByod} onChange={e => handleInputChange('mdmByod', e.target.checked)} className="mr-2" /> MDM/BYOD
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" checked={formData.incidentResponsePlan} onChange={e => handleInputChange('incidentResponsePlan', e.target.checked)} className="mr-2" /> Incident Response Plan
                    </label>
                  </div>
                </div>
              )}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Public IP</label>
                    <input
                      type="text"
                      value={formData.publicIp}
                      onChange={e => handleInputChange('publicIp', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subdomains</label>
                    <input
                      type="text"
                      value={formData.subdomains}
                      onChange={e => handleInputChange('subdomains', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">GitHub Org</label>
                    <input
                      type="text"
                      value={formData.githubOrg}
                      onChange={e => handleInputChange('githubOrg', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              )}
              {currentStep === 6 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Compliance Doc</label>
                    <input
                      type="file"
                      onChange={e => handleInputChange('complianceDoc', e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Audit Date</label>
                    <input
                      type="date"
                      value={formData.lastAuditDate}
                      onChange={e => handleInputChange('lastAuditDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <button onClick={prevStep} disabled={currentStep === 1} className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${currentStep === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'}`}><ChevronLeft className="w-4 h-4" /><span>Previous</span></button>
              <div className="flex space-x-3">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition">Cancel</button>
                {currentStep === 6 ? (<button onClick={handleSubmit} className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"><span>Add Vendor</span></button>) : (<button onClick={nextStep} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"><span>Next</span><ChevronRight className="w-4 h-4" /></button>)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}