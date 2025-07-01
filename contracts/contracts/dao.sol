// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/IAgentRegistry.sol";
import "./interfaces/IGovernanceToken.sol";
import "./libraries/ProposalLib.sol";
import "./modifiers/OnlyAgent.sol";

/**
 * @title OmnixDAO
 * @dev Core contract that manages proposals, voting, and execution
 * @author Omnix Team
 */
contract OmnixDAO is Ownable, ReentrancyGuard, Pausable, OnlyAgent {
    using Counters for Counters.Counter;
    using ProposalLib for ProposalLib.Proposal;
    
    // State variables
    Counters.Counter private _proposalIds;
    
    // Contract references
    IAgentRegistry public immutable agentRegistry;
    IGovernanceToken public immutable governanceToken;
    
    // Governance parameters
    uint256 public constant VOTING_PERIOD = 7 days;
    uint256 public constant EXECUTION_DELAY = 2 days;
    uint256 public proposalThreshold = 1000 * 10**18; // 1000 tokens
    uint256 public quorumPercentage = 5000; // 50% in basis points
    
    // Mappings
    mapping(uint256 => ProposalLib.Proposal) public proposals;
    mapping(uint256 => mapping(address => ProposalLib.Vote)) public proposalVotes;
    mapping(uint256 => ProposalLib.ProposalMetadata) public proposalMetadata;
    
    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string title,
        string description,
        uint256 startTime,
        uint256 endTime
    );
    
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        ProposalLib.VoteType vote,
        uint256 weight,
        bool isAgentVote
    );
    
    event AgentVoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        ProposalLib.VoteType vote,
        uint256 weight,
        string reason
    );
    
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCancelled(uint256 indexed proposalId);
    event ProposalThresholdUpdated(uint256 oldThreshold, uint256 newThreshold);
    event QuorumUpdated(uint256 oldQuorum, uint256 newQuorum);
    
    // Modifiers
    modifier onlyTokenHolder() {
        require(governanceToken.balanceOf(msg.sender) > 0, "Must hold governance tokens");
        _;
    }
    
    modifier proposalExists(uint256 proposalId) {
        require(proposalId <= _proposalIds.current() && proposalId > 0, "Proposal does not exist");
        _;
    }
    
    modifier onlyProposer(uint256 proposalId) {
        require(proposals[proposalId].proposer == msg.sender, "Not the proposer");
        _;
    }
    
    constructor(
        address _agentRegistry,
        address _governanceToken,
        address _agentAddress
    ) OnlyAgent(_agentAddress) {
        require(_agentRegistry != address(0), "Invalid agent registry");
        require(_governanceToken != address(0), "Invalid governance token");
        
        agentRegistry = IAgentRegistry(_agentRegistry);
        governanceToken = IGovernanceToken(_governanceToken);
    }
    
    /**
     * @dev Create a new proposal
     */
    function createProposal(
        string memory title,
        string memory description,
        string memory contentHash,
        ProposalLib.ProposalType proposalType,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory descriptionHash
    ) external onlyTokenHolder whenNotPaused returns (uint256) {
        require(
            governanceToken.balanceOf(msg.sender) >= proposalThreshold,
            "Insufficient tokens for proposal"
        );
        
        require(
            targets.length == values.length && targets.length == calldatas.length,
            "Proposal function information mismatch"
        );
        
        _proposalIds.increment();
        uint256 proposalId = _proposalIds.current();
        
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + VOTING_PERIOD;
        uint256 executionTime = endTime + EXECUTION_DELAY;
        
        // Create proposal using library
        proposals[proposalId] = ProposalLib.createProposal(
            proposalId,
            msg.sender,
            startTime,
            endTime,
            executionTime,
            proposalType,
            targets,
            values,
            calldatas
        );
        
        // Store metadata separately to avoid struct size limits
        proposalMetadata[proposalId] = ProposalLib.ProposalMetadata({
            title: title,
            description: description,
            contentHash: contentHash,
            descriptionHash: descriptionHash
        });
        
        emit ProposalCreated(
            proposalId,
            msg.sender,
            title,
            description,
            startTime,
            endTime
        );
        
        return proposalId;
    }
    
    /**
     * @dev Cast a vote directly by token holder
     */
    function vote(
        uint256 proposalId,
        ProposalLib.VoteType voteType
    ) external onlyTokenHolder proposalExists(proposalId) nonReentrant {
        require(
            proposals[proposalId].getState() == ProposalLib.ProposalState.Active,
            "Voting not active"
        );
        require(!proposalVotes[proposalId][msg.sender].hasVoted, "Already voted");
        require(!agentRegistry.isDelegated(msg.sender), "Cannot vote directly when delegated");
        
        uint256 weight = governanceToken.getVotingPower(msg.sender);
        require(weight > 0, "No voting power");
        
        // Record vote
        proposalVotes[proposalId][msg.sender] = ProposalLib.Vote({
            hasVoted: true,
            vote: voteType,
            weight: weight,
            isAgentVote: false,
            timestamp: block.timestamp
        });
        
        // Update proposal vote counts
        proposals[proposalId].updateVoteCounts(voteType, weight);
        
        emit VoteCast(proposalId, msg.sender, voteType, weight, false);
    }
    
    /**
     * @dev Cast votes on behalf of users (only callable by authorized agent)
     */
    function voteByAgent(
        uint256 proposalId,
        address[] memory voters,
        ProposalLib.VoteType[] memory votes,
        string[] memory reasons
    ) external onlyAgent proposalExists(proposalId) nonReentrant {
        require(voters.length == votes.length, "Arrays length mismatch");
        require(voters.length == reasons.length, "Reasons length mismatch");
        require(
            proposals[proposalId].getState() == ProposalLib.ProposalState.Active,
            "Voting not active"
        );
        
        for (uint256 i = 0; i < voters.length; i++) {
            address voter = voters[i];
            ProposalLib.VoteType voteType = votes[i];
            
            // Validate voter eligibility
            require(agentRegistry.isDelegated(voter), "Voter not delegated");
            require(!proposalVotes[proposalId][voter].hasVoted, "Voter already voted");
            
            uint256 weight = governanceToken.getVotingPower(voter);
            if (weight == 0) continue; // Skip voters with no voting power
            
            // Record vote
            proposalVotes[proposalId][voter] = ProposalLib.Vote({
                hasVoted: true,
                vote: voteType,
                weight: weight,
                isAgentVote: true,
                timestamp: block.timestamp
            });
            
            // Update proposal vote counts
            proposals[proposalId].updateVoteCounts(voteType, weight);
            
            emit AgentVoteCast(proposalId, voter, voteType, weight, reasons[i]);
            emit VoteCast(proposalId, voter, voteType, weight, true);
        }
    }
    
    /**
     * @dev Execute a successful proposal
     */
    function executeProposal(uint256 proposalId) 
        external 
        proposalExists(proposalId) 
        nonReentrant 
    {
        require(
            proposals[proposalId].getState() == ProposalLib.ProposalState.Succeeded,
            "Proposal not succeeded"
        );
        require(
            block.timestamp >= proposals[proposalId].executionTime,
            "Execution delay not met"
        );
        
        proposals[proposalId].executed = true;
        
        // Execute all calls in the proposal
        ProposalLib.Proposal storage proposal = proposals[proposalId];
        for (uint256 i = 0; i < proposal.targets.length; i++) {
            (bool success, bytes memory returnData) = proposal.targets[i].call{
                value: proposal.values[i]
            }(proposal.calldatas[i]);
            
            if (!success) {
                if (returnData.length > 0) {
                    assembly {
                        let returnDataSize := mload(returnData)
                        revert(add(32, returnData), returnDataSize)
                    }
                } else {
                    revert("Proposal execution failed");
                }
            }
        }
        
        emit ProposalExecuted(proposalId);
    }
    
    /**
     * @dev Cancel a proposal (only by proposer or owner)
     */
    function cancelProposal(uint256 proposalId) 
        external 
        proposalExists(proposalId) 
    {
        require(
            msg.sender == proposals[proposalId].proposer || msg.sender == owner(),
            "Not authorized to cancel"
        );
        
        ProposalLib.ProposalState state = proposals[proposalId].getState();
        require(
            state == ProposalLib.ProposalState.Pending || 
            state == ProposalLib.ProposalState.Active,
            "Cannot cancel"
        );
        
        proposals[proposalId].cancelled = true;
        emit ProposalCancelled(proposalId);
    }
    
    /**
     * @dev Override agent vote (allows user to vote directly, canceling agent vote)
     */
    function overrideAgentVote(
        uint256 proposalId,
        ProposalLib.VoteType voteType
    ) external onlyTokenHolder proposalExists(proposalId) nonReentrant {
        require(
            proposals[proposalId].getState() == ProposalLib.ProposalState.Active,
            "Voting not active"
        );
        require(agentRegistry.isDelegated(msg.sender), "Not delegated to agent");
        
        uint256 weight = governanceToken.getVotingPower(msg.sender);
        require(weight > 0, "No voting power");
        
        // If agent already voted, reverse those votes
        if (proposalVotes[proposalId][msg.sender].hasVoted) {
            ProposalLib.VoteType oldVote = proposalVotes[proposalId][msg.sender].vote;
            proposals[proposalId].reverseVoteCounts(oldVote, weight);
        }
        
        // Record new vote
        proposalVotes[proposalId][msg.sender] = ProposalLib.Vote({
            hasVoted: true,
            vote: voteType,
            weight: weight,
            isAgentVote: false,
            timestamp: block.timestamp
        });
        
        // Update proposal vote counts
        proposals[proposalId].updateVoteCounts(voteType, weight);
        
        emit VoteCast(proposalId, msg.sender, voteType, weight, false);
    }
    
    // View functions
    function getProposalState(uint256 proposalId) 
        external 
        view 
        proposalExists(proposalId) 
        returns (ProposalLib.ProposalState) 
    {
        return proposals[proposalId].getState();
    }
    
    function getProposal(uint256 proposalId) 
        external 
        view 
        proposalExists(proposalId) 
        returns (ProposalLib.Proposal memory) 
    {
        return proposals[proposalId];
    }
    
    function getProposalMetadata(uint256 proposalId)
        external
        view
        proposalExists(proposalId)
        returns (ProposalLib.ProposalMetadata memory)
    {
        return proposalMetadata[proposalId];
    }
    
    function getVote(uint256 proposalId, address voter) 
        external 
        view 
        returns (ProposalLib.Vote memory) 
    {
        return proposalVotes[proposalId][voter];
    }
    
    function getCurrentProposalId() external view returns (uint256) {
        return _proposalIds.current();
    }
    
    function quorumReached(uint256 proposalId) 
        external 
        view 
        proposalExists(proposalId) 
        returns (bool) 
    {
        return proposals[proposalId].quorumReached(
            governanceToken.totalSupply(),
            quorumPercentage
        );
    }
    
    // Admin functions
    function setProposalThreshold(uint256 newThreshold) external onlyOwner {
        uint256 oldThreshold = proposalThreshold;
        proposalThreshold = newThreshold;
        emit ProposalThresholdUpdated(oldThreshold, newThreshold);
    }
    
    function setQuorumPercentage(uint256 newQuorum) external onlyOwner {
        require(newQuorum <= 10000, "Quorum too high");
        uint256 oldQuorum = quorumPercentage;
        quorumPercentage = newQuorum;
        emit QuorumUpdated(oldQuorum, newQuorum);
    }
    
    // Emergency functions
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // Allow contract to receive ETH for proposal execution
    receive() external payable {}
}