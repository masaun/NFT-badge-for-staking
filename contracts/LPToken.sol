// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LPToken is ERC20 {
    constructor(uint256 initialSupply) public ERC20("UNI-V2-LP Mock Token", "UNI-V2") {
        _mint(msg.sender, initialSupply);
    }
}
