"use client"

import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { FileText, Download, BarChart3, Sparkles } from "lucide-react";

interface AIReport {
  id: number;
  vendor_name: string;
  report_date: string;
  summary: string;
  recommendations: string[];
  risk_score: number;
}

export default function AIReportsPage() {
  const [reports, setReports] = useState<AIReport[]>([]);

  useEffect(() => {
    setReports([
      {
        id: 1,
        vendor_name: "TechFlow Solutions",
        report_date: "2024-06-10",
        summary: "Vendor demonstrates strong security posture but has moderate phishing risk.",
        recommendations: [
          "Enhance employee phishing training.",
          "Implement advanced email filtering.",
        ],
        risk_score: 78,
      },
      {
        id: 2,
        vendor_name: "GlobalBank Financial",
        report_date: "2024-06-09",
        summary: "High ransomware risk due to legacy systems and recent incidents.",
        recommendations: [
          "Upgrade legacy infrastructure.",
          "Increase backup frequency.",
        ],
        risk_score: 62,
      },
      {
        id: 3,
        vendor_name: "Pharmexis BioTech",
        report_date: "2024-06-08",
        summary: "Low insider threat risk, but web application vulnerabilities detected.",
        recommendations: [
          "Conduct web app penetration testing.",
          "Review access controls.",
        ],
        risk_score: 85,
      },
    ]);
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI-Generated Risk Reports</h1>
            <p className="text-gray-600">Automated insights, risk summaries, and recommendations for your vendors</p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export All Reports</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="h-5 w-5 text-primary-600" />
                  <span className="text-lg font-semibold text-gray-900">{report.vendor_name}</span>
                </div>
                <div className="text-sm text-gray-500 mb-2">{new Date(report.report_date).toLocaleDateString()}</div>
                <div className="mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                    Risk Score: {report.risk_score}
                  </span>
                </div>
                <div className="mb-2 text-gray-700">{report.summary}</div>
                <div className="mb-2">
                  <span className="font-semibold text-gray-800">Recommendations:</span>
                  <ul className="list-disc ml-6 mt-1 text-gray-700">
                    {report.recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button className="flex items-center space-x-1 px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors">
                  <Sparkles className="h-4 w-4" />
                  <span>Generate New</span>
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Risk Analysis & Trends</h2>
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Visualize AI-generated risk scores and recommendations over time</p>
            <p className="text-sm text-gray-400">Charts and analytics coming soon</p>
          </div>
        </div>
      </div>
    </Layout>
  );
} 