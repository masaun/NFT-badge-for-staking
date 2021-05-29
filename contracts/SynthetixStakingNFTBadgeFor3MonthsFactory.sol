// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import { SynthetixStakingNFTBadgeFor3Months } from "./SynthetixStakingNFTBadgeFor3Months.sol";

contract SynthetixStakingNFTBadgeFor3MonthsFactory {

    event BadgeFor3MonthsCreated(SynthetixStakingNFTBadgeFor3Months indexed badgeFor3Months);
 
    constructor() public {}

    function createSynthetixStakingNFTBadgeFor3Months(address to, string memory tokenURI) public returns (bool) {
        SynthetixStakingNFTBadgeFor3Months badge = new SynthetixStakingNFTBadgeFor3Months(to, tokenURI);

        emit BadgeFor3MonthsCreated(badge);
    }

}
