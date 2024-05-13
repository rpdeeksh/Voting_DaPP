// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {
    // Struct to represent a candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Array of candidates
    Candidate[] public candidates;

    // Mapping to keep track of who voted
    mapping(address => bool) public voters;

    // Event to notify when a vote is cast
    event Voted(address indexed _voter, uint indexed _candidateId);

    // Time when results can be published
    uint public publishTime;

    // Constructor to initialize candidates and set publish time
    constructor(string[] memory _candidateNames, uint _hoursAfterVoting) {
        for (uint i = 0; i < _candidateNames.length; i++) {
            candidates.push(Candidate({
                id: i + 1,
                name: _candidateNames[i],
                voteCount: 0
            }));
        }
        publishTime = block.timestamp + (_hoursAfterVoting * 1 minutes);
    }

    // Function to vote for a candidate
    function vote(uint _candidateId) public {
        require(_candidateId > 0 && _candidateId <= candidates.length, "Invalid candidate ID");
        require(!voters[msg.sender], "You have already voted");

        voters[msg.sender] = true;
        candidates[_candidateId - 1].voteCount++;

        emit Voted(msg.sender, _candidateId);
    }

    // Function to get candidate details by ID
    function getCandidate(uint _candidateId) public view returns (uint, string memory, uint) {
        require(_candidateId > 0 && _candidateId <= candidates.length, "Invalid candidate ID");

        Candidate memory candidate = candidates[_candidateId - 1];
        return (candidate.id, candidate.name, candidate.voteCount);
    }

    // Function to get details of all candidates
    function getAllCandidateDetails() public view returns (uint[] memory, string[] memory) {
        uint length = candidates.length;
        uint[] memory ids = new uint[](length);
        string[] memory names = new string[](length);

        for (uint i = 0; i < length; i++) {
            ids[i] = candidates[i].id;
            names[i] = candidates[i].name;
        }

        return (ids, names);
    }

    // Function to check if results can be published
    function canPublishResults() public view returns (bool) {
        return block.timestamp >= publishTime;
    }

    // Function to get remaining time until results can be published
    function getRemainingTime() public view returns (uint) {
        if (block.timestamp >= publishTime) {
            return 0;
        } else {
            return publishTime - block.timestamp;
        }
    }

    // Function to publish results
    function publishResults() public view returns (string memory) {
        require(canPublishResults(), "Results cannot be published yet");

        string memory results;
        for (uint i = 0; i < candidates.length; i++) {
            results = string(abi.encodePacked(results, candidates[i].name, ": ", toString(candidates[i].voteCount), "\n"));
        }
        return results;
    }

    // Function to convert uint to string
    function toString(uint value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint temp = value;
        uint digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
