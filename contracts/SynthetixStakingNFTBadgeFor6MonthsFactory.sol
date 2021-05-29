// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import { SynthetixStakingNFTBadgeFor6Months } from "./SynthetixStakingNFTBadgeFor6Months.sol";

contract SynthetixStakingNFTBadgeFor6MonthsFactory {

    event BadgeFor6MonthsCreated(SynthetixStakingNFTBadgeFor6Months indexed badgeFor6Months);

    constructor() public {}

    function createSynthetixStakingNFTBadgeFor6Months(address to, string memory tokenURI) public returns (bool) {
        SynthetixStakingNFTBadgeFor6Months badge = new SynthetixStakingNFTBadgeFor6Months(to, tokenURI);

        emit BadgeFor6MonthsCreated(badge);
    }

}
