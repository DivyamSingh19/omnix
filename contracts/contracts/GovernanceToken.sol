// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./interfaces/IGovernanceToken.sol";

/**
 * @title GovernanceToken
 * @dev ERC20 token with voting capabilities for Omnix DAO
 * @author Omnix Team
 */
contract GovernanceToken is 
    IGovernanceToken, 
    ERC20, 
    ERC20Permit, 
    ERC20Votes, 
    Ownable, 
    Pausable 
{
    
    // Token configuration
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18; // 1B tokens
    uint256 public constant INITIAL_MINT = 100_000_000 * 10**18; // 100M initial mint
    
    // Minting configuration
    uint256 public constant MAX_MINT_PER_YEAR = 50_000_000 * 10**18; // 5% inflation cap
    uint256 public lastMintTime;
    uint256 public mintedThisYear;
    
    // Voting power configuration
    mapping(address => uint256) private votingPowerMultipliers; // basis points (10000 = 1x)
    uint256 public constant DEFAULT_MULTIPLIER = 10000; // 1x voting power
    
    // Events
    event VotingPowerMultiplierSet(address indexed account, uint256 multiplier);
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    
    constructor(
        string memory name,
        string memory symbol,
        address initialHolder
    ) 
        ERC20(name, symbol) 
        ERC20Permit(name) 
    {
        require(initialHolder != address(0), "Invalid initial holder");
        
        // Mint initial supply
        _mint(initialHolder, INITIAL_MINT);
        
        // Initialize minting tracking
        lastMintTime = block.timestamp;
        mintedThisYear = 0;
        
        // Set default voting power multiplier for initial holder
        votingPowerMultipliers[initialHolder] = DEFAULT_MULTIPLIER;
    }
    
    /**
     * @dev Mint new tokens (subject to yearly limits)
     */
    function mint(address to, uint256 amount) external onlyOwner whenNotPaused {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be positive");
        
        // Check yearly minting limits
        if (block.timestamp >= lastMintTime + 365 days) {
            // Reset yearly counter
            lastMintTime = block.timestamp;
            mintedThisYear = 0;
        }
        
        require(
            mintedThisYear + amount <= MAX_MINT_PER_YEAR,
            "Exceeds yearly mint limit"
        );
        require(
            totalSupply() + amount <= TOTAL_SUPPLY,
            "Exceeds total supply cap"
        );
        
        mintedThisYear += amount;
        _mint(to, amount);
        
        // Set default voting power multiplier for new holders
        if (votingPowerMultipliers[to] == 0) {
            votingPowerMultipliers[to] = DEFAULT_MULTIPLIER;
        }
        
        emit TokensMinted(to, amount);
    }
    
    /**
     * @dev Burn tokens from caller
     */
    function burn(uint256 amount) external {
        require(amount > 0, "Amount must be positive");
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }
    
    /**
     * @dev Burn tokens from specified account (requires allowance)
     */
    function burnFrom(address account, uint256 amount) external {
        require(amount > 0, "Amount must be positive");
        _spendAllowance(account, msg.sender, amount);
        _burn(account, amount);
        emit TokensBurned(account, amount);
    }
    
    /**
     * @dev Set voting power multiplier for an account
     * @param account Address to set multiplier for
     * @param multiplier Multiplier in basis points (10000 = 1x, 20000 = 2x)
     */
    function setVotingPowerMultiplier(address account, uint256 multiplier) 
        external 
        onlyOwner 
    {
        require(account != address(0), "Invalid account");
        require(multiplier > 0 && multiplier <= 50000, "Invalid multiplier"); // Max 5x
        
        votingPowerMultipliers[account] = multiplier;
        emit VotingPowerMultiplierSet(account, multiplier);
    }
    
    // IGovernanceToken implementation
    function getVotingPower(address account) 
        external 
        view 
        override 
        returns (uint256) 
    {
        uint256 balance = balanceOf(account);
        uint256 multiplier = votingPowerMultipliers[account];
        
        if (multiplier == 0) {
            multiplier = DEFAULT_MULTIPLIER;
        }
        
        return (balance * multiplier) / 10000;
    }
    
    function getVotingPowerAt(address account, uint256 blockNumber) 
        external 
        view 
        override 
        returns (uint256) 
    {
        uint256 balance = getPastVotes(account, blockNumber);
        uint256 multiplier = votingPowerMultipliers[account];
        
        if (multiplier == 0) {
            multiplier = DEFAULT_MULTIPLIER;
        }
        
        return (balance * multiplier) / 10000;
    }
    
    function delegate(address delegatee) public override(ERC20Votes, IGovernanceToken) {
        super.delegate(delegatee);
    }
    
    // View functions
    function getVotingPowerMultiplier(address account) 
        external 
        view 
        returns (uint256) 
    {
        uint256 multiplier = votingPowerMultipliers[account];
        return multiplier == 0 ? DEFAULT_MULTIPLIER : multiplier;
    }
    
    function getRemainingMintCapacity() external view returns (uint256) {
        if (block.timestamp >= lastMintTime + 365 days) {
            return MAX_MINT_PER_YEAR;
        }
        return MAX_MINT_PER_YEAR - mintedThisYear;
    }
    
    function getTimeToNextMintReset() external view returns (uint256) {
        if (block.timestamp >= lastMintTime + 365 days) {
            return 0;
        }
        return (lastMintTime + 365 days) - block.timestamp;
    }
    
    // Admin functions
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // Override required functions
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
        
        // Set default voting power multiplier for new token holders
        if (to != address(0) && votingPowerMultipliers[to] == 0) {
            votingPowerMultipliers[to] = DEFAULT_MULTIPLIER;
        }
    }
    
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }
    
    function _mint(address to, uint256 amount) 
        internal 
        override(ERC20, ERC20Votes) 
    {
        super._mint(to, amount);
    }
    
    function _burn(address account, uint256 amount) 
        internal 
        override(ERC20, ERC20Votes) 
    {
        super._burn(account, amount);
    }
}