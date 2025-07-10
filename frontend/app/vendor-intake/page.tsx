'use client'

import { useState } from 'react'
import Layout from '../../components/Layout'
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Shield, 
  FileText, 
  Save,
  Plus,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

interface VendorFormData {
  company_name: string
  contact_name: string
  contact_email: string
  contact_phone: string
  website: string
  industry: string
  employee_count: string
  annual_revenue: string
  data_processed: string[]
  compliance_frameworks: string[]
  security_certifications: string[]
  risk_level: string
  description: string
}

export default function VendorIntakePage() {
  const [formData, setFormData] = useState<VendorFormData>({
    company_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    website: '',
    industry: '',
    employee_count: '',
    annual_revenue: '',
    data_processed: [],
    compliance_frameworks: [],
    security_certifications: [],
    risk_level: 'Medium',
    description: ''
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [newVendorId, setNewVendorId] = useState<number | null>(null)

  const industries = [
    'Technology', 'Financial Services', 'Healthcare', 'Manufacturing', 
    'Retail', 'Education', 'Government', 'Non-Profit', 'Other'
  ]

  const dataTypes = [
    'Personal Information', 'Financial Data', 'Health Records', 
    'Intellectual Property', 'Trade Secrets', 'Customer Data', 
    'Employee Data', 'System Logs', 'None'
  ]

  const frameworks = [
    'ISO 27001', 'SOC 2', 'PCI DSS', 'HIPAA', 'GDPR', 
    'SOX', 'NIST', 'FedRAMP', 'None'
  ]

  const certifications = [
    'CISSP', 'CISM', 'CISA', 'CRISC', 'CCSP', 
    'Security+', 'CEH', 'None'
  ]

  const handleInputChange = (field: keyof VendorFormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayChange = (field: keyof VendorFormData, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter(item => item !== value)
    }))
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.company_name && formData.contact_name && formData.contact_email)
      case 2:
        return !!(formData.industry && formData.employee_count && formData.annual_revenue)
      case 3:
        return formData.data_processed.length > 0
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const response = await fetch(`${apiBase}/api/vendors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      setNewVendorId(result.vendor_id)
      setSubmitStatus('success')
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          company_name: '',
          contact_name: '',
          contact_email: '',
          contact_phone: '',
          website: '',
          industry: '',
          employee_count: '',
          annual_revenue: '',
          data_processed: [],
          compliance_frameworks: [],
          security_certifications: [],
          risk_level: 'Medium',
          description: ''
        })
        setCurrentStep(1)
        setSubmitStatus('idle')
        setNewVendorId(null)
      }, 3000)
    } catch (error) {
      console.error('Error submitting vendor:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExport = async (format: 'pdf' | 'json') => {
    if (!vendorId) return;
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const url = `${apiBase}/api/vendors/${vendorId}/report?format=${format}`;
    const res = await fetch(url);
    if (format === 'pdf') {
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `vendor_${vendorId}_report.pdf`;
      link.click();
    } else {
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `vendor_${vendorId}_report.json`;
      link.click();
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
            step <= currentStep 
              ? 'bg-primary-600 border-primary-600 text-white' 
              : 'border-gray-300 text-gray-500'
          }`}>
            {step < currentStep ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              step
            )}
          </div>
          {step < 4 && (
            <div className={`w-16 h-0.5 mx-2 ${
              step < currentStep ? 'bg-primary-600' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  )

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Building2 className="inline h-4 w-4 mr-1" />
            Company Name *
          </label>
          <input
            type="text"
            value={formData.company_name}
            onChange={(e) => handleInputChange('company_name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter company name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Globe className="inline h-4 w-4 mr-1" />
            Website
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline h-4 w-4 mr-1" />
            Contact Name *
          </label>
          <input
            type="text"
            value={formData.contact_name}
            onChange={(e) => handleInputChange('contact_name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter contact name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="inline h-4 w-4 mr-1" />
            Contact Email *
          </label>
          <input
            type="email"
            value={formData.contact_email}
            onChange={(e) => handleInputChange('contact_email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="contact@company.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="inline h-4 w-4 mr-1" />
            Contact Phone
          </label>
          <input
            type="tel"
            value={formData.contact_phone}
            onChange={(e) => handleInputChange('contact_phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Company Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Industry *
          </label>
          <select
            value={formData.industry}
            onChange={(e) => handleInputChange('industry', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select industry</option>
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employee Count *
          </label>
          <select
            value={formData.employee_count}
            onChange={(e) => handleInputChange('employee_count', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select range</option>
            <option value="1-10">1-10</option>
            <option value="11-50">11-50</option>
            <option value="51-200">51-200</option>
            <option value="201-1000">201-1000</option>
            <option value="1001-5000">1001-5000</option>
            <option value="5000+">5000+</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Revenue *
          </label>
          <select
            value={formData.annual_revenue}
            onChange={(e) => handleInputChange('annual_revenue', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select range</option>
            <option value="<1M">&lt;$1M</option>
            <option value="1M-10M">$1M-$10M</option>
            <option value="10M-100M">$10M-$100M</option>
            <option value="100M-1B">$100M-$1B</option>
            <option value=">1B">&gt;$1B</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Initial Risk Level
          </label>
          <select
            value={formData.risk_level}
            onChange={(e) => handleInputChange('risk_level', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Brief description of the vendor relationship..."
        />
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Data & Compliance</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Types of Data Processed *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {dataTypes.map(dataType => (
            <label key={dataType} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.data_processed.includes(dataType)}
                onChange={(e) => handleArrayChange('data_processed', dataType, e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">{dataType}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Compliance Frameworks
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {frameworks.map(framework => (
            <label key={framework} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.compliance_frameworks.includes(framework)}
                onChange={(e) => handleArrayChange('compliance_frameworks', framework, e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">{framework}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Security Certifications
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {certifications.map(cert => (
            <label key={cert} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.security_certifications.includes(cert)}
                onChange={(e) => handleArrayChange('security_certifications', cert, e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">{cert}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Review & Submit</h2>
      
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Company Information</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Name:</strong> {formData.company_name}</p>
              <p><strong>Website:</strong> {formData.website || 'Not provided'}</p>
              <p><strong>Industry:</strong> {formData.industry}</p>
              <p><strong>Employees:</strong> {formData.employee_count}</p>
              <p><strong>Revenue:</strong> {formData.annual_revenue}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Contact Information</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Contact:</strong> {formData.contact_name}</p>
              <p><strong>Email:</strong> {formData.contact_email}</p>
              <p><strong>Phone:</strong> {formData.contact_phone || 'Not provided'}</p>
              <p><strong>Risk Level:</strong> {formData.risk_level}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-900 mb-2">Data & Compliance</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Data Types:</strong> {formData.data_processed.join(', ') || 'None selected'}</p>
            <p><strong>Frameworks:</strong> {formData.compliance_frameworks.join(', ') || 'None selected'}</p>
            <p><strong>Certifications:</strong> {formData.security_certifications.join(', ') || 'None selected'}</p>
          </div>
        </div>

        {formData.description && (
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-sm text-gray-600">{formData.description}</p>
          </div>
        )}
      </div>

      {submitStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-green-800">Vendor successfully added to your supply chain!</span>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <XCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-800">Error submitting vendor. Please try again.</span>
        </div>
      )}
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1()
      case 2: return renderStep2()
      case 3: return renderStep3()
      case 4: return renderStep4()
      default: return renderStep1()
    }
  }

  const router = useRouter();
  const searchParams = useSearchParams();
  const vendorId = searchParams.get('id');

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vendor Intake Form</h1>
            <p className="text-gray-600">Add new vendors to your supply chain risk management program</p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Bulk Import</span>
          </button>
        </div>

        {vendorId && (
          <div className="flex gap-2 mb-6">
            <button
              className="flex items-center space-x-1 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
              onClick={() => handleExport('pdf')}
            >
              <FileText className="h-4 w-4" />
              <span>Download PDF</span>
            </button>
            <button
              className="flex items-center space-x-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              onClick={() => handleExport('json')}
            >
              <FileText className="h-4 w-4" />
              <span>Download JSON</span>
            </button>
          </div>
        )}

        {renderStepIndicator()}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {renderCurrentStep()}

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex space-x-3">
              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  disabled={!validateStep(currentStep)}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <span>Next</span>
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !validateStep(currentStep)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Submit Vendor</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
} 