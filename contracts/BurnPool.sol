// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./interfaces/INabeEmitter.sol";
import "./interfaces/INabe.sol";
import "./interfaces/IBurnPool.sol";

contract BurnPool is IBurnPool {

    INabeEmitter public immutable nabeEmitter;
    INabe public immutable nabe;
    uint256 public override immutable pid;

    constructor(
        INabeEmitter _nabeEmitter,
        INabe _nabe,
        uint256 _pid
    ) {
        nabeEmitter = _nabeEmitter;
        nabe = _nabe;
        pid = _pid;
    }

    function burn() override external {
        nabeEmitter.updatePool(pid);
        nabe.burn(nabe.balanceOf(address(this)));
    }
}