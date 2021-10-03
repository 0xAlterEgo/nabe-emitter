// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./FungibleToken.sol";

contract DevFundToken is FungibleToken {

    constructor() FungibleToken("Nabe Dev Fund Token", "NABEDEV", "1") {
        _mint(msg.sender, 100 * 1e18);
    }
}
