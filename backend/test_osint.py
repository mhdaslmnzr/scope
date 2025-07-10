#!/usr/bin/env python3
"""
Test script for OSINT Collector
"""

import sys
import json
from osint_collector import collect_vendor_osint

def test_osint_collector():
    """Test the OSINT collector with sample domains"""
    
    # Test domains (safe for testing)
    test_domains = [
        "httpbin.org",
        "example.com", 
        "test.com"
    ]
    
    print("🔍 Testing OSINT Collector")
    print("=" * 50)
    
    for domain in test_domains:
        print(f"\n📊 Collecting OSINT data for: {domain}")
        print("-" * 40)
        
        try:
            # Collect OSINT data
            result = collect_vendor_osint(domain)
            
            # Print summary
            scores = result.get('scores', {})
            print(f"✅ SSL Score: {scores.get('ssl_score', 'N/A')}")
            print(f"✅ DNS Email Score: {scores.get('dns_email_score', 'N/A')}")
            print(f"✅ HTTP Headers Score: {scores.get('http_headers_score', 'N/A')}")
            print(f"✅ Open Ports Score: {scores.get('open_ports_score', 'N/A')}")
            print(f"✅ Reputation Score: {scores.get('reputation_score', 'N/A')}")
            
            # Dark web exposure
            dark_web = result.get('dark_web_exposure', {})
            exposed = dark_web.get('exposed', False)
            print(f"🌐 Dark Web Exposure: {'Yes' if exposed else 'No'}")
            
            # Basic info
            basic_info = result.get('basic_info', {})
            if 'error' not in basic_info:
                print(f"🏢 Registrar: {basic_info.get('registrar', 'N/A')}")
                print(f"🌍 Country: {basic_info.get('country', 'N/A')}")
            
            # SSL info
            ssl_info = result.get('ssl_info', {})
            if ssl_info.get('certificate_valid'):
                print(f"🔒 SSL Valid: Yes")
                print(f"🔒 Days until expiry: {ssl_info.get('days_until_expiry', 'N/A')}")
            else:
                print(f"🔒 SSL Valid: No")
            
            # DNS info
            dns_info = result.get('dns_info', {})
            if 'error' not in dns_info:
                print(f"📧 SPF Record: {'Yes' if dns_info.get('spf_record') else 'No'}")
                print(f"📧 DMARC Record: {'Yes' if dns_info.get('dmarc_record') else 'No'}")
                print(f"📧 MX Records: {len(dns_info.get('mx_records', []))}")
            
            # Port scan
            port_scan = result.get('port_scan', {})
            if 'error' not in port_scan:
                open_ports = port_scan.get('open_ports', [])
                print(f"🔌 Open Ports: {open_ports}")
            
            print("✅ Collection completed successfully")
            
        except Exception as e:
            print(f"❌ Error collecting data for {domain}: {e}")
        
        print("-" * 40)
    
    print("\n🎉 OSINT Collector test completed!")

def test_single_domain(domain):
    """Test a single domain and return detailed results"""
    print(f"🔍 Testing OSINT collection for: {domain}")
    
    try:
        result = collect_vendor_osint(domain)
        
        # Print detailed results
        print(json.dumps(result, indent=2))
        
        return result
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

if __name__ == "__main__":
    if len(sys.argv) > 1:
        # Test specific domain
        domain = sys.argv[1]
        test_single_domain(domain)
    else:
        # Run full test
        test_osint_collector() 