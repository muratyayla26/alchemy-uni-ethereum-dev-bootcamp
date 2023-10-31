// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

interface Winner {
    function attempt() external;
}

contract TriggerContract {
    function callWinner(address winner) external {
        Winner(winner).attempt();
    }
}
