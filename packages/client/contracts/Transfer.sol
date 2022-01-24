// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract Transfer {
    string public constant name = "Transfer";
    struct SupportObj {
        address to;
        uint amount;
    }
    mapping(address => bool) private approvals;
    mapping(address => uint) private amount;
    mapping(string => mapping(string => SupportObj)) private supportMap;

    event PostTipped(string from, string post);

    function approve(address to, uint amt) external returns(bool) {
        approvals[to] = true;
        amount[to] = amt;
        return approvals[to];
    }
    
    function getSupportStatus(string memory postId, string memory userId) view external returns(SupportObj memory) {
        return supportMap[postId][userId];
    }

    function transfer(address payable to, string memory userId, string memory postId) public payable returns(bool) {
        require(bytes(postId).length != 0, "Post Id not found");
        require(bytes(userId).length != 0, "User Id not found");
        require(supportMap[postId][userId].amount == 0, "Already supported");

        supportMap[postId][userId] = SupportObj(to, msg.value);
        (bool sent, ) = to.call{value: msg.value}("");

        emit PostTipped(userId, postId);
        return sent;
    }
}