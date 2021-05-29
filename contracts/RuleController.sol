// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import { StakingNFTBadgeFor3MonthsFactory } from "./StakingNFTBadgeFor3MonthsFactory.sol";
import { StakingNFTBadgeFor6MonthsFactory } from "./StakingNFTBadgeFor6MonthsFactory.sol";
import { StakingNFTBadgeFor1YearFactory } from "./StakingNFTBadgeFor1YearFactory.sol";

/**
 * @notice - Controller of rule for duration of SNX Staking: 3 months, 6 months, 1 year..
 * @notice - Set up conditions to create a NFT
 */
contract RuleController {

    StakingNFTBadgeFor3MonthsFactory public badgeFor3MonthsFactory;
    StakingNFTBadgeFor6MonthsFactory public badgeFor6MonthsFactory;
    StakingNFTBadgeFor1YearFactory public badgeFor1YearFactory;

    constructor(
        StakingNFTBadgeFor3MonthsFactory _badgeFor3MonthsFactory, 
        StakingNFTBadgeFor6MonthsFactory _badgeFor6MonthsFactory, 
        StakingNFTBadgeFor1YearFactory _badgeFor1YearFactory
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
        badgeFor3MonthsFactory.createStakingNFTBadgeFor3Months(to, tokenURI);
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
        badgeFor6MonthsFactory.createStakingNFTBadgeFor6Months(to, tokenURI);
    }

    /**
     * @notice - Stake SNX tokens into Synthetix
     * @notice - Staking period is for 1 year
     */
    function stakeFor1Year(address to, string memory tokenURI, uint stakeAmount) public returns (bool) {
        // [Todo]: TransferFrom staked-token (SNX tokens)
        //snx.transferFromAndSettle(msg.sender, address(this), stakeAmount);

        // [Todo]: Put staking method from Synthetix's interface into here
        //stakingRewards.stake(stakeAmount);

        // Distribute NFT that represent stake for 1 year
        badgeFor1YearFactory.createStakingNFTBadgeFor1Year(to, tokenURI);
    }

}
