// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import { StakingNFTBadgeFor6Months } from "./StakingNFTBadgeFor6Months.sol";

contract StakingNFTBadgeFor6MonthsFactory {

    event BadgeFor6MonthsCreated(StakingNFTBadgeFor6Months indexed badgeFor6Months);

    constructor() public {}

    function createStakingNFTBadgeFor6Months(address to, string memory tokenURI) public returns (bool) {
        StakingNFTBadgeFor6Months badge = new StakingNFTBadgeFor6Months(to, tokenURI);

        emit BadgeFor6MonthsCreated(badge);
    }

}
