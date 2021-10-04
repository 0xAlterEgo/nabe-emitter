// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IAirdropPool {
    function pid() external view returns (uint256);
    function take() external;
}