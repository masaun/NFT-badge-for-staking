// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LPToken is ERC20 {
    constructor() public ERC20("UNI-V2-LP Mock Token", "UNI-V2") {
        uint256 initialSupply = 1e8 * 1e18;  // 1 milion
        _mint(msg.sender, initialSupply);
    }
}
