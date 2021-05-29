// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import { SynthetixStakingNFTBadgeFor1Year } from "./SynthetixStakingNFTBadgeFor1Year.sol";

contract SynthetixStakingNFTBadgeFor1YearFactory {

    event BadgeFor1YearCreated(SynthetixStakingNFTBadgeFor1Year indexed badgeFor1Year);

    constructor() public {}

    function createSynthetixStakingNFTBadgeFor1Year(address to, string memory tokenURI) public returns (bool) {
        SynthetixStakingNFTBadgeFor1Year badge = new SynthetixStakingNFTBadgeFor1Year(to, tokenURI);

        emit BadgeFor1YearCreated(badge);
    }

}
