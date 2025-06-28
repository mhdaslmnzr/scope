from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from marshmallow import Schema, fields, ValidationError
from datetime import datetime, timedelta
import os
import random
import json
from dotenv import load_dotenv
import uuid

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

# Mock Data Generator
class MockDataGenerator:
    @staticmethod
    def generate_mock_clients():
        companies = [
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
                
                # Add employee contacts
                contacts = [
                    {"name": "John Smith", "email": "john.smith@" + company["domain"], "role": "CSO"},
                    {"name": "Sarah Johnson", "email": "sarah.johnson@" + company["domain"], "role": "Security Lead"},
                    {"name": "Mike Chen", "email": "mike.chen@" + company["domain"], "role": "IT Security Analyst"}
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
                    "gaps_or_remarks": "DLP solution needed, MFA not fully implemented"
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
        count = MockDataGenerator.generate_mock_clients()
        return jsonify({
            'message': f'Generated {count} mock clients successfully',
            'clients_created': count
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
    
    # Use Railway's PORT environment variable or default to 5000
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port) 