// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct VoteRecord {
        string electionId;
        string voterId;
        string candidate;
        uint256 timestamp;
    }

    VoteRecord[] public votes;

    event VoteCast(string indexed electionId, string indexed voterId, string candidate, uint256 timestamp);

    function castVote(string memory _electionId, string memory _voterId, string memory _candidate) public {
        votes.push(VoteRecord({
            electionId: _electionId,
            voterId: _voterId,
            candidate: _candidate,
            timestamp: block.timestamp
        }));

        emit VoteCast(_electionId, _voterId, _candidate, block.timestamp);
    }

    function getVotesCount() public view returns (uint256) {
        return votes.length;
    }
}
