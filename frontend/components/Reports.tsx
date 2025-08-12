'use client';

import { useState } from 'react';
import { Download, FileText, BarChart3, Shield, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import Card from './ui/Card';
import { vendors, riskColor, criticalityColors } from '../mock-data';
import jsPDF from 'jspdf';

interface ReportStatus {
  [vendorId: string]: 'pending' | 'generating' | 'ready' | 'error';
}

export default function Reports() {
  const [reportStatus, setReportStatus] = useState<ReportStatus>({});
  const [selectedVendor, setSelectedVendor] = useState<any>(null);

  const generateReport = async (vendor: any) => {
    // Use vendor name as unique identifier since vendors don't have IDs
    const vendorKey = vendor.name;
    
    // Set only this vendor to generating
    setReportStatus(prev => ({ ...prev, [vendorKey]: 'generating' }));
    
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create and download comprehensive PDF report
      await createVendorReport(vendor);
      
      // Set only this vendor to ready
      setReportStatus(prev => ({ ...prev, [vendorKey]: 'ready' }));
      
      // Reset only this vendor's status after 3 seconds
      setTimeout(() => {
        setReportStatus(prev => ({ ...prev, [vendorKey]: 'pending' }));
      }, 3000);
      
    } catch (error) {
      console.error(`Error generating report for ${vendor.name}:`, error);
      // Set only this vendor to error
      setReportStatus(prev => ({ ...prev, [vendorKey]: 'error' }));
    }
  };

  const createVendorReport = async (vendor: any) => {
    try {
      const pdf = new jsPDF();
      // Page sizing (mm)
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const footerHeight = 14;
      const contentWidth = pageWidth - margin * 2;
      let yPosition = margin;
  
      // helper: convert hex to rgb array
      const hexToRgb = (hex: string) => {
        if (!hex) return [0, 0, 0];
        const h = hex.replace('#', '');
        const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
        return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
      };
  
      // Ensure there's enough space on page; if not, add page and reset yPosition.
      const ensureSpace = (needed: number) => {
        if (yPosition + needed > pageHeight - margin - footerHeight) {
          pdf.addPage();
          yPosition = margin;
        }
      };
  
      // Draw a section title with a colored bar
      const drawSectionTitle = (title: string) => {
        ensureSpace(14);
        pdf.setFillColor(10, 63, 160); // navy
        pdf.rect(margin, yPosition - 6, contentWidth, 8, 'F');
        pdf.setFontSize(12);
        pdf.setTextColor(255, 255, 255);
        pdf.text(title, margin + 2, yPosition);
        yPosition += 12;
        pdf.setTextColor(0, 0, 0); // reset
      };
  
      // Draw a horizontal score bar (label + bar)
      const drawScoreBar = (label: string, score: number, barColorHex?: string) => {
        ensureSpace(12);
        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`${label}`, margin, yPosition);
  
        const barX = margin + 62;
        const barW = 80;
        const barH = 5;
  
        // background track
        pdf.setDrawColor(220);
        pdf.setFillColor(240, 240, 240);
        pdf.rect(barX, yPosition - 4, barW, barH, 'F');
  
        // fill
        const fillW = Math.max(0, Math.min(barW, (score / 100) * barW));
        if (barColorHex) {
          const [r, g, b] = hexToRgb(barColorHex);
          pdf.setFillColor(r, g, b);
        } else {
          pdf.setFillColor(20, 130, 200);
        }
        pdf.rect(barX, yPosition - 4, fillW, barH, 'F');
  
        // numeric
        pdf.setFontSize(10);
        pdf.setTextColor(80);
        pdf.text(`${score}/100`, barX + barW + 6, yPosition);
  
        yPosition += 10;
      };
  
      // Draw two-column metadata block
      const drawTwoColumnMetadata = (left: Array<[string, string]>, right: Array<[string, string]>) => {
        ensureSpace( Math.max(left.length, right.length) * 6 + 6 );
        const leftX = margin;
        const rightX = margin + contentWidth / 2 + 6;
        let leftY = yPosition;
        let rightY = yPosition;
  
        const rows = Math.max(left.length, right.length);
        for (let i = 0; i < rows; i++) {
          if (left[i]) {
            pdf.setFontSize(10);
            pdf.setTextColor(0);
            pdf.text(`${left[i][0]}: ${left[i][1]}`, leftX, leftY);
            leftY += 6;
          }
          if (right[i]) {
            pdf.setFontSize(10);
            pdf.setTextColor(0);
            pdf.text(`${right[i][0]}: ${right[i][1]}`, rightX, rightY);
            rightY += 6;
          }
        }
        yPosition = Math.max(leftY, rightY) + 6;
      };
  
      // ==== COVER PAGE ====
      pdf.setFillColor(245, 248, 255);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      pdf.setFontSize(26);
      pdf.setTextColor(10, 63, 160);
      pdf.text('SCOPE PLATFORM', pageWidth / 2, 80, { align: 'center' });
      pdf.setFontSize(18);
      pdf.setTextColor(40, 40, 40);
      pdf.text(`${vendor.name}`, pageWidth / 2, 100, { align: 'center' });
      pdf.setFontSize(12);
      pdf.setTextColor(90);
      pdf.text('Comprehensive Risk Assessment Report', pageWidth / 2, 116, { align: 'center' });
      pdf.setFontSize(10);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 132, { align: 'center' });
      pdf.addPage();
      yPosition = margin;
  
      // ==== HEADER (first content page) ====
      pdf.setFontSize(18);
      pdf.setTextColor(10, 63, 160);
      pdf.text('SCOPE PLATFORM', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;
      pdf.setFontSize(14);
      pdf.setTextColor(0);
      pdf.text(`${vendor.name} - Risk Assessment Report`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 14;
  
      // ==== REPORT METADATA ====
      drawSectionTitle('REPORT METADATA');
  
      // prepare safe strings (do not change logic, only guard)
      const productsText = (vendor.products && Array.isArray(vendor.products)) ? vendor.products.join(', ') : String(vendor.products ?? 'N/A');
      const tagsText = (vendor.tags && Array.isArray(vendor.tags)) ? vendor.tags.join(', ') : String(vendor.tags ?? 'N/A');
      const questionnairesText = vendor.questionnaires 
        ? Object.entries(vendor.questionnaires).map(([k, v]) => `${k}: ${v ? 'Yes' : 'No'}`).join(', ')
        : 'N/A';
  
      const leftMeta: Array<[string,string]> = [
        ['Report Generated', new Date().toLocaleString()],
        ['Generated by', 'SCOPE Platform'],
        ['Report Type', 'Comprehensive Risk Assessment'],
        ['Document Version', '1.0'],
        ['Last Assessment', String(vendor.lastAssessment ?? 'N/A')],
        ['Last Scan', String(vendor.lastScan ?? 'N/A')]
      ];
      const rightMeta: Array<[string,string]> = [
        ['Vendor Website', String(vendor.website ?? 'N/A')],
        ['Products', productsText],
        ['Tags', tagsText],
        ['Breach Chance', vendor.breachChance != null ? `${(vendor.breachChance * 100).toFixed(1)}%` : 'N/A'],
        ['Questionnaires', questionnairesText]
      ];
  
      drawTwoColumnMetadata(leftMeta, rightMeta);
  
      // separator
      ensureSpace(12);
      pdf.setDrawColor(220);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;
  
      // ==== EXECUTIVE SUMMARY ====
      drawSectionTitle('EXECUTIVE SUMMARY');
  
      const riskLevel = vendor.score < 30 ? 'Critical' : vendor.score < 50 ? 'High' : vendor.score < 70 ? 'Medium' : 'Low';
      ensureSpace(36);
      // Left block: summary lines
      pdf.setFontSize(11);
      pdf.setTextColor(0);
      pdf.text(`Overall Risk Score: ${vendor.score}/100`, margin, yPosition);
      yPosition += 6;
      pdf.text(`Risk Level: ${riskLevel}`, margin, yPosition);
      yPosition += 6;
      pdf.text(`Criticality: ${vendor.criticality}`, margin, yPosition);
      yPosition += 6;
      pdf.text(`Industry: ${vendor.sector}`, margin, yPosition);
      yPosition += 6;
      pdf.text(`Country: ${vendor.country}`, margin, yPosition);
      yPosition += 8;
  
      // Right: colored score badge
      const badgeX = pageWidth - margin - 38;
      const badgeY = yPosition - 28;
      const badgeSize = 34;
      const scoreColorHex = riskColor ? riskColor(vendor.score) : '#1462C8';
      const [sr, sg, sb] = hexToRgb(String(scoreColorHex));
      pdf.setFillColor(sr, sg, sb);
      pdf.rect(badgeX, badgeY, badgeSize, badgeSize, 'F');
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text(String(vendor.score), badgeX + badgeSize / 2, badgeY + badgeSize / 2 + 4, { align: 'center' });
      yPosition += 6;
  
      // ==== RISK PILLAR ANALYSIS ====
      drawSectionTitle('RISK PILLAR ANALYSIS');
      const pillars = [
        { name: 'Cybersecurity', score: vendor.scores?.cybersecurity ?? 0, color: '#3B82F6' },
        { name: 'Compliance', score: vendor.scores?.compliance ?? 0, color: '#10B981' },
        { name: 'Geopolitical', score: vendor.scores?.geopolitical ?? 0, color: '#F59E0B' },
        { name: 'Reputation', score: vendor.scores?.reputation ?? 0, color: '#EF4444' }
      ];
      pillars.forEach((p) => drawScoreBar(p.name, p.score, p.color));
      yPosition += 4;
  
      // ==== DETAILED SCORE BREAKDOWN ====
      drawSectionTitle('DETAILED SCORE BREAKDOWN');
      ensureSpace(12);
      const categories = ['Vulnerability Management', 'Attack Surface', 'Web/App Security', 'Cloud & Infra', 'Email Security', 'Code Repo Exposure', 'Endpoint Hygiene', 'Detection & Response', 'Certifications', 'Questionnaire Quality', 'Regulatory Violations', 'Privacy Compliance', 'Contractual Clauses', 'Country Risk', 'Sector Risk', 'Company Size', 'Infra Jurisdiction', 'Concentration Risk', 'Environmental Exposure', 'Data Breach History', 'Credential/Data Leaks', 'Brand Spoofing', 'Dark Web Presence', 'Social Sentiment'];
      pdf.setFontSize(10);
      for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const detail = vendor.scoreDetails?.find((d: any) => d.category === category);
        if (detail) {
          ensureSpace(8);
          pdf.text(`${i + 1}. ${category}: ${detail.score}/100 (Weight: ${detail.weight}%)`, margin, yPosition);
          yPosition += 6;
        }
      }
      yPosition += 8;
  
      // ==== BUSINESS CONTEXT ====
      drawSectionTitle('BUSINESS CONTEXT');
      ensureSpace(36);
      pdf.setFontSize(11);
      pdf.text(`Function: ${vendor.function ?? 'N/A'}`, margin, yPosition); yPosition += 6;
      pdf.text(`Employee Count: ${vendor.employeeCount ?? 'N/A'}`, margin, yPosition); yPosition += 6;
      pdf.text(`Revenue: ${vendor.revenue ?? 'N/A'}`, margin, yPosition); yPosition += 6;
      pdf.text(`Asset Importance: ${vendor.assetImportance ?? 'N/A'}`, margin, yPosition); yPosition += 6;
      pdf.text(`Internal Dependencies: ${vendor.internalDependencies ?? 'N/A'}`, margin, yPosition); yPosition += 6;
      pdf.text(`Global Footprint: ${vendor.globalFootprint ?? 'N/A'}`, margin, yPosition); yPosition += 6;
      pdf.text(`Data Center Region: ${vendor.dataCenterRegion ?? 'N/A'}`, margin, yPosition); yPosition += 8;
  
      // ==== SECURITY POSTURE ====
      drawSectionTitle('SECURITY POSTURE');
      ensureSpace(36);
      pdf.text(`EDR/AV: ${vendor.edrAv ? 'Yes' : 'No'}`, margin, yPosition); yPosition += 6;
      pdf.text(`MDM/BYOD: ${vendor.mdmByod ? 'Yes' : 'No'}`, margin, yPosition); yPosition += 6;
      pdf.text(`Incident Response Plan: ${vendor.incidentResponsePlan ? 'Yes' : 'No'}`, margin, yPosition); yPosition += 6;
      pdf.text(`Compliance Documentation: ${vendor.complianceDoc ? 'Yes' : 'No'}`, margin, yPosition); yPosition += 6;
      pdf.text(`Certifications: ${vendor.certifications ?? 'N/A'}`, margin, yPosition); yPosition += 6;
      pdf.text(`Frameworks: ${vendor.frameworks ?? 'N/A'}`, margin, yPosition); yPosition += 8;
  
      // ==== INFRASTRUCTURE DETAILS ====
      drawSectionTitle('INFRASTRUCTURE DETAILS');
      ensureSpace(24);
      pdf.text(`Public IP Range: ${vendor.publicIp ?? 'N/A'}`, margin, yPosition); yPosition += 6;
      pdf.text(`Subdomains: ${vendor.subdomains ?? 'N/A'}`, margin, yPosition); yPosition += 6;
      pdf.text(`GitHub Organization: ${vendor.githubOrg ?? 'N/A'}`, margin, yPosition); yPosition += 8;
  
      // ==== RECOMMENDATIONS ====
      drawSectionTitle('RECOMMENDATIONS');
      ensureSpace(36);
      let recommendationText = '';
      if (vendor.score < 30) {
        recommendationText = 'IMMEDIATE ACTION REQUIRED: This vendor poses critical risks that require immediate remediation or replacement consideration. Implement enhanced monitoring and schedule immediate risk review meetings.';
      } else if (vendor.score < 50) {
        recommendationText = 'HIGH PRIORITY: Implement risk mitigation strategies and increase monitoring frequency. Develop comprehensive risk mitigation plans and conduct monthly reviews.';
      } else if (vendor.score < 70) {
        recommendationText = 'MODERATE CONCERN: Continue monitoring and implement standard risk management practices. Schedule quarterly risk assessments and maintain current controls.';
      } else {
        recommendationText = 'LOW RISK: Maintain current risk management practices and periodic reassessment. Continue annual reviews and standard monitoring procedures.';
      }
      const wrappedRec = pdf.splitTextToSize(recommendationText, contentWidth);
      pdf.setFontSize(11);
      pdf.text(wrappedRec, margin, yPosition);
      yPosition += wrappedRec.length * 6 + 8;
  
      // ==== NEXT STEPS ====
      drawSectionTitle('NEXT STEPS');
      ensureSpace(24);
      const nextSteps = [
        vendor.score < 50 ? 'Schedule immediate risk review meeting' : 'Schedule quarterly risk review',
        vendor.score < 70 ? 'Implement enhanced monitoring' : 'Continue standard monitoring',
        vendor.score < 50 ? 'Develop risk mitigation plan' : 'Update risk assessment',
        vendor.score < 30 ? 'Consider vendor replacement' : 'Maintain vendor relationship',
        'Conduct follow-up assessment in 3 months',
        'Review and update risk controls'
      ];
      pdf.setFontSize(11);
      nextSteps.forEach((step, idx) => {
        ensureSpace(10);
        pdf.text(`${idx + 1}. ${step}`, margin, yPosition);
        yPosition += 7;
      });
  
      // ==== Footer content on last page (small summary) ====
      ensureSpace(footerHeight + 6);
      pdf.setFontSize(10);
      pdf.setTextColor(120);
      pdf.text(`Report Generated: ${new Date().toLocaleString()}`, margin, pageHeight - footerHeight + 2);
      pdf.text('Generated by: SCOPE Platform', margin, pageHeight - footerHeight + 8);
      pdf.text('Last Assessment: ' + (vendor.lastAssessment ?? 'N/A'), margin + 80, pageHeight - footerHeight + 2);
      pdf.text('Last Scan: ' + (vendor.lastScan ?? 'N/A'), margin + 80, pageHeight - footerHeight + 8);
  
      // ==== Page numbers & final footer on EVERY page ====
      const pageCount = (pdf.internal as any).getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setDrawColor(220);
        pdf.line(margin, pageHeight - footerHeight - 2, pageWidth - margin, pageHeight - footerHeight - 2);
        pdf.setFontSize(9);
        pdf.setTextColor(120);
        pdf.text('SCOPE Platform — Confidential', margin, pageHeight - 6);
        pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 6, { align: 'right' });
      }
  
      // Save file (same name pattern)
      pdf.save(`${vendor.name}_Comprehensive_Risk_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error creating PDF report:', error);
      throw error;
    }
  };
  
  



  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'generating':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'ready':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'generating':
        return 'Generating...';
      case 'ready':
        return 'Ready';
      case 'error':
        return 'Error';
      default:
        return 'Generate Report';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generating':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ready':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
             {/* Header */}
       <div className="text-center">
         <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Risk Reports</h1>
         <p className="text-gray-600">Generate comprehensive risk assessment reports for all vendors</p>
       </div>
       
       

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{vendors.length}</h3>
            <p className="text-gray-600">Total Vendors</p>
          </div>
        </Card>
        
        <Card>
          <div className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {vendors.filter(v => v.score >= 70).length}
            </h3>
            <p className="text-gray-600">Low Risk</p>
          </div>
        </Card>
        
        <Card>
          <div className="p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {vendors.filter(v => v.score < 70 && v.score >= 30).length}
            </h3>
            <p className="text-gray-600">Medium Risk</p>
          </div>
        </Card>
        
        <Card>
          <div className="p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {vendors.filter(v => v.score < 30).length}
            </h3>
            <p className="text-gray-600">High Risk</p>
          </div>
        </Card>
      </div>

      {/* Vendor Reports List */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Available Reports</h2>
          
          <div className="space-y-4">
                         {vendors.map((vendor) => (
               <div key={vendor.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-gray-700">
                      {vendor.name.charAt(0)}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{vendor.sector}</span>
                      <span>•</span>
                      <span>{vendor.country}</span>
                      <span>•</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${criticalityColors[vendor.criticality]}`}>
                        {vendor.criticality}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold" style={{ color: riskColor(vendor.score) }}>
                      {vendor.score}
                    </div>
                    <div className="text-sm text-gray-600">Risk Score</div>
                  </div>
                  
                                     <button
                     onClick={() => generateReport(vendor)}
                     disabled={reportStatus[vendor.name] === 'generating'}
                     className={`px-4 py-2 rounded-lg border font-medium transition-colors ${getStatusColor(reportStatus[vendor.name] || 'pending')}`}
                   >
                     <div className="flex items-center space-x-2">
                       {getStatusIcon(reportStatus[vendor.name] || 'pending')}
                       <span>{getStatusText(reportStatus[vendor.name] || 'pending')}</span>
                     </div>
                   </button>

                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Report Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Comprehensive Analysis</h3>
            </div>
            <p className="text-gray-600">
              Each report includes detailed risk pillar analysis, score breakdowns, 
              and actionable recommendations based on vendor performance.
            </p>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Risk Trends</h3>
            </div>
            <p className="text-gray-600">
              Track vendor risk changes over time with historical data and 
              trend analysis to identify emerging risks early.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
