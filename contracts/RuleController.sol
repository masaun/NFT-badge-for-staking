// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import { SynthetixStakingNFTBadgeFor3MonthsFactory } from "./SynthetixStakingNFTBadgeFor3MonthsFactory.sol";
import { SynthetixStakingNFTBadgeFor6MonthsFactory } from "./SynthetixStakingNFTBadgeFor6MonthsFactory.sol";
import { SynthetixStakingNFTBadgeFor1YearFactory } from "./SynthetixStakingNFTBadgeFor1YearFactory.sol";

/**
 * @notice - Controller of rule for duration of SNX Staking: 3 months, 6 months, 1 year..
 * @notice - Set up conditions to create a NFT
 */
contract RuleController {

    SynthetixStakingNFTBadgeFor3MonthsFactory public badgeFor3MonthsFactory;
    SynthetixStakingNFTBadgeFor6MonthsFactory public badgeFor6MonthsFactory;
    SynthetixStakingNFTBadgeFor1YearFactory public badgeFor1YearFactory;

    constructor(
        SynthetixStakingNFTBadgeFor3MonthsFactory _badgeFor3MonthsFactory, 
        SynthetixStakingNFTBadgeFor6MonthsFactory _badgeFor6MonthsFactory, 
        SynthetixStakingNFTBadgeFor1YearFactory _badgeFor1YearFactory
    ) public {
        badgeFor3MonthsFactory = _badgeFor3MonthsFactory;
        badgeFor6MonthsFactory = _badgeFor6MonthsFactory;
        badgeFor1YearFactory = _badgeFor1YearFactory;
    }

    /**
     * @notice - Stake SNX tokens into Synthetix
     * @notice - Staking period is for 3 months
     */
    function stakeFor3Months(address to, string memory tokenURI, uint stakeAmount) public payable returns (bool) {
        // [Todo]: TransferFrom staked-token (SNX tokens)
        //snx.transferFromAndSettle(msg.sender, address(this), stakeAmount);

        // [Todo]: Put staking method from Synthetix's interface into here
        //stakingRewards.stake(stakeAmount);

        // Distribute NFT that represent stake for 3 months
        badgeFor3MonthsFactory.createSynthetixStakingNFTBadgeFor3Months(to, tokenURI);
    }

    /**
     * @notice - Stake SNX tokens into Synthetix
     * @notice - Staking period is for 6 months
     */
    function stakeFor6Months(address to, string memory tokenURI, uint stakeAmount) public returns (bool) {
        // [Todo]: TransferFrom staked-token (SNX tokens)
        //snx.transferFromAndSettle(msg.sender, address(this), stakeAmount);

        // [Todo]: Put staking method from Synthetix's interface into here
        //stakingRewards.stake(stakeAmount);

        // Distribute NFT that represent stake for 6 months
        badgeFor6MonthsFactory.createSynthetixStakingNFTBadgeFor6Months(to, tokenURI);
    }

    /**
     * @notice - Stake SNX tokens into Synthetix
     * @notice - Staking period is for 1 year
     */
    function stakeFor1Year(address to, string memory tokenURI, uint stakeAmount) public returns (bool) {
        // [Todo]: TransferFrom staked-token (SNX tokens)
        //snx.transferFromAndSettle(msg.sender, address(this), stakeAmount);

        // Put staking method from Synthetix's interface into here
        stakingRewards.stake(stakeAmount);

        // Distribute NFT that represent stake for 1 year
        badgeFor1YearFactory.createSynthetixStakingNFTBadgeFor1Year(to, tokenURI);
    }

}
