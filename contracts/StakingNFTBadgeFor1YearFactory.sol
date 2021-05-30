// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import { StakingNFTBadgeFor1Year } from "./StakingNFTBadgeFor1Year.sol";

contract StakingNFTBadgeFor1YearFactory {

    event BadgeFor1YearCreated(StakingNFTBadgeFor1Year indexed badgeFor1Year);

    constructor() public {}

    function createStakingNFTBadgeFor1Year(address to, string memory tokenURI) public returns (bool) {
        StakingNFTBadgeFor1Year badge = new StakingNFTBadgeFor1Year(to, tokenURI);

        emit BadgeFor1YearCreated(badge);
    }

}
