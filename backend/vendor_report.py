import os
import json
from datetime import datetime
from flask import current_app
from app import db, Vendor

def generate_vendor_report(vendor_id, format='pdf'):
    """Generate vendor report in specified format"""
    try:
        vendor = Vendor.query.get(vendor_id)
        if not vendor:
            return None, "Vendor not found"
        
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
            return report_data, None
        
        elif format == 'pdf':
            # Generate HTML report that can be printed to PDF
            html_content = generate_html_report(vendor)
            
            # Save HTML file temporarily
            temp_file = f"temp_vendor_{vendor_id}_report.html"
            with open(temp_file, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            return temp_file, None
        
        else:
            return None, "Invalid format"
            
    except Exception as e:
        return None, str(e)

def generate_html_report(vendor):
    """Generate HTML report for vendor"""
    html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Vendor Report - {vendor.company_name}</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 20px;
                background-color: #f5f5f5;
            }}
            .container {{
                max-width: 800px;
                margin: 0 auto;
                background-color: white;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }}
            .header {{
                text-align: center;
                border-bottom: 2px solid #2563eb;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }}
            .header h1 {{
                color: #2563eb;
                margin: 0;
                font-size: 28px;
            }}
            .header p {{
                color: #666;
                margin: 5px 0 0 0;
            }}
            .section {{
                margin-bottom: 30px;
            }}
            .section h2 {{
                color: #2563eb;
                border-bottom: 1px solid #e5e7eb;
                padding-bottom: 10px;
                margin-bottom: 15px;
            }}
            .info-grid {{
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
            }}
            .info-item {{
                background-color: #f8fafc;
                padding: 15px;
                border-radius: 6px;
                border-left: 4px solid #2563eb;
            }}
            .info-item strong {{
                color: #374151;
                display: block;
                margin-bottom: 5px;
            }}
            .info-item span {{
                color: #6b7280;
            }}
            .risk-score {{
                background-color: #fef3c7;
                padding: 15px;
                border-radius: 6px;
                border-left: 4px solid #f59e0b;
                margin-bottom: 20px;
            }}
            .risk-score strong {{
                color: #92400e;
                font-size: 18px;
            }}
            .list-item {{
                background-color: #f8fafc;
                padding: 10px;
                margin: 5px 0;
                border-radius: 4px;
                border-left: 3px solid #2563eb;
            }}
            .footer {{
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                text-align: center;
                color: #6b7280;
                font-size: 14px;
            }}
            @media print {{
                body {{ background-color: white; }}
                .container {{ box-shadow: none; }}
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>SCOPE Vendor Risk Report</h1>
                <p>Supply Chain Security Intelligence Platform</p>
                <p>Generated on {datetime.utcnow().strftime('%B %d, %Y at %I:%M %p UTC')}</p>
            </div>
            
            <div class="section">
                <h2>Vendor Information</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <strong>Company Name</strong>
                        <span>{vendor.company_name}</span>
                    </div>
                    <div class="info-item">
                        <strong>Industry</strong>
                        <span>{vendor.industry}</span>
                    </div>
                    <div class="info-item">
                        <strong>Contact Name</strong>
                        <span>{vendor.contact_name}</span>
                    </div>
                    <div class="info-item">
                        <strong>Contact Email</strong>
                        <span>{vendor.contact_email}</span>
                    </div>
                    <div class="info-item">
                        <strong>Website</strong>
                        <span>{vendor.website or 'Not provided'}</span>
                    </div>
                    <div class="info-item">
                        <strong>Employee Count</strong>
                        <span>{vendor.employee_count}</span>
                    </div>
                    <div class="info-item">
                        <strong>Annual Revenue</strong>
                        <span>{vendor.annual_revenue or 'Not provided'}</span>
                    </div>
                    <div class="info-item">
                        <strong>Risk Level</strong>
                        <span>{vendor.risk_level}</span>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2>Risk Assessment</h2>
                <div class="risk-score">
                    <strong>Overall Risk Score: {vendor.risk_score}/100</strong>
                    <p>Risk Level: {vendor.risk_level}</p>
                </div>
            </div>
            
            <div class="section">
                <h2>Data Processing</h2>
                <div class="info-item">
                    <strong>Types of Data Processed</strong>
                    {''.join([f'<div class="list-item">{data_type}</div>' for data_type in (vendor.data_processed or [])])}
                </div>
            </div>
            
            <div class="section">
                <h2>Compliance & Security</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <strong>Compliance Frameworks</strong>
                        {''.join([f'<div class="list-item">{framework}</div>' for framework in (vendor.compliance_frameworks or [])])}
                    </div>
                    <div class="info-item">
                        <strong>Security Certifications</strong>
                        {''.join([f'<div class="list-item">{cert}</div>' for cert in (vendor.security_certifications or [])])}
                    </div>
                </div>
            </div>
            
            {f'''
            <div class="section">
                <h2>OSINT Analysis</h2>
                <div class="info-item">
                    <strong>Open Source Intelligence Data</strong>
                    <pre style="background-color: #f8fafc; padding: 10px; border-radius: 4px; overflow-x: auto;">{json.dumps(vendor.osint_data, indent=2) if vendor.osint_data else 'No OSINT data available'}</pre>
                </div>
            </div>
            ''' if vendor.osint_data else ''}
            
            <div class="section">
                <h2>Additional Information</h2>
                <div class="info-item">
                    <strong>Description</strong>
                    <p>{vendor.description or 'No description provided'}</p>
                </div>
            </div>
            
            <div class="footer">
                <p>This report was generated by SCOPE - Supply Chain Security Intelligence Platform</p>
                <p>For questions or concerns, please contact your security team</p>
            </div>
        </div>
    </body>
    </html>
    """
    return html 