// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/INabeEmitter.sol";
import "./interfaces/INabe.sol";
import "./interfaces/IAirdropPool.sol";

contract AirdropPool is Ownable, IAirdropPool {

    INabeEmitter public immutable nabeEmitter;
    INabe public immutable nabe;
    uint256 public override immutable pid;

    constructor(
        INabeEmitter _nabeEmitter,
        uint256 _pid
    ) {
        nabeEmitter = _nabeEmitter;
        nabe = _nabeEmitter.nabe();
        pid = _pid;
    }

    function take() onlyOwner override external {
        nabeEmitter.updatePool(pid);
        nabe.transfer(msg.sender, nabe.balanceOf(address(this)));
    }
}