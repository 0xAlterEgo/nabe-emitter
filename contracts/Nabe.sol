// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./FungibleToken.sol";
import "./interfaces/INabe.sol";

contract Nabe is Ownable, FungibleToken, INabe {

    address public emitter;

    constructor() FungibleToken("Nabe", "NABE", "1") {
        _mint(msg.sender, 3000 * 1e18);
    }

    function setEmitter(address _emitter) external onlyOwner {
        emitter = _emitter;
    }

    modifier onlyEmitter() {
        require(msg.sender == emitter);
        _;
    }

    function mint(address to, uint256 amount) onlyEmitter external override {
        _mint(to, amount);
    }

    function burn(uint256 amount) external override {
        _burn(msg.sender, amount);
    }
}