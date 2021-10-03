// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./FungibleToken.sol";
import "./interfaces/INabe.sol";
import "./interfaces/INabeEmitter.sol";

contract Nabe is FungibleToken, INabe {
    INabeEmitter public emitter;

    constructor() FungibleToken("Nabe", "NABE", "1") {
        emitter = INabeEmitter(msg.sender);
    }

    modifier onlyEmitter {
        require(msg.sender == address(emitter));
        _;
    }

    function mint(address to, uint256 amount) onlyEmitter external override {
        _mint(to, amount);
    }

    function burn(uint256 amount) external override {
        _burn(msg.sender, amount);
    }
}