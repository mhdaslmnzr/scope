#!/usr/bin/env python3
"""
SCOPE System Test Script
Tests all major components of the SCOPE platform
"""

import requests
import json
import time
import sys
from datetime import datetime

# Configuration
API_BASE = "http://localhost:5000"
FRONTEND_BASE = "http://localhost:3000"

def print_status(message, status="INFO"):
    """Print formatted status message"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] [{status}] {message}")

def test_backend_health():
    """Test backend health endpoint"""
    print_status("Testing backend health...")
    try:
        response = requests.get(f"{API_BASE}/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print_status(f"✅ Backend healthy: {data.get('service', 'Unknown')} v{data.get('version', 'Unknown')}")
            return True
        else:
            print_status(f"❌ Backend health check failed: {response.status_code}", "ERROR")
            return False
    except Exception as e:
        print_status(f"❌ Backend health check error: {str(e)}", "ERROR")
        return False

def test_dashboard_stats():
    """Test dashboard statistics endpoint"""
    print_status("Testing dashboard statistics...")
    try:
        response = requests.get(f"{API_BASE}/api/dashboard/stats", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print_status(f"✅ Dashboard stats: {data.get('total_clients', 0)} vendors, avg risk: {data.get('average_risk_score', 0)}")
            return True
        else:
            print_status(f"❌ Dashboard stats failed: {response.status_code}", "ERROR")
            return False
    except Exception as e:
        print_status(f"❌ Dashboard stats error: {str(e)}", "ERROR")
        return False

def test_vendors_endpoint():
    """Test vendors endpoint"""
    print_status("Testing vendors endpoint...")
    try:
        response = requests.get(f"{API_BASE}/api/vendors", timeout=5)
        if response.status_code == 200:
            data = response.json()
            vendors = data.get('vendors', [])
            print_status(f"✅ Vendors endpoint: {len(vendors)} vendors found")
            return True
        else:
            print_status(f"❌ Vendors endpoint failed: {response.status_code}", "ERROR")
            return False
    except Exception as e:
        print_status(f"❌ Vendors endpoint error: {str(e)}", "ERROR")
        return False

def test_ai_reports():
    """Test AI reports endpoint"""
    print_status("Testing AI reports...")
    try:
        response = requests.get(f"{API_BASE}/api/ai-reports", timeout=5)
        if response.status_code == 200:
            data = response.json()
            reports = data.get('reports', [])
            print_status(f"✅ AI reports: {len(reports)} reports generated")
            return True
        else:
            print_status(f"❌ AI reports failed: {response.status_code}", "ERROR")
            return False
    except Exception as e:
        print_status(f"❌ AI reports error: {str(e)}", "ERROR")
        return False

def test_alerts():
    """Test alerts endpoint"""
    print_status("Testing alerts endpoint...")
    try:
        response = requests.get(f"{API_BASE}/api/alerts", timeout=5)
        if response.status_code == 200:
            data = response.json()
            alerts = data.get('alerts', [])
            print_status(f"✅ Alerts: {len(alerts)} active alerts")
            return True
        else:
            print_status(f"❌ Alerts failed: {response.status_code}", "ERROR")
            return False
    except Exception as e:
        print_status(f"❌ Alerts error: {str(e)}", "ERROR")
        return False

def test_monitoring_events():
    """Test monitoring events endpoint"""
    print_status("Testing monitoring events...")
    try:
        response = requests.get(f"{API_BASE}/api/monitoring/events", timeout=5)
        if response.status_code == 200:
            data = response.json()
            events = data.get('events', [])
            print_status(f"✅ Monitoring events: {len(events)} events")
            return True
        else:
            print_status(f"❌ Monitoring events failed: {response.status_code}", "ERROR")
            return False
    except Exception as e:
        print_status(f"❌ Monitoring events error: {str(e)}", "ERROR")
        return False

def test_osint_collection():
    """Test OSINT collection"""
    print_status("Testing OSINT collection...")
    try:
        # Test with a safe domain
        response = requests.get(f"{API_BASE}/api/osint/collect/example.com", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print_status(f"✅ OSINT collection: Data collected for example.com")
            return True
        else:
            print_status(f"❌ OSINT collection failed: {response.status_code}", "ERROR")
            return False
    except Exception as e:
        print_status(f"❌ OSINT collection error: {str(e)}", "ERROR")
        return False

def test_report_generation():
    """Test report generation"""
    print_status("Testing report generation...")
    try:
        # First get a vendor ID
        vendors_response = requests.get(f"{API_BASE}/api/vendors", timeout=5)
        if vendors_response.status_code != 200:
            print_status("❌ Cannot test reports - no vendors available", "WARNING")
            return False
        
        vendors = vendors_response.json().get('vendors', [])
        if not vendors:
            print_status("❌ Cannot test reports - no vendors available", "WARNING")
            return False
        
        vendor_id = vendors[0]['id']
        
        # Test JSON report
        json_response = requests.get(f"{API_BASE}/api/vendors/{vendor_id}/report?format=json", timeout=5)
        if json_response.status_code == 200:
            print_status("✅ JSON report generation working")
        else:
            print_status(f"❌ JSON report failed: {json_response.status_code}", "ERROR")
            return False
        
        # Test PDF/HTML report
        pdf_response = requests.get(f"{API_BASE}/api/vendors/{vendor_id}/report?format=pdf", timeout=10)
        if pdf_response.status_code == 200:
            print_status("✅ PDF/HTML report generation working")
        elif pdf_response.status_code == 503:
            print_status("⚠️ PDF generation not available (expected on Windows)", "WARNING")
        else:
            print_status(f"❌ PDF report failed: {pdf_response.status_code}", "ERROR")
            return False
        
        return True
    except Exception as e:
        print_status(f"❌ Report generation error: {str(e)}", "ERROR")
        return False

def test_frontend_connectivity():
    """Test frontend connectivity"""
    print_status("Testing frontend connectivity...")
    try:
        response = requests.get(FRONTEND_BASE, timeout=5)
        if response.status_code == 200:
            print_status("✅ Frontend accessible")
            return True
        else:
            print_status(f"❌ Frontend not accessible: {response.status_code}", "ERROR")
            return False
    except Exception as e:
        print_status(f"❌ Frontend connectivity error: {str(e)}", "ERROR")
        return False

def run_comprehensive_test():
    """Run all tests"""
    print_status("🚀 Starting SCOPE System Comprehensive Test", "INFO")
    print_status("=" * 50, "INFO")
    
    tests = [
        ("Backend Health", test_backend_health),
        ("Dashboard Stats", test_dashboard_stats),
        ("Vendors Endpoint", test_vendors_endpoint),
        ("AI Reports", test_ai_reports),
        ("Alerts", test_alerts),
        ("Monitoring Events", test_monitoring_events),
        ("OSINT Collection", test_osint_collection),
        ("Report Generation", test_report_generation),
        ("Frontend Connectivity", test_frontend_connectivity),
    ]
    
    results = []
    for test_name, test_func in tests:
        print_status(f"Testing: {test_name}")
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print_status(f"❌ {test_name} test crashed: {str(e)}", "ERROR")
            results.append((test_name, False))
        print()
    
    # Summary
    print_status("=" * 50, "INFO")
    print_status("📊 TEST SUMMARY", "INFO")
    print_status("=" * 50, "INFO")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print_status(f"{test_name}: {status}")
    
    print_status("=" * 50, "INFO")
    print_status(f"Overall: {passed}/{total} tests passed", "INFO")
    
    if passed == total:
        print_status("🎉 All tests passed! System is working correctly.", "SUCCESS")
        return True
    else:
        print_status(f"⚠️ {total - passed} tests failed. Please check the issues above.", "WARNING")
        return False

if __name__ == "__main__":
    print("SCOPE System Test Script")
    print("Make sure both backend (port 5000) and frontend (port 3000) are running")
    print()
    
    try:
        success = run_comprehensive_test()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print_status("Test interrupted by user", "INFO")
        sys.exit(1)
    except Exception as e:
        print_status(f"Test script error: {str(e)}", "ERROR")
        sys.exit(1) 