from typing import Dict, Optional, List

class ResponseService:
    """
    Service for determining and executing the appropriate response to security threats.
    Uses policy-based decision making to automate responses based on threat levels.
    """
    
    def __init__(self):
        """Initialize with default response policies."""
        self.response_policies = {
            "Low": ["Log Only"],
            "Medium": ["Log Only", "Notify Admin"],
            "High": ["Log Only", "Notify Admin", "Block IP"],
            "Critical": ["Log Only", "Notify Admin", "Block IP", "Notify SOC"]
        }
    
    def get_policy_actions(self, threat_level: str) -> List[str]:
        """
        Get the list of actions to take for a given threat level.
        
        Args:
            threat_level: The detected threat level (Low, Medium, High, Critical)
            
        Returns:
            List of actions to take
        """
        return self.response_policies.get(threat_level, ["Log Only"])
    
    def get_primary_action(self, threat_level: str) -> str:
        """
        Get the primary response action for the given threat level.
        
        Args:
            threat_level: The detected threat level
            
        Returns:
            String representing the primary action to take
        """
        actions = self.get_policy_actions(threat_level)
        # Return the most severe action (last in the list)
        return actions[-1] if actions else "Log Only"
    
    def get_response_details(self, threat_level: str, log_id: int, source_ip: str) -> Dict:
        """
        Generate detailed response information for a security incident.
        
        Args:
            threat_level: The detected threat level
            log_id: ID of the security log
            source_ip: Source IP address of the potential threat
            
        Returns:
            Dictionary with response details
        """
        action = self.get_primary_action(threat_level)
        all_actions = self.get_policy_actions(threat_level)
        
        notes = f"Automated response for threat level: {threat_level}"
        if "Block IP" in all_actions:
            notes += f"\nIP {source_ip} has been blocked."
        if "Notify SOC" in all_actions:
            notes += "\nSecurity Operations Center has been notified."
            
        return {
            "action": action,
            "success": True,
            "notes": notes,
            "log_id": log_id,
            "all_actions": all_actions
        }