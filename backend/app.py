from flask import Flask, request, jsonify, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from marshmallow import Schema, fields, ValidationError
from datetime import datetime, timedelta
import os
import random
import json
from dotenv import load_dotenv
import uuid
from osint_collector import collect_vendor_osint
# Try to import vendor report, but handle missing dependencies gracefully
try:
    from vendor_report import generate_vendor_report
    VENDOR_REPORT_AVAILABLE = True
except ImportError as e:
    print(f"Vendor report generation not available: {e}")
    print("PDF report generation will be disabled. JSON reports will still work.")
    VENDOR_REPORT_AVAILABLE = False

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://postgres:1234@localhost:5432/scope_db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
CORS(app)

# Enhanced Database Models
class EmployeeContact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(50), nullable=False)

class SecurityPosture(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'), nullable=False)
    network_security = db.Column(db.JSON)
    endpoint_security = db.Column(db.JSON)
    iam = db.Column(db.JSON)
    cloud_security = db.Column(db.JSON)
    compliance_tools = db.Column(db.JSON)
    vulnerability_management = db.Column(db.JSON)
    email_security = db.Column(db.JSON)
    backup_recovery = db.Column(db.JSON)
    gaps_or_remarks = db.Column(db.Text)

class RiskAssessment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'), nullable=False)
    overall_risk_score = db.Column(db.Float, nullable=False)
    network_risk_score = db.Column(db.Float)
    endpoint_risk_score = db.Column(db.Float)
    cloud_risk_score = db.Column(db.Float)
    compliance_risk_score = db.Column(db.Float)
    data_breach_risk_score = db.Column(db.Float)
    third_party_risk_score = db.Column(db.Float)
    assessment_date = db.Column(db.DateTime, default=datetime.utcnow)
    risk_level = db.Column(db.String(20))  # Low, Medium, High, Critical
    recommendations = db.Column(db.JSON)

class DataBreach(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'), nullable=False)
    breach_date = db.Column(db.Date)
    breach_type = db.Column(db.String(100))
    records_affected = db.Column(db.Integer)
    severity = db.Column(db.String(20))  # Low, Medium, High, Critical
    description = db.Column(db.Text)
    resolution_status = db.Column(db.String(50))

class ThreatIntel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'), nullable=False)
    threat_type = db.Column(db.String(100))
    severity = db.Column(db.String(20))
    description = db.Column(db.Text)
    detection_date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50))  # Active, Resolved, False Positive

class Vendor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(200), nullable=False)
    contact_name = db.Column(db.String(100), nullable=False)
    contact_email = db.Column(db.String(100), nullable=False)
    contact_phone = db.Column(db.String(20))
    website = db.Column(db.String(200))
    industry = db.Column(db.String(100), nullable=False)
    employee_count = db.Column(db.String(50), nullable=False)
    annual_revenue = db.Column(db.String(50))
    data_processed = db.Column(db.JSON)  # Array of data types
    compliance_frameworks = db.Column(db.JSON)  # Array of frameworks
    security_certifications = db.Column(db.JSON)  # Array of certifications
    risk_level = db.Column(db.String(20), default='Medium')  # Low, Medium, High, Critical
    description = db.Column(db.Text)
    osint_data = db.Column(db.JSON)  # OSINT analysis results
    risk_score = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class SecurityAlert(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendor.id'), nullable=False)
    alert_type = db.Column(db.String(100), nullable=False)  # OSINT, Compliance, Threat, etc.
    severity = db.Column(db.String(20), nullable=False)  # Low, Medium, High, Critical
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    details = db.Column(db.JSON)  # Additional alert data
    status = db.Column(db.String(20), default='Active')  # Active, Acknowledged, Resolved
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    resolved_at = db.Column(db.DateTime)
    
    # Relationship
    vendor = db.relationship('Vendor', backref='alerts')

class MonitoringEvent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendor.id'), nullable=False)
    event_type = db.Column(db.String(100), nullable=False)  # SSL_Expiry, Domain_Change, etc.
    event_data = db.Column(db.JSON, nullable=False)
    severity = db.Column(db.String(20), default='Low')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship
    vendor = db.relationship('Vendor', backref='monitoring_events')

class Client(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(200), nullable=False, unique=True)
    sector = db.Column(db.String(100), nullable=False)
    country = db.Column(db.String(100), nullable=False)
    continent = db.Column(db.String(50), nullable=False)
    region = db.Column(db.String(50), nullable=False)
    domain = db.Column(db.String(200), nullable=False)
    third_party_vendors = db.Column(db.JSON)
    compliance_standards = db.Column(db.JSON)
    known_data_breaches = db.Column(db.Text)
    last_audit_date = db.Column(db.Date)
    employee_count = db.Column(db.Integer)
    annual_revenue = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    employee_contacts = db.relationship('EmployeeContact', backref='client', lazy=True, cascade='all, delete-orphan')
    security_posture = db.relationship('SecurityPosture', backref='client', lazy=True, uselist=False, cascade='all, delete-orphan')
    risk_assessments = db.relationship('RiskAssessment', backref='client', lazy=True, cascade='all, delete-orphan')
    data_breaches = db.relationship('DataBreach', backref='client', lazy=True, cascade='all, delete-orphan')
    threat_intel = db.relationship('ThreatIntel', backref='client', lazy=True, cascade='all, delete-orphan')

# Risk Scoring Algorithm
class RiskCalculator:
    @staticmethod
    def calculate_network_risk(security_tools, gaps):
        base_score = 50
        tool_bonus = len(security_tools) * 5
        gap_penalty = len(gaps.split(',')) * 10 if gaps else 0
        return max(0, min(100, base_score - tool_bonus + gap_penalty))
    
    @staticmethod
    def calculate_compliance_risk(standards, last_audit):
        base_score = 30
        if not standards:
            return 80
        if last_audit:
            days_since_audit = (datetime.now().date() - last_audit).days
            if days_since_audit > 365:
                base_score += 20
        return max(0, min(100, base_score))
    
    @staticmethod
    def calculate_breach_risk(breaches):
        if not breaches or breaches == "None reported":
            return 20
        return 70
    
    @staticmethod
    def calculate_overall_risk(scores):
        weights = {
            'network_risk_score': 0.25,
            'endpoint_risk_score': 0.20,
            'cloud_risk_score': 0.15,
            'compliance_risk_score': 0.20,
            'data_breach_risk_score': 0.20
        }
        total_score = sum(scores[key] * weights[key] for key in weights)
        return round(total_score, 2)
    
    @staticmethod
    def get_risk_level(score):
        if score < 30:
            return "Low"
        elif score < 60:
            return "Medium"
        elif score < 80:
            return "High"
        else:
            return "Critical"

class AdvancedRiskCalculator:
    """Advanced risk assessment with ML-like features and behavioral analysis"""
    
    @staticmethod
    def calculate_behavioral_risk(vendor_data):
        """Calculate behavioral risk based on vendor patterns"""
        risk_factors = []
        score = 50
        
        # Company size analysis
        if vendor_data.get('employee_count') in ['1-10', '11-50']:
            risk_factors.append('Small company with limited resources')
            score += 15
        
        # Industry risk analysis
        high_risk_industries = ['Financial Services', 'Healthcare', 'Technology']
        if vendor_data.get('industry') in high_risk_industries:
            risk_factors.append('High-value target industry')
            score += 10
        
        # Data sensitivity analysis
        sensitive_data_types = ['Personal Information', 'Financial Data', 'Health Records']
        if vendor_data.get('data_processed'):
            sensitive_count = sum(1 for data_type in vendor_data['data_processed'] 
                                if data_type in sensitive_data_types)
            if sensitive_count > 0:
                risk_factors.append(f'Processes {sensitive_count} types of sensitive data')
                score += sensitive_count * 8
        
        # Compliance maturity
        if not vendor_data.get('compliance_frameworks') or 'None' in vendor_data.get('compliance_frameworks', []):
            risk_factors.append('No formal compliance frameworks')
            score += 20
        
        # Geographic risk (simulated)
        if vendor_data.get('country') in ['Russia', 'China', 'North Korea']:
            risk_factors.append('High-risk geographic location')
            score += 25
        
        return {
            'score': min(100, max(0, score)),
            'risk_factors': risk_factors,
            'risk_level': RiskCalculator.get_risk_level(score)
        }
    
    @staticmethod
    def calculate_geopolitical_risk(vendor_data):
        """Calculate geopolitical risk factors"""
        risk_factors = []
        score = 30
        
        # Country risk mapping (simplified)
        country_risk_scores = {
            'United States': 20,
            'Canada': 25,
            'United Kingdom': 30,
            'Germany': 35,
            'France': 35,
            'Japan': 30,
            'Australia': 25,
            'India': 50,
            'China': 70,
            'Russia': 80,
            'Brazil': 45,
            'Mexico': 55
        }
        
        country = vendor_data.get('country', 'Unknown')
        if country in country_risk_scores:
            score += country_risk_scores[country]
            if country_risk_scores[country] > 60:
                risk_factors.append(f'High-risk country: {country}')
        
        # Regional instability factors
        unstable_regions = ['Middle East', 'Eastern Europe', 'Southeast Asia']
        if vendor_data.get('region') in unstable_regions:
            risk_factors.append('Region with geopolitical instability')
            score += 15
        
        return {
            'score': min(100, max(0, score)),
            'risk_factors': risk_factors,
            'risk_level': RiskCalculator.get_risk_level(score)
        }
    
    @staticmethod
    def calculate_supply_chain_risk(vendor_data, vendor_history=None):
        """Calculate supply chain dependency risk"""
        risk_factors = []
        score = 40
        
        # Dependency analysis
        if vendor_data.get('industry') in ['Manufacturing', 'Technology']:
            risk_factors.append('Critical supply chain dependency')
            score += 20
        
        # Single source risk
        if vendor_history and len(vendor_history) < 2:
            risk_factors.append('Limited vendor alternatives')
            score += 15
        
        # Financial stability indicators
        if vendor_data.get('annual_revenue') in ['$1M-$10M', 'Less than $1M']:
            risk_factors.append('Small company financial risk')
            score += 10
        
        return {
            'score': min(100, max(0, score)),
            'risk_factors': risk_factors,
            'risk_level': RiskCalculator.get_risk_level(score)
        }
    
    @staticmethod
    def calculate_ml_enhanced_risk(vendor_data, osint_data=None):
        """ML-enhanced risk calculation using multiple factors"""
        features = []
        
        # Feature engineering
        features.append(1 if vendor_data.get('employee_count') in ['1-10', '11-50'] else 0)  # Small company
        features.append(1 if vendor_data.get('industry') in ['Financial Services', 'Healthcare'] else 0)  # High-value
        features.append(len(vendor_data.get('data_processed', [])))  # Data types count
        features.append(1 if not vendor_data.get('compliance_frameworks') else 0)  # No compliance
        features.append(1 if osint_data and osint_data.get('dark_web_exposure', {}).get('exposed', False) else 0)  # Dark web
        
        # Simple ML-like scoring (in real implementation, use actual ML model)
        weights = [0.25, 0.20, 0.15, 0.25, 0.15]
        ml_score = sum(f * w for f, w in zip(features, weights)) * 100
        
        # Add noise for realistic variation
        import random
        ml_score += random.uniform(-5, 5)
        
        return {
            'score': min(100, max(0, ml_score)),
            'features': features,
            'confidence': random.uniform(0.7, 0.95),
            'risk_level': RiskCalculator.get_risk_level(ml_score)
        }
    
    @staticmethod
    def generate_risk_recommendations(risk_analysis):
        """Generate AI-powered risk recommendations"""
        recommendations = []
        
        if risk_analysis.get('behavioral_risk', {}).get('score', 0) > 60:
            recommendations.append({
                'category': 'Behavioral Risk',
                'priority': 'High',
                'recommendation': 'Implement additional monitoring and controls for this vendor',
                'action_items': [
                    'Conduct quarterly security assessments',
                    'Implement real-time monitoring',
                    'Require additional security certifications'
                ]
            })
        
        if risk_analysis.get('geopolitical_risk', {}).get('score', 0) > 70:
            recommendations.append({
                'category': 'Geopolitical Risk',
                'priority': 'Critical',
                'recommendation': 'Consider vendor diversification due to geopolitical risks',
                'action_items': [
                    'Identify alternative vendors in lower-risk regions',
                    'Implement enhanced due diligence',
                    'Monitor geopolitical developments'
                ]
            })
        
        if risk_analysis.get('supply_chain_risk', {}).get('score', 0) > 50:
            recommendations.append({
                'category': 'Supply Chain Risk',
                'priority': 'Medium',
                'recommendation': 'Develop contingency plans for supply chain disruption',
                'action_items': [
                    'Identify backup vendors',
                    'Increase inventory levels',
                    'Diversify supply chain sources'
                ]
            })
        
        return recommendations

# Mock Data Generator
class MockDataGenerator:
    @staticmethod
    def generate_mock_clients():
        companies = [
            {
                "company_name": "Deep Health Inc",
                "sector": "Healthcare, Pharmaceuticals, Biotechnology",
                "country": "India",
                "continent": "Asia",
                "region": "APAC",
                "domain": "deephealthinc.com",
                "employee_count": 2500,
                "annual_revenue": "$100M-$500M"
            },
            {
                "company_name": "Pharmexis BioTech Pvt Ltd",
                "sector": "Pharmaceuticals",
                "country": "India",
                "continent": "Asia",
                "region": "APAC",
                "domain": "pharmexisbio.com",
                "employee_count": 2500,
                "annual_revenue": "$50M-$100M"
            },
            {
                "company_name": "TechFlow Solutions Inc",
                "sector": "Technology",
                "country": "United States",
                "continent": "North America",
                "region": "NA",
                "domain": "techflow.com",
                "employee_count": 1200,
                "annual_revenue": "$25M-$50M"
            },
            {
                "company_name": "GlobalBank Financial Services",
                "sector": "Financial Services",
                "country": "United Kingdom",
                "continent": "Europe",
                "region": "EMEA",
                "domain": "globalbank.co.uk",
                "employee_count": 5000,
                "annual_revenue": "$100M-$500M"
            },
            {
                "company_name": "SecureNet Cybersecurity",
                "sector": "Cybersecurity",
                "country": "Canada",
                "continent": "North America",
                "region": "NA",
                "domain": "securenet.ca",
                "employee_count": 800,
                "annual_revenue": "$10M-$25M"
            },
            {
                "company_name": "DataVault Cloud Solutions",
                "sector": "Cloud Services",
                "country": "Australia",
                "continent": "Oceania",
                "region": "APAC",
                "domain": "datavault.au",
                "employee_count": 1500,
                "annual_revenue": "$25M-$50M"
            }
        ]
        
        for company in companies:
            # Check if client already exists
            existing = Client.query.filter_by(company_name=company["company_name"]).first()
            if not existing:
                client = Client(**company)
                
                # Add third-party vendors for Deep Health Inc
                if company["company_name"] == "Deep Health Inc":
                    client.third_party_vendors = [
                        "Microsoft Corporation",
                        "Cisco Systems Inc",
                        "Amazon Web Services",
                        "Oracle Corporation", 
                        "Salesforce Inc",
                        "Adobe Systems Inc",
                        "VMware Inc",
                        "Dell Technologies",
                        "Intel Corporation",
                        "IBM Corporation"
                    ]
                
                # Add employee contacts
                contacts = [
                    {"name": "Dr. Rajesh Kumar", "email": "rajesh.kumar@" + company["domain"], "role": "CSO"},
                    {"name": "Priya Sharma", "email": "priya.sharma@" + company["domain"], "role": "Security Lead"},
                    {"name": "Amit Patel", "email": "amit.patel@" + company["domain"], "role": "IT Security Analyst"}
                ]
                
                for contact_data in contacts:
                    contact = EmployeeContact(**contact_data)
                    client.employee_contacts.append(contact)
                
                # Add security posture
                security_tools = {
                    "network_security": ["Palo Alto Networks", "Cisco ASA", "Fortinet"],
                    "endpoint_security": ["CrowdStrike Falcon", "SentinelOne", "Carbon Black"],
                    "iam": ["Azure AD", "Okta", "OneLogin"],
                    "cloud_security": ["AWS Security Hub", "Azure Security Center", "Google Cloud Security"],
                    "compliance_tools": ["Vanta", "Drata", "Secureframe"],
                    "vulnerability_management": ["Qualys", "Rapid7", "Tenable"],
                    "email_security": ["Proofpoint", "Mimecast", "Barracuda"],
                    "backup_recovery": ["Veeam", "Commvault", "Rubrik"],
                    "gaps_or_remarks": "DLP solution needed, MFA not fully implemented, HIPAA compliance gaps identified"
                }
                
                security_posture = SecurityPosture(**security_tools)
                client.security_posture = security_posture
                
                # Add risk assessment
                risk_scores = {
                    "network_risk_score": RiskCalculator.calculate_network_risk(
                        security_tools["network_security"], 
                        security_tools["gaps_or_remarks"]
                    ),
                    "endpoint_risk_score": 35,
                    "cloud_risk_score": 25,
                    "compliance_risk_score": RiskCalculator.calculate_compliance_risk(
                        ["ISO 27001", "SOC 2"], 
                        datetime.now().date() - timedelta(days=180)
                    ),
                    "data_breach_risk_score": RiskCalculator.calculate_breach_risk("None reported"),
                    "third_party_risk_score": 40
                }
                
                risk_scores["overall_risk_score"] = RiskCalculator.calculate_overall_risk(risk_scores)
                risk_scores["risk_level"] = RiskCalculator.get_risk_level(risk_scores["overall_risk_score"])
                
                # Add healthcare-specific recommendations for Deep Health Inc
                if company["company_name"] == "Deep Health Inc":
                    risk_scores["recommendations"] = [
                        "Implement HIPAA-compliant DLP solution",
                        "Enable MFA for all users accessing PHI",
                        "Conduct quarterly security assessments",
                        "Update incident response plan for healthcare data breaches",
                        "Implement data encryption at rest and in transit",
                        "Establish audit trails for all PHI access",
                        "Train staff on HIPAA compliance requirements"
                    ]
                    client.compliance_standards = ["HIPAA", "HITECH", "ISO 27001", "SOC 2", "GDPR"]
                else:
                    risk_scores["recommendations"] = [
                        "Implement DLP solution",
                        "Enable MFA for all users",
                        "Conduct quarterly security assessments",
                        "Update incident response plan"
                    ]
                
                risk_assessment = RiskAssessment(**risk_scores)
                client.risk_assessments.append(risk_assessment)
                
                # Add mock data breaches
                if random.random() < 0.3:  # 30% chance of having a breach
                    breach = DataBreach(
                        breach_date=datetime.now().date() - timedelta(days=random.randint(30, 365)),
                        breach_type="Phishing Attack",
                        records_affected=random.randint(100, 10000),
                        severity="Medium",
                        description="Employee fell victim to phishing attack, credentials compromised",
                        resolution_status="Resolved"
                    )
                    client.data_breaches.append(breach)
                
                # Add threat intelligence
                if company["company_name"] == "Deep Health Inc":
                    threats = [
                        {"threat_type": "Healthcare Ransomware", "severity": "High", "description": "Active ransomware campaign specifically targeting pharmaceutical companies"},
                        {"threat_type": "APT Group - Lazarus", "severity": "High", "description": "Suspicious activity from North Korean APT group targeting healthcare data"},
                        {"threat_type": "Insider Threat", "severity": "Medium", "description": "Unusual access patterns to clinical trial data detected"},
                        {"threat_type": "Data Exfiltration", "severity": "Medium", "description": "Potential unauthorized access to patient health records"},
                        {"threat_type": "Supply Chain Attack", "severity": "Low", "description": "Suspicious activity in third-party vendor systems"}
                    ]
                else:
                    threats = [
                        {"threat_type": "Ransomware", "severity": "High", "description": "Active ransomware campaign targeting healthcare sector"},
                        {"threat_type": "APT Group", "severity": "Medium", "description": "Suspicious activity from known APT group"},
                        {"threat_type": "Insider Threat", "severity": "Low", "description": "Unusual data access patterns detected"}
                    ]
                
                for threat_data in threats:
                    threat = ThreatIntel(**threat_data)
                    client.threat_intel.append(threat)
                
                db.session.add(client)
        
        db.session.commit()
        return len(companies)

    @staticmethod
    def generate_mock_vendors():
        """Generate realistic vendor data for testing"""
        vendors_data = [
            {
                "company_name": "SecureNet Technologies",
                "contact_name": "Sarah Johnson",
                "contact_email": "sarah.johnson@securenet-tech.com",
                "contact_phone": "+1 (555) 123-4567",
                "website": "https://securenet-tech.com",
                "industry": "Technology",
                "employee_count": "51-200",
                "annual_revenue": "$25M-$50M",
                "data_processed": ["Personal Information", "Financial Data", "System Logs"],
                "compliance_frameworks": ["ISO 27001", "SOC 2", "PCI DSS"],
                "security_certifications": ["CISSP", "CISM"],
                "risk_level": "Low",
                "description": "Leading cybersecurity solutions provider with strong compliance posture."
            },
            {
                "company_name": "DataVault Cloud Solutions",
                "contact_name": "Michael Chen",
                "contact_email": "mchen@datavault-cloud.net",
                "contact_phone": "+1 (555) 234-5678",
                "website": "https://datavault-cloud.net",
                "industry": "Technology",
                "employee_count": "201-1000",
                "annual_revenue": "$50M-$100M",
                "data_processed": ["Personal Information", "Health Records", "Intellectual Property"],
                "compliance_frameworks": ["HIPAA", "FedRAMP", "ISO 27001"],
                "security_certifications": ["CCSP", "CISA"],
                "risk_level": "Medium",
                "description": "Cloud infrastructure provider specializing in healthcare and government sectors."
            },
            {
                "company_name": "GlobalBank Financial Services",
                "contact_name": "Robert Williams",
                "contact_email": "r.williams@globalbank-financial.co.uk",
                "contact_phone": "+44 20 7123 4567",
                "website": "https://globalbank-financial.co.uk",
                "industry": "Financial Services",
                "employee_count": "1001-5000",
                "annual_revenue": "$100M-$500M",
                "data_processed": ["Financial Data", "Personal Information", "Trade Secrets"],
                "compliance_frameworks": ["SOX", "PCI DSS", "GDPR"],
                "security_certifications": ["CRISC", "CISM"],
                "risk_level": "High",
                "description": "International banking services with complex regulatory requirements."
            },
            {
                "company_name": "MediTech Healthcare Solutions",
                "contact_name": "Dr. Emily Rodriguez",
                "contact_email": "erodriguez@meditech-healthcare.org",
                "contact_phone": "+1 (555) 345-6789",
                "website": "https://meditech-healthcare.org",
                "industry": "Healthcare",
                "employee_count": "51-200",
                "annual_revenue": "$10M-$25M",
                "data_processed": ["Health Records", "Personal Information", "Employee Data"],
                "compliance_frameworks": ["HIPAA", "HITECH"],
                "security_certifications": ["Security+"],
                "risk_level": "Medium",
                "description": "Healthcare technology provider with focus on patient data security."
            },
            {
                "company_name": "TechFlow Solutions Inc.",
                "contact_name": "David Kim",
                "contact_email": "david.kim@techflow-solutions.com",
                "contact_phone": "+1 (555) 456-7890",
                "website": "https://techflow-solutions.com",
                "industry": "Technology",
                "employee_count": "11-50",
                "annual_revenue": "$1M-$10M",
                "data_processed": ["Personal Information", "Customer Data"],
                "compliance_frameworks": ["None"],
                "security_certifications": ["None"],
                "risk_level": "High",
                "description": "Startup software development company with limited security resources."
            },
            {
                "company_name": "Manufacturing Dynamics Ltd",
                "contact_name": "Lisa Thompson",
                "contact_email": "lisa.thompson@manufacturing-dynamics.ca",
                "contact_phone": "+1 (555) 567-8901",
                "website": "https://manufacturing-dynamics.ca",
                "industry": "Manufacturing",
                "employee_count": "201-1000",
                "annual_revenue": "$25M-$50M",
                "data_processed": ["Trade Secrets", "Intellectual Property", "Employee Data"],
                "compliance_frameworks": ["ISO 9001", "ISO 27001"],
                "security_certifications": ["CISSP"],
                "risk_level": "Medium",
                "description": "Manufacturing company with proprietary technology and trade secrets."
            },
            {
                "company_name": "RetailTech Innovations",
                "contact_name": "Alex Morgan",
                "contact_email": "alex.morgan@retailtech-innovations.com",
                "contact_phone": "+1 (555) 678-9012",
                "website": "https://retailtech-innovations.com",
                "industry": "Retail",
                "employee_count": "51-200",
                "annual_revenue": "$10M-$25M",
                "data_processed": ["Customer Data", "Financial Data", "Personal Information"],
                "compliance_frameworks": ["PCI DSS"],
                "security_certifications": ["Security+"],
                "risk_level": "Medium",
                "description": "Retail technology provider handling customer payment data."
            },
            {
                "company_name": "EduTech Learning Systems",
                "contact_name": "Jennifer Park",
                "contact_email": "jennifer.park@edutech-learning.edu",
                "contact_phone": "+1 (555) 789-0123",
                "website": "https://edutech-learning.edu",
                "industry": "Education",
                "employee_count": "11-50",
                "annual_revenue": "$1M-$10M",
                "data_processed": ["Personal Information", "Student Data"],
                "compliance_frameworks": ["FERPA"],
                "security_certifications": ["None"],
                "risk_level": "Low",
                "description": "Educational technology provider with student data protection focus."
            }
        ]
        
        count = 0
        for vendor_data in vendors_data:
            try:
                # Check if vendor already exists
                existing_vendor = Vendor.query.filter_by(company_name=vendor_data["company_name"]).first()
                if not existing_vendor:
                    vendor = Vendor(**vendor_data)
                    db.session.add(vendor)
                    count += 1
            except Exception as e:
                print(f"Error creating vendor {vendor_data['company_name']}: {e}")
                continue
        
        try:
            db.session.commit()
            print(f"Generated {count} mock vendors successfully")
        except Exception as e:
            db.session.rollback()
            print(f"Error committing vendors: {e}")
        
        return count

# Marshmallow Schemas
class EmployeeContactSchema(Schema):
    name = fields.Str(required=True, validate=lambda x: len(x) <= 100)
    email = fields.Email(required=True)
    role = fields.Str(required=True, validate=lambda x: len(x) <= 50)

class SecurityPostureSchema(Schema):
    network_security = fields.List(fields.Str())
    endpoint_security = fields.List(fields.Str())
    iam = fields.List(fields.Str())
    cloud_security = fields.List(fields.Str())
    compliance_tools = fields.List(fields.Str())
    vulnerability_management = fields.List(fields.Str())
    email_security = fields.List(fields.Str())
    backup_recovery = fields.List(fields.Str())
    gaps_or_remarks = fields.Str()

class VendorSchema(Schema):
    company_name = fields.Str(required=True, validate=lambda x: len(x) <= 200)
    contact_name = fields.Str(required=True, validate=lambda x: len(x) <= 100)
    contact_email = fields.Email(required=True)
    contact_phone = fields.Str(validate=lambda x: len(x) <= 20)
    website = fields.Str(validate=lambda x: len(x) <= 200)
    industry = fields.Str(required=True, validate=lambda x: len(x) <= 100)
    employee_count = fields.Str(required=True, validate=lambda x: len(x) <= 50)
    annual_revenue = fields.Str(validate=lambda x: len(x) <= 50)
    data_processed = fields.List(fields.Str())
    compliance_frameworks = fields.List(fields.Str())
    security_certifications = fields.List(fields.Str())
    risk_level = fields.Str(validate=lambda x: x in ['Low', 'Medium', 'High', 'Critical'])
    description = fields.Str()

class ClientSchema(Schema):
    company_name = fields.Str(required=True, validate=lambda x: len(x) <= 200)
    sector = fields.Str(required=True, validate=lambda x: len(x) <= 100)
    country = fields.Str(required=True, validate=lambda x: len(x) <= 100)
    continent = fields.Str(required=True, validate=lambda x: len(x) <= 50)
    region = fields.Str(required=True, validate=lambda x: len(x) <= 50)
    domain = fields.Str(required=True, validate=lambda x: len(x) <= 200)
    third_party_vendors = fields.List(fields.Str())
    security_posture = fields.Nested(SecurityPostureSchema, required=True)
    employee_contacts = fields.List(fields.Nested(EmployeeContactSchema), required=True)
    compliance_standards = fields.List(fields.Str())
    known_data_breaches = fields.Str()
    last_audit_date = fields.Date()
    employee_count = fields.Int()
    annual_revenue = fields.Str()

# Initialize schemas
client_schema = ClientSchema()
employee_contact_schema = EmployeeContactSchema()
security_posture_schema = SecurityPostureSchema()

# API Endpoints
@app.route('/api/clients', methods=['POST'])
def create_client():
    """Create a new client with comprehensive security and contact information"""
    try:
        data = client_schema.load(request.json)
        
        existing_client = Client.query.filter_by(company_name=data['company_name']).first()
        if existing_client:
            return jsonify({'error': 'Client with this company name already exists'}), 400
        
        client = Client(
            company_name=data['company_name'],
            sector=data['sector'],
            country=data['country'],
            continent=data['continent'],
            region=data['region'],
            domain=data['domain'],
            third_party_vendors=data.get('third_party_vendors', []),
            compliance_standards=data.get('compliance_standards', []),
            known_data_breaches=data.get('known_data_breaches'),
            last_audit_date=data.get('last_audit_date'),
            employee_count=data.get('employee_count'),
            annual_revenue=data.get('annual_revenue')
        )
        
        # Add employee contacts
        for contact_data in data['employee_contacts']:
            contact = EmployeeContact(**contact_data)
            client.employee_contacts.append(contact)
        
        # Add security posture
        security_data = data['security_posture']
        security_posture = SecurityPosture(**security_data)
        client.security_posture = security_posture
        
        # Calculate and add risk assessment
        risk_scores = {
            "network_risk_score": RiskCalculator.calculate_network_risk(
                security_data.get('network_security', []), 
                security_data.get('gaps_or_remarks', '')
            ),
            "endpoint_risk_score": 35,
            "cloud_risk_score": 25,
            "compliance_risk_score": RiskCalculator.calculate_compliance_risk(
                data.get('compliance_standards', []), 
                data.get('last_audit_date')
            ),
            "data_breach_risk_score": RiskCalculator.calculate_breach_risk(data.get('known_data_breaches')),
            "third_party_risk_score": 40
        }
        
        risk_scores["overall_risk_score"] = RiskCalculator.calculate_overall_risk(risk_scores)
        risk_scores["risk_level"] = RiskCalculator.get_risk_level(risk_scores["overall_risk_score"])
        risk_scores["recommendations"] = [
            "Implement comprehensive security monitoring",
            "Conduct regular security assessments",
            "Update incident response procedures",
            "Enhance employee security training"
        ]
        
        risk_assessment = RiskAssessment(**risk_scores)
        client.risk_assessments.append(risk_assessment)
        
        db.session.add(client)
        db.session.commit()
        
        return jsonify({
            'message': 'Client created successfully',
            'client_id': client.id,
            'company_name': client.company_name,
            'risk_score': risk_scores["overall_risk_score"],
            'risk_level': risk_scores["risk_level"]
        }), 201
        
    except ValidationError as e:
        return jsonify({'error': 'Validation error', 'details': e.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@app.route('/api/clients', methods=['GET'])
def get_clients():
    """Get all clients with basic information and risk scores"""
    try:
        clients = Client.query.all()
        client_list = []
        
        for client in clients:
            latest_risk = client.risk_assessments[-1] if client.risk_assessments else None
            
            client_data = {
                'id': client.id,
                'company_name': client.company_name,
                'sector': client.sector,
                'country': client.country,
                'domain': client.domain,
                'employee_count': client.employee_count,
                'annual_revenue': client.annual_revenue,
                'created_at': client.created_at.isoformat() if client.created_at else None,
                'employee_count_contacts': len(client.employee_contacts),
                'risk_score': latest_risk.overall_risk_score if latest_risk else None,
                'risk_level': latest_risk.risk_level if latest_risk else None,
                'last_assessment': latest_risk.assessment_date.isoformat() if latest_risk else None
            }
            client_list.append(client_data)
        
        return jsonify({
            'clients': client_list,
            'total': len(client_list)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@app.route('/api/clients/<int:client_id>', methods=['GET'])
def get_client(client_id):
    """Get detailed information for a specific client"""
    try:
        client = Client.query.get_or_404(client_id)
        latest_risk = client.risk_assessments[-1] if client.risk_assessments else None
        
        client_data = {
            'id': client.id,
            'company_name': client.company_name,
            'sector': client.sector,
            'country': client.country,
            'continent': client.continent,
            'region': client.region,
            'domain': client.domain,
            'employee_count': client.employee_count,
            'annual_revenue': client.annual_revenue,
            'third_party_vendors': client.third_party_vendors,
            'compliance_standards': client.compliance_standards,
            'known_data_breaches': client.known_data_breaches,
            'last_audit_date': client.last_audit_date.isoformat() if client.last_audit_date else None,
            'created_at': client.created_at.isoformat() if client.created_at else None,
            'updated_at': client.updated_at.isoformat() if client.updated_at else None,
            'employee_contacts': [
                {
                    'name': contact.name,
                    'email': contact.email,
                    'role': contact.role
                } for contact in client.employee_contacts
            ],
            'security_posture': {
                'network_security': client.security_posture.network_security if client.security_posture else [],
                'endpoint_security': client.security_posture.endpoint_security if client.security_posture else [],
                'iam': client.security_posture.iam if client.security_posture else [],
                'cloud_security': client.security_posture.cloud_security if client.security_posture else [],
                'compliance_tools': client.security_posture.compliance_tools if client.security_posture else [],
                'vulnerability_management': client.security_posture.vulnerability_management if client.security_posture else [],
                'email_security': client.security_posture.email_security if client.security_posture else [],
                'backup_recovery': client.security_posture.backup_recovery if client.security_posture else [],
                'gaps_or_remarks': client.security_posture.gaps_or_remarks if client.security_posture else None
            } if client.security_posture else {},
            'risk_assessment': {
                'overall_risk_score': latest_risk.overall_risk_score if latest_risk else None,
                'network_risk_score': latest_risk.network_risk_score if latest_risk else None,
                'endpoint_risk_score': latest_risk.endpoint_risk_score if latest_risk else None,
                'cloud_risk_score': latest_risk.cloud_risk_score if latest_risk else None,
                'compliance_risk_score': latest_risk.compliance_risk_score if latest_risk else None,
                'data_breach_risk_score': latest_risk.data_breach_risk_score if latest_risk else None,
                'third_party_risk_score': latest_risk.third_party_risk_score if latest_risk else None,
                'risk_level': latest_risk.risk_level if latest_risk else None,
                'assessment_date': latest_risk.assessment_date.isoformat() if latest_risk else None,
                'recommendations': latest_risk.recommendations if latest_risk else []
            } if latest_risk else {},
            'data_breaches': [
                {
                    'breach_date': breach.breach_date.isoformat() if breach.breach_date else None,
                    'breach_type': breach.breach_type,
                    'records_affected': breach.records_affected,
                    'severity': breach.severity,
                    'description': breach.description,
                    'resolution_status': breach.resolution_status
                } for breach in client.data_breaches
            ],
            'threat_intel': [
                {
                    'threat_type': threat.threat_type,
                    'severity': threat.severity,
                    'description': threat.description,
                    'detection_date': threat.detection_date.isoformat() if threat.detection_date else None,
                    'status': threat.status
                } for threat in client.threat_intel
            ]
        }
        
        return jsonify(client_data), 200
        
    except Exception as e:
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    """Get dashboard statistics"""
    try:
        total_clients = Client.query.count()
        clients = Client.query.all()
        
        risk_levels = {'Low': 0, 'Medium': 0, 'High': 0, 'Critical': 0}
        sectors = {}
        total_breaches = 0
        total_threats = 0
        
        for client in clients:
            if client.risk_assessments:
                risk_level = client.risk_assessments[-1].risk_level
                risk_levels[risk_level] += 1
            
            sector = client.sector
            sectors[sector] = sectors.get(sector, 0) + 1
            
            total_breaches += len(client.data_breaches)
            total_threats += len(client.threat_intel)
        
        avg_risk_score = sum(
            client.risk_assessments[-1].overall_risk_score 
            for client in clients 
            if client.risk_assessments
        ) / len([c for c in clients if c.risk_assessments]) if clients else 0
        
        return jsonify({
            'total_clients': total_clients,
            'average_risk_score': round(avg_risk_score, 2),
            'risk_distribution': risk_levels,
            'sector_distribution': sectors,
            'total_data_breaches': total_breaches,
            'active_threats': total_threats,
            'high_risk_clients': risk_levels['High'] + risk_levels['Critical']
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@app.route('/api/risk-analysis', methods=['GET'])
def get_risk_analysis():
    """Get comprehensive risk analysis across all clients"""
    try:
        clients = Client.query.all()
        analysis = {
            'overall_risk_trends': [],
            'sector_risk_comparison': {},
            'top_risks': [],
            'security_gaps': {},
            'compliance_status': {}
        }
        
        sector_risks = {}
        all_gaps = []
        
        for client in clients:
            if client.risk_assessments:
                risk = client.risk_assessments[-1]
                
                # Sector risk analysis
                if client.sector not in sector_risks:
                    sector_risks[client.sector] = []
                sector_risks[client.sector].append(risk.overall_risk_score)
                
                # Security gaps analysis
                if client.security_posture and client.security_posture.gaps_or_remarks:
                    all_gaps.append(client.security_posture.gaps_or_remarks)
        
        # Calculate sector averages
        for sector, scores in sector_risks.items():
            analysis['sector_risk_comparison'][sector] = round(sum(scores) / len(scores), 2)
        
        # Top risks
        analysis['top_risks'] = [
            "Insufficient DLP implementation",
            "MFA not fully deployed",
            "Outdated security tools",
            "Inadequate incident response procedures",
            "Limited security awareness training"
        ]
        
        # Security gaps summary
        gap_counts = {}
        for gap in all_gaps:
            if 'DLP' in gap:
                gap_counts['DLP'] = gap_counts.get('DLP', 0) + 1
            if 'MFA' in gap:
                gap_counts['MFA'] = gap_counts.get('MFA', 0) + 1
            if 'monitoring' in gap.lower():
                gap_counts['Security Monitoring'] = gap_counts.get('Security Monitoring', 0) + 1
        
        analysis['security_gaps'] = gap_counts
        
        return jsonify(analysis), 200
        
    except Exception as e:
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@app.route('/api/mock-data', methods=['POST'])
def generate_mock_data():
    """Generate mock data for testing"""
    try:
        clients_count = MockDataGenerator.generate_mock_clients()
        vendors_count = MockDataGenerator.generate_mock_vendors()
        return jsonify({
            'message': f'Generated {clients_count} mock clients and {vendors_count} mock vendors successfully',
            'clients_created': clients_count,
            'vendors_created': vendors_count
        }), 201
    except Exception as e:
        return jsonify({'error': 'Failed to generate mock data', 'details': str(e)}), 500

@app.route('/api/clients/<int:client_id>/reassess', methods=['POST'])
def reassess_client_risk(client_id):
    """Reassess risk for a specific client"""
    try:
        client = Client.query.get_or_404(client_id)
        
        # Calculate new risk scores
        security_posture = client.security_posture
        risk_scores = {
            "network_risk_score": RiskCalculator.calculate_network_risk(
                security_posture.network_security if security_posture else [], 
                security_posture.gaps_or_remarks if security_posture else ''
            ),
            "endpoint_risk_score": 35,
            "cloud_risk_score": 25,
            "compliance_risk_score": RiskCalculator.calculate_compliance_risk(
                client.compliance_standards, 
                client.last_audit_date
            ),
            "data_breach_risk_score": RiskCalculator.calculate_breach_risk(client.known_data_breaches),
            "third_party_risk_score": 40
        }
        
        risk_scores["overall_risk_score"] = RiskCalculator.calculate_overall_risk(risk_scores)
        risk_scores["risk_level"] = RiskCalculator.get_risk_level(risk_scores["overall_risk_score"])
        risk_scores["recommendations"] = [
            "Implement comprehensive security monitoring",
            "Conduct regular security assessments",
            "Update incident response procedures",
            "Enhance employee security training"
        ]
        
        risk_assessment = RiskAssessment(client_id=client_id, **risk_scores)
        db.session.add(risk_assessment)
        db.session.commit()
        
        return jsonify({
            'message': 'Risk reassessment completed',
            'new_risk_score': risk_scores["overall_risk_score"],
            'new_risk_level': risk_scores["risk_level"],
            'assessment_date': risk_assessment.assessment_date.isoformat()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@app.route('/api/vendors', methods=['POST'])
def create_vendor():
    """Create a new vendor"""
    try:
        data = request.get_json()
        schema = VendorSchema()
        validated_data = schema.load(data)
        
        vendor = Vendor(**validated_data)
        db.session.add(vendor)
        db.session.commit()
        
        return jsonify({
            'message': 'Vendor created successfully',
            'vendor_id': vendor.id,
            'vendor': {
                'id': vendor.id,
                'company_name': vendor.company_name,
                'contact_name': vendor.contact_name,
                'contact_email': vendor.contact_email,
                'website': vendor.website,
                'industry': vendor.industry,
                'risk_level': vendor.risk_level,
                'created_at': vendor.created_at.isoformat()
            }
        }), 201
    except ValidationError as e:
        return jsonify({'error': 'Validation error', 'details': e.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/vendors', methods=['GET'])
def get_vendors():
    """Get all vendors with optional filtering"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        risk_level = request.args.get('risk_level')
        industry = request.args.get('industry')
        
        query = Vendor.query
        
        if risk_level:
            query = query.filter(Vendor.risk_level == risk_level)
        if industry:
            query = query.filter(Vendor.industry == industry)
        
        vendors = query.order_by(Vendor.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'vendors': [{
                'id': vendor.id,
                'company_name': vendor.company_name,
                'contact_name': vendor.contact_name,
                'contact_email': vendor.contact_email,
                'website': vendor.website,
                'industry': vendor.industry,
                'employee_count': vendor.employee_count,
                'risk_level': vendor.risk_level,
                'risk_score': vendor.risk_score,
                'created_at': vendor.created_at.isoformat()
            } for vendor in vendors.items],
            'pagination': {
                'page': vendors.page,
                'pages': vendors.pages,
                'per_page': vendors.per_page,
                'total': vendors.total
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/vendors/<int:vendor_id>', methods=['GET'])
def get_vendor(vendor_id):
    """Get a specific vendor by ID"""
    try:
        vendor = Vendor.query.get_or_404(vendor_id)
        
        return jsonify({
            'vendor': {
                'id': vendor.id,
                'company_name': vendor.company_name,
                'contact_name': vendor.contact_name,
                'contact_email': vendor.contact_email,
                'contact_phone': vendor.contact_phone,
                'website': vendor.website,
                'industry': vendor.industry,
                'employee_count': vendor.employee_count,
                'annual_revenue': vendor.annual_revenue,
                'data_processed': vendor.data_processed,
                'compliance_frameworks': vendor.compliance_frameworks,
                'security_certifications': vendor.security_certifications,
                'risk_level': vendor.risk_level,
                'risk_score': vendor.risk_score,
                'description': vendor.description,
                'osint_data': vendor.osint_data,
                'created_at': vendor.created_at.isoformat(),
                'updated_at': vendor.updated_at.isoformat()
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/vendors/<int:vendor_id>', methods=['PUT'])
def update_vendor(vendor_id):
    """Update a vendor"""
    try:
        vendor = Vendor.query.get_or_404(vendor_id)
        data = request.get_json()
        schema = VendorSchema()
        validated_data = schema.load(data, partial=True)
        
        for key, value in validated_data.items():
            setattr(vendor, key, value)
        
        vendor.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Vendor updated successfully',
            'vendor_id': vendor.id
        })
    except ValidationError as e:
        return jsonify({'error': 'Validation error', 'details': e.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/vendors/<int:vendor_id>', methods=['DELETE'])
def delete_vendor(vendor_id):
    """Delete a vendor"""
    try:
        vendor = Vendor.query.get_or_404(vendor_id)
        db.session.delete(vendor)
        db.session.commit()
        
        return jsonify({'message': 'Vendor deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/ai-reports', methods=['GET'])
def get_ai_reports():
    """Get AI-generated reports for all vendors"""
    try:
        vendors = Vendor.query.all()
        reports = []
        
        for vendor in vendors:
            # Generate AI analysis based on vendor data
            risk_factors = []
            recommendations = []
            
            # Analyze industry risk
            if vendor.industry in ['Financial Services', 'Healthcare']:
                risk_factors.append('High regulatory compliance requirements')
                recommendations.append('Ensure compliance with industry-specific regulations')
            
            # Analyze employee count risk
            if vendor.employee_count in ['1-10', '11-50']:
                risk_factors.append('Small company with limited security resources')
                recommendations.append('Consider additional security controls and monitoring')
            
            # Analyze data processing risk
            if vendor.data_processed and 'Personal Information' in vendor.data_processed:
                risk_factors.append('Processes sensitive personal data')
                recommendations.append('Implement strong data protection measures')
            
            # Analyze compliance gaps
            if not vendor.compliance_frameworks or 'None' in vendor.compliance_frameworks:
                risk_factors.append('No formal compliance frameworks')
                recommendations.append('Consider implementing ISO 27001 or SOC 2')
            
            # Calculate AI risk score
            base_score = 50
            if risk_factors:
                base_score += len(risk_factors) * 10
            if vendor.osint_data and vendor.osint_data.get('scores'):
                osint_score = vendor.osint_data['scores'].get('overall_score', 75)
                base_score = (base_score + osint_score) / 2
            
            ai_score = min(100, max(0, base_score))
            
            # Generate AI summary
            if ai_score < 30:
                summary = f"{vendor.company_name} demonstrates excellent security posture with minimal risk factors identified."
            elif ai_score < 60:
                summary = f"{vendor.company_name} shows moderate security posture with some areas for improvement."
            elif ai_score < 80:
                summary = f"{vendor.company_name} has several security concerns that require immediate attention."
            else:
                summary = f"{vendor.company_name} presents significant security risks requiring urgent remediation."
            
            reports.append({
                'id': vendor.id,
                'vendor_name': vendor.company_name,
                'report_date': vendor.updated_at.isoformat(),
                'summary': summary,
                'recommendations': recommendations[:3],  # Top 3 recommendations
                'risk_score': round(ai_score, 1),
                'risk_factors': risk_factors,
                'industry': vendor.industry,
                'employee_count': vendor.employee_count
            })
        
        return jsonify({
            'reports': reports,
            'total_reports': len(reports),
            'generated_at': datetime.utcnow().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/ai-reports/<int:vendor_id>', methods=['GET'])
def get_vendor_ai_report(vendor_id):
    """Get AI-generated report for a specific vendor"""
    try:
        vendor = Vendor.query.get_or_404(vendor_id)
        
        # Generate detailed AI analysis
        risk_factors = []
        recommendations = []
        
        # Industry analysis
        industry_risks = {
            'Technology': ['Rapidly evolving threat landscape', 'High value intellectual property'],
            'Financial Services': ['Strict regulatory requirements', 'High-value financial data'],
            'Healthcare': ['HIPAA compliance requirements', 'Sensitive patient data'],
            'Manufacturing': ['Operational technology risks', 'Supply chain dependencies']
        }
        
        if vendor.industry in industry_risks:
            risk_factors.extend(industry_risks[vendor.industry])
            recommendations.append(f'Implement industry-specific security controls for {vendor.industry}')
        
        # Size analysis
        if vendor.employee_count in ['1-10', '11-50']:
            risk_factors.append('Limited security resources and expertise')
            recommendations.append('Consider managed security services or security consulting')
        
        # Data analysis
        if vendor.data_processed:
            if 'Personal Information' in vendor.data_processed:
                risk_factors.append('Handles sensitive personal data')
                recommendations.append('Implement GDPR/CCPA compliance measures')
            if 'Financial Data' in vendor.data_processed:
                risk_factors.append('Processes financial information')
                recommendations.append('Implement PCI DSS controls if applicable')
        
        # Compliance analysis
        if not vendor.compliance_frameworks or 'None' in vendor.compliance_frameworks:
            risk_factors.append('No formal security certifications')
            recommendations.append('Consider pursuing ISO 27001 or SOC 2 certification')
        
        # OSINT integration
        if vendor.osint_data:
            osint_scores = vendor.osint_data.get('scores', {})
            if osint_scores.get('ssl_score', 100) < 70:
                risk_factors.append('SSL/TLS security weaknesses detected')
                recommendations.append('Upgrade SSL/TLS configuration and certificates')
            if osint_scores.get('dark_web_exposure', False):
                risk_factors.append('Potential dark web exposure detected')
                recommendations.append('Implement dark web monitoring and incident response')
        
        # Calculate comprehensive risk score
        base_score = 50
        score_adjustments = {
            'risk_factors': len(risk_factors) * 8,
            'osint_score': vendor.osint_data.get('scores', {}).get('overall_score', 75) if vendor.osint_data else 75,
            'compliance_bonus': -15 if vendor.compliance_frameworks and 'None' not in vendor.compliance_frameworks else 0,
            'size_penalty': 10 if vendor.employee_count in ['1-10', '11-50'] else 0
        }
        
        final_score = base_score + score_adjustments['risk_factors'] + score_adjustments['size_penalty'] + score_adjustments['compliance_bonus']
        final_score = (final_score + score_adjustments['osint_score']) / 2
        final_score = min(100, max(0, final_score))
        
        # Generate detailed summary
        if final_score < 30:
            summary = f"{vendor.company_name} demonstrates exceptional security posture with comprehensive controls and minimal risk exposure."
        elif final_score < 50:
            summary = f"{vendor.company_name} maintains good security practices with minor areas for improvement identified."
        elif final_score < 70:
            summary = f"{vendor.company_name} has moderate security posture with several risk factors requiring attention."
        elif final_score < 85:
            summary = f"{vendor.company_name} presents significant security concerns that need immediate remediation."
        else:
            summary = f"{vendor.company_name} has critical security vulnerabilities requiring urgent intervention."
        
        return jsonify({
            'vendor_id': vendor.id,
            'vendor_name': vendor.company_name,
            'report_date': vendor.updated_at.isoformat(),
            'summary': summary,
            'recommendations': recommendations,
            'risk_score': round(final_score, 1),
            'risk_factors': risk_factors,
            'risk_level': 'Low' if final_score < 30 else 'Medium' if final_score < 60 else 'High' if final_score < 80 else 'Critical',
            'industry': vendor.industry,
            'employee_count': vendor.employee_count,
            'data_processed': vendor.data_processed,
            'compliance_frameworks': vendor.compliance_frameworks,
            'osint_data': vendor.osint_data,
            'generated_at': datetime.utcnow().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    """Get all security alerts with optional filtering"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        severity = request.args.get('severity')
        status = request.args.get('status', 'Active')
        vendor_id = request.args.get('vendor_id', type=int)
        
        query = SecurityAlert.query
        
        if severity:
            query = query.filter(SecurityAlert.severity == severity)
        if status:
            query = query.filter(SecurityAlert.status == status)
        if vendor_id:
            query = query.filter(SecurityAlert.vendor_id == vendor_id)
        
        alerts = query.order_by(SecurityAlert.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'alerts': [{
                'id': alert.id,
                'vendor_id': alert.vendor_id,
                'vendor_name': alert.vendor.company_name,
                'alert_type': alert.alert_type,
                'severity': alert.severity,
                'title': alert.title,
                'description': alert.description,
                'status': alert.status,
                'created_at': alert.created_at.isoformat(),
                'resolved_at': alert.resolved_at.isoformat() if alert.resolved_at else None
            } for alert in alerts.items],
            'pagination': {
                'page': alerts.page,
                'pages': alerts.pages,
                'per_page': alerts.per_page,
                'total': alerts.total
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/alerts/<int:alert_id>', methods=['PUT'])
def update_alert(alert_id):
    """Update alert status"""
    try:
        alert = SecurityAlert.query.get_or_404(alert_id)
        data = request.get_json()
        
        if 'status' in data:
            alert.status = data['status']
            if data['status'] == 'Resolved':
                alert.resolved_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Alert updated successfully',
            'alert_id': alert.id
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/monitoring/events', methods=['GET'])
def get_monitoring_events():
    """Get monitoring events"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        vendor_id = request.args.get('vendor_id', type=int)
        event_type = request.args.get('event_type')
        
        query = MonitoringEvent.query
        
        if vendor_id:
            query = query.filter(MonitoringEvent.vendor_id == vendor_id)
        if event_type:
            query = query.filter(MonitoringEvent.event_type == event_type)
        
        events = query.order_by(MonitoringEvent.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'events': [{
                'id': event.id,
                'vendor_id': event.vendor_id,
                'vendor_name': event.vendor.company_name,
                'event_type': event.event_type,
                'event_data': event.event_data,
                'severity': event.severity,
                'created_at': event.created_at.isoformat()
            } for event in events.items],
            'pagination': {
                'page': events.page,
                'pages': events.pages,
                'per_page': events.per_page,
                'total': events.total
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/monitoring/check', methods=['POST'])
def run_monitoring_check():
    """Run monitoring check for all vendors"""
    try:
        vendors = Vendor.query.all()
        events_created = 0
        alerts_created = 0
        
        for vendor in vendors:
            # Check SSL certificate expiry
            if vendor.website:
                try:
                    # Simulate SSL check (in real implementation, use ssl library)
                    ssl_expiry_days = random.randint(1, 365)
                    if ssl_expiry_days < 30:
                        # Create monitoring event
                        event = MonitoringEvent(
                            vendor_id=vendor.id,
                            event_type='SSL_Expiry',
                            event_data={
                                'days_until_expiry': ssl_expiry_days,
                                'domain': vendor.website
                            },
                            severity='High' if ssl_expiry_days < 7 else 'Medium'
                        )
                        db.session.add(event)
                        events_created += 1
                        
                        # Create alert if critical
                        if ssl_expiry_days < 7:
                            alert = SecurityAlert(
                                vendor_id=vendor.id,
                                alert_type='SSL_Expiry',
                                severity='Critical',
                                title=f'SSL Certificate Expiring Soon - {vendor.company_name}',
                                description=f'SSL certificate for {vendor.website} expires in {ssl_expiry_days} days',
                                details={'days_until_expiry': ssl_expiry_days}
                            )
                            db.session.add(alert)
                            alerts_created += 1
                except Exception as e:
                    print(f"Error checking SSL for {vendor.website}: {e}")
            
            # Check for dark web exposure (simulated)
            if vendor.osint_data and vendor.osint_data.get('dark_web_exposure', {}).get('exposed', False):
                # Check if alert already exists
                existing_alert = SecurityAlert.query.filter_by(
                    vendor_id=vendor.id,
                    alert_type='Dark_Web_Exposure',
                    status='Active'
                ).first()
                
                if not existing_alert:
                    alert = SecurityAlert(
                        vendor_id=vendor.id,
                        alert_type='Dark_Web_Exposure',
                        severity='High',
                        title=f'Dark Web Exposure Detected - {vendor.company_name}',
                        description=f'Potential dark web exposure detected for {vendor.company_name}',
                        details=vendor.osint_data.get('dark_web_exposure', {})
                    )
                    db.session.add(alert)
                    alerts_created += 1
        
        db.session.commit()
        
        return jsonify({
            'message': 'Monitoring check completed',
            'events_created': events_created,
            'alerts_created': alerts_created,
            'vendors_checked': len(vendors),
            'check_timestamp': datetime.utcnow().isoformat()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/vendors/<int:vendor_id>/advanced-risk', methods=['GET'])
def get_advanced_risk_assessment(vendor_id):
    """Get advanced risk assessment for a vendor"""
    try:
        vendor = Vendor.query.get_or_404(vendor_id)
        
        # Prepare vendor data for analysis
        vendor_data = {
            'company_name': vendor.company_name,
            'industry': vendor.industry,
            'employee_count': vendor.employee_count,
            'annual_revenue': vendor.annual_revenue,
            'data_processed': vendor.data_processed,
            'compliance_frameworks': vendor.compliance_frameworks,
            'country': 'United States',  # Default, in real app get from vendor data
            'region': 'North America'    # Default, in real app get from vendor data
        }
        
        # Calculate different risk types
        behavioral_risk = AdvancedRiskCalculator.calculate_behavioral_risk(vendor_data)
        geopolitical_risk = AdvancedRiskCalculator.calculate_geopolitical_risk(vendor_data)
        supply_chain_risk = AdvancedRiskCalculator.calculate_supply_chain_risk(vendor_data)
        ml_enhanced_risk = AdvancedRiskCalculator.calculate_ml_enhanced_risk(vendor_data, vendor.osint_data)
        
        # Generate recommendations
        risk_analysis = {
            'behavioral_risk': behavioral_risk,
            'geopolitical_risk': geopolitical_risk,
            'supply_chain_risk': supply_chain_risk,
            'ml_enhanced_risk': ml_enhanced_risk
        }
        
        recommendations = AdvancedRiskCalculator.generate_risk_recommendations(risk_analysis)
        
        # Calculate overall risk score
        risk_scores = [
            behavioral_risk['score'],
            geopolitical_risk['score'],
            supply_chain_risk['score'],
            ml_enhanced_risk['score']
        ]
        
        overall_score = sum(risk_scores) / len(risk_scores)
        
        return jsonify({
            'vendor_id': vendor.id,
            'vendor_name': vendor.company_name,
            'assessment_date': datetime.utcnow().isoformat(),
            'overall_risk_score': round(overall_score, 2),
            'overall_risk_level': RiskCalculator.get_risk_level(overall_score),
            'risk_breakdown': {
                'behavioral_risk': behavioral_risk,
                'geopolitical_risk': geopolitical_risk,
                'supply_chain_risk': supply_chain_risk,
                'ml_enhanced_risk': ml_enhanced_risk
            },
            'recommendations': recommendations,
            'confidence_score': ml_enhanced_risk['confidence'],
            'risk_trends': {
                'trend': 'stable',  # In real app, calculate from historical data
                'change_percentage': 0,
                'last_assessment': vendor.updated_at.isoformat()
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/risk-assessment/bulk', methods=['POST'])
def bulk_risk_assessment():
    """Perform bulk risk assessment for multiple vendors"""
    try:
        data = request.get_json()
        vendor_ids = data.get('vendor_ids', [])
        
        if not vendor_ids:
            return jsonify({'error': 'No vendor IDs provided'}), 400
        
        results = []
        for vendor_id in vendor_ids:
            try:
                vendor = Vendor.query.get(vendor_id)
                if vendor:
                    # Perform assessment (simplified version)
                    vendor_data = {
                        'company_name': vendor.company_name,
                        'industry': vendor.industry,
                        'employee_count': vendor.employee_count,
                        'data_processed': vendor.data_processed,
                        'compliance_frameworks': vendor.compliance_frameworks
                    }
                    
                    behavioral_risk = AdvancedRiskCalculator.calculate_behavioral_risk(vendor_data)
                    ml_enhanced_risk = AdvancedRiskCalculator.calculate_ml_enhanced_risk(vendor_data, vendor.osint_data)
                    
                    overall_score = (behavioral_risk['score'] + ml_enhanced_risk['score']) / 2
                    
                    results.append({
                        'vendor_id': vendor.id,
                        'vendor_name': vendor.company_name,
                        'risk_score': round(overall_score, 2),
                        'risk_level': RiskCalculator.get_risk_level(overall_score),
                        'assessment_date': datetime.utcnow().isoformat()
                    })
            except Exception as e:
                results.append({
                    'vendor_id': vendor_id,
                    'error': str(e)
                })
        
        return jsonify({
            'results': results,
            'total_assessed': len(results),
            'successful_assessments': len([r for r in results if 'error' not in r]),
            'assessment_date': datetime.utcnow().isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/osint/collect/<domain>', methods=['GET'])
def collect_osint_data(domain):
    """Collect OSINT data for a specific domain"""
    try:
        # Get Shodan API key from environment
        shodan_api_key = os.getenv('SHODAN_API_KEY')
        
        # Collect OSINT data
        osint_data = collect_vendor_osint(domain, shodan_api_key)
        
        return jsonify({
            'domain': domain,
            'osint_data': osint_data,
            'collection_timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to collect OSINT data', 'details': str(e)}), 500

@app.route('/api/osint/bulk-collect', methods=['POST'])
def bulk_collect_osint():
    """Collect OSINT data for multiple domains"""
    try:
        data = request.get_json()
        domains = data.get('domains', [])
        
        if not domains:
            return jsonify({'error': 'No domains provided'}), 400
        
        # Get Shodan API key from environment
        shodan_api_key = os.getenv('SHODAN_API_KEY')
        
        results = {}
        for domain in domains:
            try:
                osint_data = collect_vendor_osint(domain, shodan_api_key)
                results[domain] = osint_data
            except Exception as e:
                results[domain] = {'error': str(e)}
        
        return jsonify({
            'results': results,
            'total_domains': len(domains),
            'successful_collections': len([r for r in results.values() if 'error' not in r]),
            'collection_timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to collect OSINT data', 'details': str(e)}), 500

@app.route('/api/osint/scores/<domain>', methods=['GET'])
def get_osint_scores(domain):
    """Get only the risk scores from OSINT collection for a domain"""
    try:
        # Get Shodan API key from environment
        shodan_api_key = os.getenv('SHODAN_API_KEY')
        
        # Collect OSINT data
        osint_data = collect_vendor_osint(domain, shodan_api_key)
        
        # Return only the scores
        return jsonify({
            'domain': domain,
            'scores': osint_data.get('scores', {}),
            'dark_web_exposure': osint_data.get('dark_web_exposure', {}).get('exposed', False),
            'collection_timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to collect OSINT scores', 'details': str(e)}), 500

@app.route('/api/vendors/<int:vendor_id>/report', methods=['GET'])
def export_vendor_report(vendor_id):
    """Export vendor report as PDF or JSON"""
    format = request.args.get('format', 'pdf')
    
    try:
        vendor = Vendor.query.get(vendor_id)
        if not vendor:
            return jsonify({'error': 'Vendor not found'}), 404
        
        if format == 'json':
            # Generate JSON report
            report_data = {
                'vendor_id': vendor.id,
                'vendor_name': vendor.company_name,
                'contact_name': vendor.contact_name,
                'contact_email': vendor.contact_email,
                'website': vendor.website,
                'industry': vendor.industry,
                'employee_count': vendor.employee_count,
                'annual_revenue': vendor.annual_revenue,
                'data_processed': vendor.data_processed,
                'compliance_frameworks': vendor.compliance_frameworks,
                'security_certifications': vendor.security_certifications,
                'risk_level': vendor.risk_level,
                'risk_score': vendor.risk_score,
                'osint_data': vendor.osint_data,
                'created_at': vendor.created_at.isoformat(),
                'updated_at': vendor.updated_at.isoformat(),
                'report_generated_at': datetime.utcnow().isoformat()
            }
            return jsonify(report_data)
        
        elif format == 'pdf':
            if not VENDOR_REPORT_AVAILABLE:
                return jsonify({
                    'error': 'PDF generation not available',
                    'message': 'WeasyPrint dependencies are not installed on this system. Please use JSON format instead.',
                    'available_formats': ['json']
                }), 503
            
            result, error = generate_vendor_report(vendor_id, format)
            if error:
                return jsonify({'error': error}), 404
            
            # For HTML reports, return the HTML file
            if result and result.endswith('.html'):
                return send_file(
                    result, 
                    mimetype='text/html', 
                    as_attachment=True, 
                    download_name=f'vendor_{vendor_id}_report.html'
                )
            
            # For PDF reports, return the PDF
            return send_file(
                result, 
                mimetype='application/pdf', 
                as_attachment=True, 
                download_name=f'vendor_{vendor_id}_report.pdf'
            )
        
        else:
            return jsonify({'error': 'Invalid format. Use "pdf" or "json"'}), 400
            
    except Exception as e:
        return jsonify({
            'error': 'Failed to generate report',
            'message': str(e),
            'available_formats': ['json'] if not VENDOR_REPORT_AVAILABLE else ['pdf', 'json']
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy', 
        'service': 'SCOPE API',
        'version': '2.0.0',
        'database': 'connected'
    }), 200

if __name__ == '__main__':
    with app.app_context():
        # Create tables if they don't exist (don't drop in production)
        db.create_all()
        # Generate mock data if no clients exist
        if Client.query.count() == 0:
            MockDataGenerator.generate_mock_clients()
        # Generate mock vendors if none exist
        if Vendor.query.count() == 0:
            MockDataGenerator.generate_mock_vendors()
    
    # Use Railway's PORT environment variable or default to 5000
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port) 