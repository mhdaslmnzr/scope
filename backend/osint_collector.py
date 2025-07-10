import whois
import ssl
import socket
import dns.resolver
import dns.reversename
import requests
import json
import time
import threading
from typing import Dict, List, Optional, Tuple
from urllib.parse import urlparse
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class OSINTCollector:
    def __init__(self, shodan_api_key: Optional[str] = None):
        """
        Initialize OSINT collector with optional Shodan API key
        
        Args:
            shodan_api_key: Optional Shodan API key for enhanced scanning
        """
        self.shodan_api_key = shodan_api_key
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'SCOPE-OSINT-Collector/1.0'
        })
        
    def collect_vendor_intelligence(self, domain: str) -> Dict:
        """
        Collect comprehensive OSINT data for a vendor domain
        
        Args:
            domain: Vendor domain to analyze
            
        Returns:
            Dictionary containing all collected intelligence data
        """
        logger.info(f"Starting OSINT collection for domain: {domain}")
        
        # Normalize domain
        domain = self._normalize_domain(domain)
        
        # Collect all intelligence data
        results = {
            "domain": domain,
            "collection_timestamp": time.time(),
            "basic_info": self._get_basic_domain_info(domain),
            "ssl_info": self._check_ssl_tls(domain),
            "dns_info": self._check_dns_security(domain),
            "http_headers": self._check_http_security_headers(domain),
            "port_scan": self._basic_port_scan(domain),
            "shodan_data": self._get_shodan_data(domain),
            "dark_web_exposure": self._check_dark_web_exposure(domain),
            "scores": {}
        }
        
        # Calculate scores
        results["scores"] = self._calculate_scores(results)
        
        logger.info(f"Completed OSINT collection for {domain}")
        return results
    
    def _normalize_domain(self, domain: str) -> str:
        """Normalize domain by removing protocol and path"""
        if domain.startswith(('http://', 'https://')):
            domain = urlparse(domain).netloc
        return domain.lower().strip()
    
    def _get_basic_domain_info(self, domain: str) -> Dict:
        """Get basic domain information and WHOIS data"""
        try:
            logger.info(f"Collecting WHOIS data for {domain}")
            w = whois.whois(domain)
            
            return {
                "registrar": w.registrar,
                "creation_date": str(w.creation_date) if w.creation_date else None,
                "expiration_date": str(w.expiration_date) if w.expiration_date else None,
                "updated_date": str(w.updated_date) if w.updated_date else None,
                "name_servers": w.name_servers if w.name_servers else [],
                "status": w.status if w.status else [],
                "emails": w.emails if w.emails else [],
                "org": w.org if w.org else None,
                "country": w.country if w.country else None
            }
        except Exception as e:
            logger.error(f"Error collecting WHOIS data for {domain}: {e}")
            return {"error": str(e)}
    
    def _check_ssl_tls(self, domain: str) -> Dict:
        """Check SSL/TLS configuration and certificate"""
        try:
            logger.info(f"Checking SSL/TLS for {domain}")
            
            # Create SSL context
            context = ssl.create_default_context()
            
            # Connect to domain on port 443
            with socket.create_connection((domain, 443), timeout=10) as sock:
                with context.wrap_socket(sock, server_hostname=domain) as ssock:
                    cert = ssock.getpeercert()
                    
                    # Get cipher info
                    cipher = ssock.cipher()
                    
                    # Check certificate details
                    subject = dict(x[0] for x in cert['subject'])
                    issuer = dict(x[0] for x in cert['issuer'])
                    
                    # Parse dates
                    not_before = ssl.cert_time_to_seconds(cert['notBefore'])
                    not_after = ssl.cert_time_to_seconds(cert['notAfter'])
                    
                    # Calculate days until expiration
                    days_until_expiry = (not_after - time.time()) / (24 * 3600)
                    
                    return {
                        "certificate_valid": True,
                        "subject": subject,
                        "issuer": issuer,
                        "not_before": cert['notBefore'],
                        "not_after": cert['notAfter'],
                        "days_until_expiry": int(days_until_expiry),
                        "cipher_suite": cipher[0] if cipher else None,
                        "cipher_version": cipher[1] if cipher else None,
                        "cipher_bits": cipher[2] if cipher else None,
                        "protocol_version": ssock.version(),
                        "san_domains": cert.get('subjectAltName', [])
                    }
                    
        except Exception as e:
            logger.error(f"Error checking SSL/TLS for {domain}: {e}")
            return {
                "certificate_valid": False,
                "error": str(e)
            }
    
    def _check_dns_security(self, domain: str) -> Dict:
        """Check DNS records and email security (SPF, DKIM, DMARC)"""
        try:
            logger.info(f"Checking DNS security for {domain}")
            
            results = {
                "a_records": [],
                "aaaa_records": [],
                "mx_records": [],
                "txt_records": [],
                "spf_record": None,
                "dmarc_record": None,
                "dkim_records": [],
                "cname_records": [],
                "ns_records": []
            }
            
            # Get A records
            try:
                a_records = dns.resolver.resolve(domain, 'A')
                results["a_records"] = [str(record) for record in a_records]
            except Exception as e:
                logger.warning(f"Could not resolve A records for {domain}: {e}")
            
            # Get AAAA records
            try:
                aaaa_records = dns.resolver.resolve(domain, 'AAAA')
                results["aaaa_records"] = [str(record) for record in aaaa_records]
            except Exception as e:
                logger.warning(f"Could not resolve AAAA records for {domain}: {e}")
            
            # Get MX records
            try:
                mx_records = dns.resolver.resolve(domain, 'MX')
                results["mx_records"] = [str(record.exchange) for record in mx_records]
            except Exception as e:
                logger.warning(f"Could not resolve MX records for {domain}: {e}")
            
            # Get TXT records
            try:
                txt_records = dns.resolver.resolve(domain, 'TXT')
                results["txt_records"] = [str(record) for record in txt_records]
                
                # Check for SPF record
                for record in txt_records:
                    if 'v=spf1' in str(record):
                        results["spf_record"] = str(record)
                        break
            except Exception as e:
                logger.warning(f"Could not resolve TXT records for {domain}: {e}")
            
            # Check DMARC record
            try:
                dmarc_domain = f"_dmarc.{domain}"
                dmarc_records = dns.resolver.resolve(dmarc_domain, 'TXT')
                for record in dmarc_records:
                    if 'v=DMARC1' in str(record):
                        results["dmarc_record"] = str(record)
                        break
            except Exception as e:
                logger.warning(f"Could not resolve DMARC record for {domain}: {e}")
            
            # Get CNAME records
            try:
                cname_records = dns.resolver.resolve(domain, 'CNAME')
                results["cname_records"] = [str(record) for record in cname_records]
            except Exception as e:
                logger.warning(f"Could not resolve CNAME records for {domain}: {e}")
            
            # Get NS records
            try:
                ns_records = dns.resolver.resolve(domain, 'NS')
                results["ns_records"] = [str(record) for record in ns_records]
            except Exception as e:
                logger.warning(f"Could not resolve NS records for {domain}: {e}")
            
            return results
            
        except Exception as e:
            logger.error(f"Error checking DNS security for {domain}: {e}")
            return {"error": str(e)}
    
    def _check_http_security_headers(self, domain: str) -> Dict:
        """Check HTTP security headers"""
        try:
            logger.info(f"Checking HTTP security headers for {domain}")
            
            # Try HTTPS first, then HTTP
            urls_to_try = [f"https://{domain}", f"http://{domain}"]
            
            for url in urls_to_try:
                try:
                    response = self.session.get(url, timeout=10, allow_redirects=True)
                    
                    headers = dict(response.headers)
                    
                    # Check for important security headers
                    security_headers = {
                        "strict_transport_security": headers.get("Strict-Transport-Security"),
                        "content_security_policy": headers.get("Content-Security-Policy"),
                        "x_frame_options": headers.get("X-Frame-Options"),
                        "x_content_type_options": headers.get("X-Content-Type-Options"),
                        "x_xss_protection": headers.get("X-XSS-Protection"),
                        "referrer_policy": headers.get("Referrer-Policy"),
                        "permissions_policy": headers.get("Permissions-Policy"),
                        "cache_control": headers.get("Cache-Control"),
                        "server": headers.get("Server"),
                        "x_powered_by": headers.get("X-Powered-By")
                    }
                    
                    return {
                        "url": url,
                        "status_code": response.status_code,
                        "security_headers": security_headers,
                        "all_headers": headers
                    }
                    
                except requests.exceptions.RequestException as e:
                    logger.warning(f"Could not connect to {url}: {e}")
                    continue
            
            return {"error": "Could not connect to domain"}
            
        except Exception as e:
            logger.error(f"Error checking HTTP headers for {domain}: {e}")
            return {"error": str(e)}
    
    def _basic_port_scan(self, domain: str) -> Dict:
        """Perform basic port scanning"""
        try:
            logger.info(f"Performing port scan for {domain}")
            
            # Common ports to check
            common_ports = [21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 3306, 3389, 5432, 8080, 8443]
            
            open_ports = []
            
            # Get IP address
            try:
                ip = socket.gethostbyname(domain)
            except socket.gaierror:
                return {"error": f"Could not resolve IP for {domain}"}
            
            # Scan ports
            for port in common_ports:
                try:
                    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                    sock.settimeout(2)
                    result = sock.connect_ex((ip, port))
                    if result == 0:
                        open_ports.append(port)
                    sock.close()
                except Exception as e:
                    logger.warning(f"Error scanning port {port}: {e}")
            
            return {
                "ip_address": ip,
                "open_ports": open_ports,
                "total_ports_scanned": len(common_ports)
            }
            
        except Exception as e:
            logger.error(f"Error performing port scan for {domain}: {e}")
            return {"error": str(e)}
    
    def _get_shodan_data(self, domain: str) -> Dict:
        """Get Shodan data for domain (requires API key)"""
        if not self.shodan_api_key:
            return {"error": "Shodan API key not provided"}
        
        try:
            logger.info(f"Getting Shodan data for {domain}")
            
            # Get domain info
            url = f"https://api.shodan.io/dns/domain/{domain}?key={self.shodan_api_key}"
            response = self.session.get(url, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "subdomains": data.get("subdomains", []),
                    "tags": data.get("tags", []),
                    "data": data.get("data", [])
                }
            else:
                return {"error": f"Shodan API error: {response.status_code}"}
                
        except Exception as e:
            logger.error(f"Error getting Shodan data for {domain}: {e}")
            return {"error": str(e)}
    
    def _check_dark_web_exposure(self, domain: str) -> Dict:
        """Mock dark web exposure check (simulated for now)"""
        try:
            logger.info(f"Checking dark web exposure for {domain}")
            
            # Simulate dark web check with some randomness
            import random
            
            # Simulate different types of exposure
            exposure_types = []
            exposure_probability = random.random()
            
            if exposure_probability > 0.7:
                exposure_types = ["email_credentials", "domain_credentials"]
            elif exposure_probability > 0.4:
                exposure_types = ["email_credentials"]
            
            # Simulate breach data
            breach_data = []
            if exposure_types:
                breach_data = [
                    {
                        "type": "credentials",
                        "source": "pastebin",
                        "date": "2024-01-15",
                        "count": random.randint(10, 1000)
                    }
                ]
            
            return {
                "exposed": len(exposure_types) > 0,
                "exposure_types": exposure_types,
                "breach_data": breach_data,
                "last_checked": time.time()
            }
            
        except Exception as e:
            logger.error(f"Error checking dark web exposure for {domain}: {e}")
            return {"error": str(e)}
    
    def _calculate_scores(self, data: Dict) -> Dict:
        """Calculate risk scores based on collected data"""
        scores = {}
        
        # SSL Score (0-100)
        ssl_score = 0
        if data.get("ssl_info", {}).get("certificate_valid"):
            ssl_score = 80  # Base score for valid certificate
            
            # Bonus for good cipher
            cipher = data["ssl_info"].get("cipher_suite", "")
            if "TLS_AES" in cipher or "TLS_CHACHA20" in cipher:
                ssl_score += 10
            elif "TLS_ECDHE" in cipher:
                ssl_score += 5
            
            # Penalty for expiring soon
            days_until_expiry = data["ssl_info"].get("days_until_expiry", 0)
            if days_until_expiry < 30:
                ssl_score -= 20
            elif days_until_expiry < 90:
                ssl_score -= 10
        scores["ssl_score"] = max(0, min(100, ssl_score))
        
        # DNS Email Security Score (0-100)
        dns_score = 0
        dns_info = data.get("dns_info", {})
        
        if dns_info.get("spf_record"):
            dns_score += 30
        if dns_info.get("dmarc_record"):
            dns_score += 40
        if dns_info.get("mx_records"):
            dns_score += 20
        if dns_info.get("a_records"):
            dns_score += 10
            
        scores["dns_email_score"] = dns_score
        
        # HTTP Headers Score (0-100)
        headers_score = 0
        headers = data.get("http_headers", {}).get("security_headers", {})
        
        if headers.get("strict_transport_security"):
            headers_score += 20
        if headers.get("content_security_policy"):
            headers_score += 20
        if headers.get("x_frame_options"):
            headers_score += 15
        if headers.get("x_content_type_options"):
            headers_score += 15
        if headers.get("x_xss_protection"):
            headers_score += 15
        if headers.get("referrer_policy"):
            headers_score += 15
            
        scores["http_headers_score"] = headers_score
        
        # Open Ports Score (0-100)
        ports_score = 100
        open_ports = data.get("port_scan", {}).get("open_ports", [])
        
        # Penalty for risky open ports
        risky_ports = [21, 23, 25, 110, 143, 3306, 3389, 5432]
        for port in open_ports:
            if port in risky_ports:
                ports_score -= 15
            elif port not in [80, 443, 993, 995]:
                ports_score -= 5
                
        scores["open_ports_score"] = max(0, ports_score)
        
        # Reputation Score (0-100) - based on domain age and basic factors
        reputation_score = 50  # Base score
        
        basic_info = data.get("basic_info", {})
        if basic_info.get("creation_date"):
            try:
                creation_date = basic_info["creation_date"]
                if isinstance(creation_date, list):
                    creation_date = creation_date[0]
                # Simple age calculation (in years)
                import datetime
                if isinstance(creation_date, str):
                    creation_date = datetime.datetime.strptime(creation_date.split()[0], "%Y-%m-%d")
                age_years = (datetime.datetime.now() - creation_date).days / 365
                if age_years > 5:
                    reputation_score += 20
                elif age_years > 2:
                    reputation_score += 10
            except:
                pass
        
        # Penalty for dark web exposure
        if data.get("dark_web_exposure", {}).get("exposed"):
            reputation_score -= 30
            
        scores["reputation_score"] = max(0, min(100, reputation_score))
        
        return scores

def collect_vendor_osint(domain: str, shodan_api_key: Optional[str] = None) -> Dict:
    """
    Convenience function to collect OSINT data for a vendor domain
    
    Args:
        domain: Vendor domain to analyze
        shodan_api_key: Optional Shodan API key
        
    Returns:
        Dictionary containing OSINT data and scores
    """
    collector = OSINTCollector(shodan_api_key)
    return collector.collect_vendor_intelligence(domain)

# Example usage
if __name__ == "__main__":
    # Test with a safe sample domain
    test_domain = "httpbin.org"
    result = collect_vendor_osint(test_domain)
    print(json.dumps(result, indent=2)) 