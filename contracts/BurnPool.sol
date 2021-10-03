// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./interfaces/IBurnPool.sol";
import "./interfaces/INabe.sol";

contract BurnPool is IBurnPool {

    INabe public nabe;

    constructor(INabe _nabe) {
        nabe = _nabe;
    }

    function burn() override external {
        nabe.burn(nabe.balanceOf(address(this)));
    }
}