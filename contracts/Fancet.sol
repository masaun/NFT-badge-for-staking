// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import { LPToken } from "./LPToken.sol";
import { RewardToken } from "./RewardToken.sol";


/**
 * @notice - This is the Fancet contract
 */
contract Fancet {

    LPToken public lpToken;
    RewardToken public rewardToken;

    constructor(LPToken _lpToken, RewardToken _rewardToken) public {
        lpToken = _lpToken;
        rewardToken = _rewardToken;
    }

    function transferLPToken() public returns (bool) {
        uint amount = 1e3 * 1e18;  // 1000
        lpToken.transfer(msg.sender, amount);
    }

    function transferRewardToken() public returns (bool) {
        uint amount = 1e3 * 1e18;  // 1000
        rewardToken.transfer(msg.sender, amount);
    }

}
