// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import { LPToken } from "./LPToken.sol";

contract StakingPool {

    LPToken public lpToken;

    constructor(LPToken _lpToken) public {
        lpToken = _lpToken;        
    }

    function stake(uint stakeAmount) public returns (bool) {
        // Staked-token (LP tokens) is transferred from msg.sender to this contract
        lpToken.transferFrom(msg.sender, address(this), stakeAmount);        
    }

    function unstake(uint unstakeAmount) public returns (bool) {
        // Staked-token (LP tokens) is transferred from msg.sender to this contract
        lpToken.transferFrom(msg.sender, address(this), unstakeAmount);
    }

}
