#!/usr/bin/env python3
"""
Test script for SCOPE API endpoints
"""

import requests
import json
from datetime import datetime

# API base URL
BASE_URL = "http://localhost:5000"

def test_health_check():
    """Test the health check endpoint"""
    print("🔍 Testing health check...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_create_client():
    """Test creating a new client"""
    print("🔍 Testing client creation...")
    
    client_data = {
        "company_name": "Pharmexis BioTech Pvt Ltd",
        "sector": "Pharmaceuticals",
        "country": "India",
        "continent": "Asia",
        "region": "APAC",
        "domain": "pharmexisbio.com",
        "third_party_vendors": ["Twilio", "Netlify", "AWS"],
        "security_posture": {
            "network_security": ["Palo Alto Networks", "Cisco ASA"],
            "endpoint_security": ["CrowdStrike Falcon", "SentinelOne"],
            "iam": ["Azure AD", "Okta"],
            "cloud_security": ["AWS Security Hub", "Azure Security Center"],
            "compliance_tools": ["Vanta", "Drata"],
            "vulnerability_management": ["Qualys", "Rapid7"],
            "email_security": ["Proofpoint", "Mimecast"],
            "backup_recovery": ["Veeam", "Commvault"],
            "gaps_or_remarks": "No DLP solution implemented. Consider adding data loss prevention tools."
        },
        "employee_contacts": [
            {
                "name": "Ayesha Rao",
                "email": "ayesha.rao@pharmexisbio.com",
                "role": "Chief Security Officer"
            },
            {
                "name": "Rahul Iyer",
                "email": "rahul.iyer@pharmexisbio.com",
                "role": "Security Lead"
            },
            {
                "name": "Priya Sharma",
                "email": "priya.sharma@pharmexisbio.com",
                "role": "IT Security Analyst"
            }
        ],
        "compliance_standards": ["ISO 27001", "HIPAA", "GDPR", "SOX"],
        "known_data_breaches": "None reported in the last 3 years",
        "last_audit_date": "2024-12-20"
    }
    
    response = requests.post(
        f"{BASE_URL}/api/clients",
        json=client_data,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status: {response.status_code}")
    if response.status_code == 201:
        result = response.json()
        print(f"✅ Client created successfully!")
        print(f"Client ID: {result['client_id']}")
        print(f"Company: {result['company_name']}")
        return result['client_id']
    else:
        print(f"❌ Error: {response.json()}")
        return None

def test_get_clients():
    """Test getting all clients"""
    print("🔍 Testing get all clients...")
    response = requests.get(f"{BASE_URL}/api/clients")
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Found {result['total']} clients")
        for client in result['clients']:
            print(f"  - {client['company_name']} ({client['sector']})")
    else:
        print(f"❌ Error: {response.json()}")
    print()

def test_get_client(client_id):
    """Test getting a specific client"""
    print(f"🔍 Testing get client {client_id}...")
    response = requests.get(f"{BASE_URL}/api/clients/{client_id}")
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        client = response.json()
        print(f"✅ Client details retrieved!")
        print(f"Company: {client['company_name']}")
        print(f"Sector: {client['sector']}")
        print(f"Country: {client['country']}")
        print(f"Domain: {client['domain']}")
        print(f"Employee Contacts: {len(client['employee_contacts'])}")
        print(f"Security Tools: {len(client['security_posture']['network_security'])} network security tools")
    else:
        print(f"❌ Error: {response.json()}")
    print()

def test_validation_error():
    """Test validation error handling"""
    print("🔍 Testing validation error...")
    
    invalid_data = {
        "company_name": "",  # Empty name should fail validation
        "sector": "Pharmaceuticals",
        "country": "India"
        # Missing required fields
    }
    
    response = requests.post(
        f"{BASE_URL}/api/clients",
        json=invalid_data,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status: {response.status_code}")
    if response.status_code == 400:
        print("✅ Validation error handled correctly")
        print(f"Error details: {response.json()}")
    else:
        print(f"❌ Unexpected response: {response.json()}")
    print()

def main():
    """Run all tests"""
    print("🚀 Starting SCOPE API Tests")
    print("=" * 50)
    
    try:
        # Test health check
        test_health_check()
        
        # Test client creation
        client_id = test_create_client()
        
        if client_id:
            # Test getting all clients
            test_get_clients()
            
            # Test getting specific client
            test_get_client(client_id)
        
        # Test validation error
        test_validation_error()
        
        print("✅ All tests completed!")
        
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to the API. Make sure the Flask server is running on http://localhost:5000")
    except Exception as e:
        print(f"❌ Test failed with error: {e}")

if __name__ == "__main__":
    main() 