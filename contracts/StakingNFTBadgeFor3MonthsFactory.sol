// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import { StakingNFTBadgeFor3Months } from "./StakingNFTBadgeFor3Months.sol";

contract StakingNFTBadgeFor3MonthsFactory {

    event BadgeFor3MonthsCreated(StakingNFTBadgeFor3Months indexed badgeFor3Months);
 
    constructor() public {}

    function createStakingNFTBadgeFor3Months(address to, string memory tokenURI) public returns (bool) {
        StakingNFTBadgeFor3Months badge = new StakingNFTBadgeFor3Months(to, tokenURI);

        emit BadgeFor3MonthsCreated(badge);
    }

}
