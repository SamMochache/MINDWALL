from typing import Dict, List, Optional, Tuple
import re
import ipaddress
from datetime import datetime

class ThreatDetector:
    """
    Service class for detecting and analyzing threat levels in system logs.
    Uses rule-based detection with keyword matching and pattern recognition.
    """
    
    def __init__(self, rules: Optional[Dict[str, str]] = None):
        """
        Initialize with default rules or custom rules.
        
        Args:
            rules: Dictionary mapping keywords to threat levels
        """
        self.THREAT_KEYWORDS = rules or {
            "SSH": "High",
            "login failed": "Medium",
            "brute force": "High",
            "unauthorized": "High",
            "malware": "High",
            "sql injection": "Critical",
            "xss": "Critical",
            "cross-site": "Critical",
            "port scan": "Medium",
            "ddos": "Critical",
            "ransomware": "Critical",
            "credential": "Medium",
            "firewall": "Medium",
            "rootkit": "Critical",
            "unknown": "Low"
        }
        
        # Compiled regex patterns for common attack signatures
        self._ip_pattern = re.compile(r'\b(?:\d{1,3}\.){3}\d{1,3}\b')
        self._sql_injection_pattern = re.compile(r'(\%27)|(\')|(\-\-)|(\%23)|(#)|(\%3B)|(;)')
        self._xss_pattern = re.compile(r'<script>|<\/script>|javascript:|onerror=|onload=', re.IGNORECASE)
        
    def detect_threat_level(self, content: str) -> str:
        """
        Determine the threat level based on log content.
        
        Args:
            content: The log text content to analyze
            
        Returns:
            String representing threat level ("Low", "Medium", "High", "Critical")
        """
        # Check for keyword matches
        for keyword, level in self.THREAT_KEYWORDS.items():
            if keyword.lower() in content.lower():
                return level
                
        # Check for attack signatures
        if self._contains_sql_injection(content):
            return "Critical"
        if self._contains_xss(content):
            return "Critical"
            
        # Check for suspicious IP patterns
        if self._contains_suspicious_ips(content):
            return "Medium"
            
        return "Low"
    
    def _contains_sql_injection(self, content: str) -> bool:
        """Check if content contains SQL injection patterns."""
        return bool(self._sql_injection_pattern.search(content))
    
    def _contains_xss(self, content: str) -> bool:
        """Check if content contains cross-site scripting patterns."""
        return bool(self._xss_pattern.search(content))
    
    def _contains_suspicious_ips(self, content: str) -> bool:
        """Check if content contains suspicious IP addresses."""
        ip_matches = self._ip_pattern.findall(content)
        
        # Check if any IP is in known malicious ranges (example)
        for ip_str in ip_matches:
            try:
                ip = ipaddress.ip_address(ip_str)
                # Example check - could be expanded with real threat intelligence
                if ip.is_private or str(ip).startswith('10.0.'):
                    return True
            except ValueError:
                continue
                
        return False
        
    def analyze_log(self, log_content: str) -> Dict[str, any]:
        """
        Perform comprehensive analysis on log content.
        
        Args:
            log_content: The log content to analyze
            
        Returns:
            Dictionary with analysis results
        """
        threat_level = self.detect_threat_level(log_content)
        
        # Extract potential IPs mentioned in the log
        ips = self._ip_pattern.findall(log_content)
        
        return {
            "threat_level": threat_level,
            "prediction": "Threat" if threat_level != "Low" else "Normal",
            "detected_ips": ips,
            "timestamp": datetime.now().isoformat(),
            "analysis_version": "1.0"
        }