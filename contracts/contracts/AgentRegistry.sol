// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./interfaces/IAgentRegistry.sol";

/**
 * @title AgentRegistry
 * @dev Maps users to the central agent and manages delegation preferences
 * @author Omnix Team
 */
contract AgentRegistry is IAgentRegistry, Ownable, Pausable {
    
    // Central agent address (deployed by Omnix)
    address public immutable agentAddress;
    
    // User delegation mapping
    mapping(address => UserDelegation) private userDelegations;
    
    // User preferences (stored as IPFS hashes)
    mapping(address => string) private userPreferences;
    
    // Events
    event DelegationEnabled(address indexed user, string preferencesHash);
    event DelegationDisabled(address indexed user);
    event PreferencesUpdated(address indexed user, string preferencesHash);
    event AgentAddressUpdated(address indexed oldAgent, address indexed newAgent);
    
    constructor(address _agentAddress) {
        require(_agentAddress != address(0), "Invalid agent address");
        agentAddress = _agentAddress;
    }
    
    /**
     * @dev Enable delegation to the central agent
     * @param preferencesHash IPFS hash containing user's voting preferences
     */
    function enableDelegation(string memory preferencesHash) 
        external 
        whenNotPaused 
    {
        require(bytes(preferencesHash).length > 0, "Preferences hash required");
        
        userDelegations[msg.sender] = UserDelegation({
            isDelegated: true,
            delegatedAt: block.timestamp,
            lastPreferencesUpdate: block.timestamp
        });
        
        userPreferences[msg.sender] = preferencesHash;
        
        emit DelegationEnabled(msg.sender, preferencesHash);
    }
    
    /**
     * @dev Disable delegation (user wants to vote directly)
     */
    function disableDelegation() external {
        require(userDelegations[msg.sender].isDelegated, "Not currently delegated");
        
        delete userDelegations[msg.sender];
        
        emit DelegationDisabled(msg.sender);
    }
    
    /**
     * @dev Update user preferences without changing delegation status
     * @param preferencesHash New IPFS hash containing updated preferences
     */
    function updatePreferences(string memory preferencesHash) 
        external 
        whenNotPaused 
    {
        require(bytes(preferencesHash).length > 0, "Preferences hash required");
        require(userDelegations[msg.sender].isDelegated, "Not delegated");
        
        userPreferences[msg.sender] = preferencesHash;
        userDelegations[msg.sender].lastPreferencesUpdate = block.timestamp;
        
        emit PreferencesUpdated(msg.sender, preferencesHash);
    }
    
    // View functions implementing IAgentRegistry
    function isDelegated(address user) external view override returns (bool) {
        return userDelegations[user].isDelegated;
    }
    
    function getDelegationInfo(address user) 
        external 
        view 
        override 
        returns (UserDelegation memory) 
    {
        return userDelegations[user];
    }
    
    function getUserPreferences(address user) 
        external 
        view 
        override 
        returns (string memory) 
    {
        return userPreferences[user];
    }
    
    function getAgentAddress() external view override returns (address) {
        return agentAddress;
    }
    
    /**
     * @dev Get all delegated users (for agent to query)
     * Note: This is expensive and should be called off-chain or paginated
     */
    function getAllDelegatedUsers(uint256 offset, uint256 limit) 
        external 
        view 
        returns (address[] memory users, string[] memory preferences) 
    {
        // This would need to be implemented with a counter and enumerable set
        // for production use. For now, returning empty arrays as placeholder.
        users = new address[](0);
        preferences = new string[](0);
    }
    
    /**
     * @dev Check if user has recent preferences (within last 30 days)
     */
    function hasRecentPreferences(address user) external view returns (bool) {
        if (!userDelegations[user].isDelegated) return false;
        return (block.timestamp - userDelegations[user].lastPreferencesUpdate) <= 30 days;
    }
    
    // Admin functions
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
}