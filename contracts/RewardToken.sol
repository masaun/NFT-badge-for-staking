// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RewardToken is ERC20 {
    constructor(uint256 initialSupply) public ERC20("Reward Token", "RWT") {
        _mint(msg.sender, initialSupply);
    }
}
