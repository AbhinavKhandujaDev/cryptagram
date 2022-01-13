// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract Transfer {
    string public constant name = "Transfer";
    mapping(address => bool) private approvals;
    mapping(address => uint) private amount;

    function approve(address to, uint amt) external returns(bool) {
        approvals[to] = true;
        amount[to] = amt;
        return true;
    }

    function transfer(address payable to) public payable {
        require(amount[to] == msg.value, "Transaction amount is not approved");
        require(approvals[to], "Transaction to this address is not approved");
        (bool sent, ) = to.call{value: msg.value}("");
        require(sent, "Transaction failed");

        delete approvals[to];
    }
}