'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Save, Upload, CheckCircle, Plus, Building, MapPin, Users, Globe, Shield, FileText, Info } from 'lucide-react';
import Card from './ui/Card';
import { vendors } from '../mock-data';

interface FormData {
  // Basic Information
  vendorName: string;
  website: string;
  industry: string;
  country: string;
  
  // Business Details
  employeeCount: string;
  annualRevenue: string;
  globalFootprint: string;
  dataCenterRegion: string;
  
  // Risk Assessment
  assetImportance: string;
  vendorFunction: string;
  internalDependencies: string;
  
  // Security Information
  certifications: string;
  frameworks: string;
  edrAv: boolean;
  mdmByod: boolean;
  incidentResponsePlan: boolean;
  
  // Technical Details
  publicIp: string;
  subdomains: string;
  githubOrg: string;
}

// Get vendor 10 data for prepopulation
const vendor10Data = vendors[9]; // 10th vendor (index 9)

const initialFormData: FormData = {
  vendorName: 'FintechCorp Solutions',
  website: 'https://fintechcorp-solutions.com',
  industry: 'Finance',
  country: 'Singapore',
  employeeCount: '201-1000',
  annualRevenue: '10M-100M',
  globalFootprint: 'Asia Pacific, Europe',
  dataCenterRegion: 'AP Southeast, EU West',
  assetImportance: 'High',
  vendorFunction: 'Digital Banking & Payment Processing',
  internalDependencies: '8',
  certifications: 'PCI DSS, SOC2 Type II, ISO 27001',
  frameworks: 'NIST CSF, COBIT, ISO 31000',
  edrAv: true,
  mdmByod: true,
  incidentResponsePlan: true,
  publicIp: '203.0.113.0/24, 198.51.100.0/24',
  subdomains: 'api.fintechcorp.com, admin.fintechcorp.com, portal.fintechcorp.com',
  githubOrg: 'fintechcorp-org',
};

const steps = [
  { id: 1, title: 'Basic Information', icon: <Building className="w-5 h-5" /> },
  { id: 2, title: 'Business Details', icon: <Users className="w-5 h-5" /> },
  { id: 3, title: 'Risk Assessment', icon: <Shield className="w-5 h-5" /> },
  { id: 4, title: 'Security Information', icon: <FileText className="w-5 h-5" /> },
  { id: 5, title: 'Technical Details', icon: <Globe className="w-5 h-5" /> },
  { id: 6, title: 'Review & Submit', icon: <CheckCircle className="w-5 h-5" /> },
];

export default function AddVendor({ onBack, onVendorAdded }: { onBack: () => void; onVendorAdded: (vendor: any) => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newVendorData, setNewVendorData] = useState<any>(null);

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate processing steps
    await new Promise(resolve => setTimeout(resolve, 800)); // Data validation
    await new Promise(resolve => setTimeout(resolve, 600)); // Risk assessment
    await new Promise(resolve => setTimeout(resolve, 400)); // Final processing
    
    // Create a unique fintech vendor using vendor 10's intelligence data as base
    const newVendor = {
      ...vendor10Data, // Use ALL existing intelligence data (vulnerabilities, compliance, etc.)
      
      // Override with form data
      name: formData.vendorName,
      website: formData.website,
      industry: formData.industry,
      country: formData.country,
      criticality: formData.assetImportance,
      sector: 'Finance',
      tags: ['Fintech', 'Digital Banking', 'Payment Processing', 'APAC'],
      
      // Modify intelligence data to make it unique
      vulnerabilities: vendor10Data.vulnerabilities?.map(v => ({
        ...v,
        count: Math.floor(v.count * (0.8 + Math.random() * 0.4)), // ±20% variation
        lastScan: new Date().toISOString()
      })) || [],
      
      complianceViolations: vendor10Data.complianceViolations?.map(v => ({
        ...v,
        date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString() // Random date within last 90 days
      })) || [],
      
      // Adjust scores based on form input for realism
      scores: {
        cybersecurity: Math.max(0, Math.min(100, 
          (vendor10Data.scores?.cybersecurity || 75) + 
          (formData.assetImportance === 'Critical' ? -8 : 0) + // Critical assets get lower scores
          (formData.edrAv ? 3 : -2) + // EDR/AV improves score
          (formData.incidentResponsePlan ? 2 : -1) // IR plan helps
        )),
        
        compliance: Math.max(0, Math.min(100, 
          (vendor10Data.scores?.compliance || 80) + 
          (formData.certifications.includes('PCI DSS') ? 5 : 0) + // PCI DSS is important for fintech
          (formData.certifications.includes('SOC2') ? 3 : 0) + // SOC2 helps
          (formData.frameworks.includes('NIST') ? 2 : 0) // NIST framework bonus
        )),
        
        geopolitical: Math.max(0, Math.min(100, 
          (vendor10Data.scores?.geopolitical || 70) + 
          (formData.country === 'Singapore' ? 5 : 0) + // Singapore is low-risk
          (formData.country === 'USA' ? 2 : 0) + // USA is moderate-risk
          (formData.employeeCount === '201-1000' ? 1 : 0) // Mid-size companies are stable
        )),
        
        reputation: Math.max(0, Math.min(100, 
          (vendor10Data.scores?.reputation || 85) + 
          (formData.industry === 'Finance' ? 3 : 0) + // Finance has good reputation
          (formData.incidentResponsePlan ? 2 : 0) // IR plan shows preparedness
        )),
        
        aggregate: 0 // Will be calculated below
      },
      
      // Add form-specific data
      employeeCount: formData.employeeCount,
      annualRevenue: formData.annualRevenue,
      globalFootprint: formData.globalFootprint,
      dataCenterRegion: formData.dataCenterRegion,
      vendorFunction: formData.vendorFunction,
      internalDependencies: parseInt(formData.internalDependencies),
      certifications: formData.certifications,
      frameworks: formData.frameworks,
      edrAv: formData.edrAv,
      mdmByod: formData.mdmByod,
      incidentResponsePlan: formData.incidentResponsePlan,
      publicIp: formData.publicIp,
      subdomains: formData.subdomains,
      githubOrg: formData.githubOrg,
      
      // Update timestamps
      lastScan: new Date().toISOString(),
      lastAssessment: new Date().toISOString(),
      nextReview: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    };
    
    // Calculate final aggregate score based on adjusted pillar scores
    const pillarScores = [
      { score: newVendor.scores.cybersecurity, weight: 0.35 },
      { score: newVendor.scores.compliance, weight: 0.25 },
      { score: newVendor.scores.geopolitical, weight: 0.20 },
      { score: newVendor.scores.reputation, weight: 0.20 }
    ];
    
    const baseScore = pillarScores.reduce((sum, pillar) => sum + (pillar.score * pillar.weight), 0);
    const criticalityMultiplier = formData.assetImportance === 'Critical' ? 0.9 : 
                                 formData.assetImportance === 'High' ? 0.95 : 1.0;
    
    newVendor.scores.aggregate = Math.round(baseScore * criticalityMultiplier);
    
    // Calculate breach probability based on final score
    const baseRisk = (100 - newVendor.scores.aggregate) / 100;
    const criticalityFactor = formData.assetImportance === 'Critical' ? 1.5 : 
                             formData.assetImportance === 'High' ? 1.2 : 1.0;
    
    newVendor.breachChance = Math.min(baseRisk * criticalityFactor, 0.95);
    
    // Show success message with score info
    setNewVendorData(newVendor);
    setShowSuccessModal(true);
    
    setIsSubmitting(false);
    // Don't call onVendorAdded yet - wait for user to close modal
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Demo Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="font-medium text-blue-900">Demo Mode - Real Intelligence Data</h4>
                  <p className="text-sm text-blue-700">
                    This form creates a unique fintech vendor using real intelligence data (vulnerabilities, compliance, dark web presence) as a base. Your form choices will realistically affect the final risk scores.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Name *</label>
                <input
                  type="text"
                  value={formData.vendorName}
                  onChange={(e) => updateFormData('vendorName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter vendor name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => updateFormData('website', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://vendor.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
                <select
                  value={formData.industry}
                  onChange={(e) => updateFormData('industry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select industry</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Technology">Technology</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail</option>
                  <option value="Education">Education</option>
                  <option value="Government">Government</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                <select
                  value={formData.country}
                  onChange={(e) => updateFormData('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select country</option>
                  <option value="USA">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Netherlands">Netherlands</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Australia">Australia</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employee Count</label>
                <select
                  value={formData.employeeCount}
                  onChange={(e) => updateFormData('employeeCount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select size</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-1000">201-1000</option>
                  <option value="1001-5000">1001-5000</option>
                  <option value="5000+">5000+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Revenue</label>
                <select
                  value={formData.annualRevenue}
                  onChange={(e) => updateFormData('annualRevenue', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select revenue</option>
                  <option value="<1M">Less than $1M</option>
                  <option value="1M-10M">$1M - $10M</option>
                  <option value="10M-100M">$10M - $100M</option>
                  <option value="100M-1B">$100M - $1B</option>
                  <option value="1B+">$1B+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Global Footprint</label>
                <input
                  type="text"
                  value={formData.globalFootprint}
                  onChange={(e) => updateFormData('globalFootprint', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., North America, Europe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data Center Region</label>
                <input
                  type="text"
                  value={formData.dataCenterRegion}
                  onChange={(e) => updateFormData('dataCenterRegion', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., US East, EU Central"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Asset Importance *</label>
                <select
                  value={formData.assetImportance}
                  onChange={(e) => updateFormData('assetImportance', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select importance</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Function</label>
                <input
                  type="text"
                  value={formData.vendorFunction}
                  onChange={(e) => updateFormData('vendorFunction', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Payment Processing, Data Analytics"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Internal Dependencies</label>
                <input
                  type="number"
                  value={formData.internalDependencies}
                  onChange={(e) => updateFormData('internalDependencies', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Number of internal systems dependent on this vendor"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
                <input
                  type="text"
                  value={formData.certifications}
                  onChange={(e) => updateFormData('certifications', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., ISO 27001, SOC2, PCI DSS"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Security Frameworks</label>
                <input
                  type="text"
                  value={formData.frameworks}
                  onChange={(e) => updateFormData('frameworks', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., NIST, CIS Controls, COBIT"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Security Controls</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.edrAv}
                    onChange={(e) => updateFormData('edrAv', e.target.checked)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">EDR/AV Solution</span>
                </label>
                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.mdmByod}
                    onChange={(e) => updateFormData('mdmByod', e.target.checked)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">MDM/BYOD Policy</span>
                </label>
                <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.incidentResponsePlan}
                    onChange={(e) => updateFormData('incidentResponsePlan', e.target.checked)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Incident Response Plan</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Public IP Range</label>
                <input
                  type="text"
                  value={formData.publicIp}
                  onChange={(e) => updateFormData('publicIp', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 192.168.1.0/24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Organization</label>
                <input
                  type="text"
                  value={formData.githubOrg}
                  onChange={(e) => updateFormData('githubOrg', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., vendor-org/repo"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Known Subdomains</label>
                <textarea
                  value={formData.subdomains}
                  onChange={(e) => updateFormData('subdomains', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., api.vendor.com, admin.vendor.com"
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            {/* Demo Notice for Review */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">Demo Mode - Intelligence-Driven Scoring</h4>
                  <p className="text-sm text-green-700 mt-1">
                    This form will create a new fintech vendor with real intelligence data (vulnerabilities, compliance violations, dark web presence). Your form choices will realistically adjust the risk scores based on actual security controls and business factors.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Review Your Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Vendor Name:</strong> {formData.vendorName}</div>
                <div><strong>Industry:</strong> {formData.industry}</div>
                <div><strong>Country:</strong> {formData.country}</div>
                <div><strong>Website:</strong> {formData.website}</div>
                <div><strong>Employee Count:</strong> {formData.employeeCount}</div>
                <div><strong>Asset Importance:</strong> {formData.assetImportance}</div>
                <div><strong>Vendor Function:</strong> {formData.vendorFunction}</div>
                <div><strong>Global Footprint:</strong> {formData.globalFootprint}</div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">How Your Choices Affect Risk Scores</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    <strong>Asset Importance:</strong> Critical assets get 8% score reduction<br/>
                    <strong>Security Controls:</strong> EDR/AV (+3), IR Plan (+2), MDM (+1)<br/>
                    <strong>Certifications:</strong> PCI DSS (+5), SOC2 (+3), NIST (+2)<br/>
                    <strong>Location:</strong> Singapore (+5), USA (+2), Mid-size company (+1)
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">What Happens Next?</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    After submission, this vendor will be added to your portfolio with complete risk assessment data, vulnerability information, and compliance details. You'll be redirected to the vendor list to see your newly added vendor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Vendor</h1>
            <p className="text-gray-600">Complete the vendor onboarding process (Demo Mode)</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <div className="flex items-center justify-between p-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= step.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > step.id ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  step.icon
                )}
              </div>
              <div className="ml-3 min-w-0">
                <p className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`ml-6 w-8 h-px ${
                  currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Form Content */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {steps[currentStep - 1].title}
          </h2>
          {renderStepContent()}
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="text-sm text-gray-500">
          Step {currentStep} of {steps.length}
        </div>

        {currentStep === steps.length ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Adding Vendor...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add Vendor</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={nextStep}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && newVendorData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Vendor Added Successfully!</h2>
                  <p className="text-green-100">Your new vendor has been onboarded</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Vendor Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Vendor Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Name:</span> {newVendorData.name}</div>
                  <div><span className="font-medium">Industry:</span> {newVendorData.industry}</div>
                  <div><span className="font-medium">Country:</span> {newVendorData.country}</div>
                  <div><span className="font-medium">Criticality:</span> {newVendorData.criticality}</div>
                </div>
              </div>

              {/* Risk Scores */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Risk Assessment Results</h3>
                
                {/* Aggregate Score */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-blue-900">Overall Risk Score</span>
                    <span className={`text-2xl font-bold ${
                      newVendorData.scores.aggregate >= 75 ? 'text-green-600' :
                      newVendorData.scores.aggregate >= 50 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {newVendorData.scores.aggregate}/100
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        newVendorData.scores.aggregate >= 75 ? 'bg-green-500' :
                        newVendorData.scores.aggregate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${newVendorData.scores.aggregate}%` }}
                    />
                  </div>
                  <div className="mt-2 text-sm text-blue-700">
                    Risk Level: {
                      newVendorData.scores.aggregate >= 75 ? '🟢 Low Risk' :
                      newVendorData.scores.aggregate >= 50 ? '🟡 Medium Risk' : '🔴 High Risk'
                    }
                  </div>
                </div>

                {/* Pillar Scores */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Cybersecurity</div>
                    <div className="text-lg font-bold text-blue-600">{newVendorData.scores.cybersecurity}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Compliance</div>
                    <div className="text-lg font-bold text-green-600">{newVendorData.scores.compliance}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Geopolitical</div>
                    <div className="text-lg font-bold text-purple-600">{newVendorData.scores.geopolitical}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Reputation</div>
                    <div className="text-lg font-bold text-orange-600">{newVendorData.scores.reputation}</div>
                  </div>
                </div>

                {/* Breach Probability */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-red-900">Breach Probability</span>
                    <span className="text-xl font-bold text-red-600">
                      {Math.round(newVendorData.breachChance * 100)}%
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-red-700">
                    Based on risk score and asset criticality
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2">What's Next?</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Vendor added to your portfolio</li>
                  <li>• Risk assessment data available</li>
                  <li>• Monitor risk trends over time</li>
                  <li>• Schedule regular reviews</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  onVendorAdded(newVendorData);
                }}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                View in Vendor List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

