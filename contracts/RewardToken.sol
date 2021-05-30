// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RewardToken is ERC20 {
    constructor() public ERC20("Reward Token", "RWT") {
        uint256 initialSupply = 1e8 * 1e18;  // 1 milion
        _mint(msg.sender, initialSupply);
    }
}
