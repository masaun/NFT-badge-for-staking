// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import { LPToken } from "./LPToken.sol";
import { RewardToken } from "./RewardToken.sol";
import { StakingPool } from "./StakingPool.sol";

import { StakingNFTBadgeFor3MonthsFactory } from "./StakingNFTBadgeFor3MonthsFactory.sol";
import { StakingNFTBadgeFor6MonthsFactory } from "./StakingNFTBadgeFor6MonthsFactory.sol";
import { StakingNFTBadgeFor1YearFactory } from "./StakingNFTBadgeFor1YearFactory.sol";

/**
 * @notice - Controller of rule for duration of SNX Staking: 3 months, 6 months, 1 year..
 * @notice - Set up conditions to create a NFT
 */
contract RuleController {

    LPToken public lpToken;
    RewardToken public rewardToken;
    StakingPool public stakingPool;

    StakingNFTBadgeFor3MonthsFactory public badgeFor3MonthsFactory;
    StakingNFTBadgeFor6MonthsFactory public badgeFor6MonthsFactory;
    StakingNFTBadgeFor1YearFactory public badgeFor1YearFactory;

    constructor(
        LPToken _lpToken,
        RewardToken _rewardToken,
        StakingPool _stakingPool,
        StakingNFTBadgeFor3MonthsFactory _badgeFor3MonthsFactory, 
        StakingNFTBadgeFor6MonthsFactory _badgeFor6MonthsFactory, 
        StakingNFTBadgeFor1YearFactory _badgeFor1YearFactory
    ) public {
        lpToken = _lpToken;
        rewardToken = _rewardToken;
        stakingPool = _stakingPool;
        badgeFor3MonthsFactory = _badgeFor3MonthsFactory;
        badgeFor6MonthsFactory = _badgeFor6MonthsFactory;
        badgeFor1YearFactory = _badgeFor1YearFactory;
    }

    /**
     * @notice - Stake SNX tokens into Synthetix
     * @notice - Staking period is for 3 months
     */
    function stakeFor3Months(address to, string memory tokenURI, uint stakeAmount) public payable returns (bool) {
        // Staked-token (LP tokens) is transferred from msg.sender to this contract
        lpToken.transferFrom(msg.sender, address(this), stakeAmount);

        // Stake LP tokens into the StakingPool contract
        stakingPool.stake(stakeAmount);

        // Distribute NFT that represent stake for 3 months
        badgeFor3MonthsFactory.createStakingNFTBadgeFor3Months(to, tokenURI);
    }

    /**
     * @notice - Stake SNX tokens into Synthetix
     * @notice - Staking period is for 6 months
     */
    function stakeFor6Months(address to, string memory tokenURI, uint stakeAmount) public returns (bool) {
        // Staked-token (LP tokens) is transferred from msg.sender to this contract
        lpToken.transferFrom(msg.sender, address(this), stakeAmount);

        // Stake LP tokens into the StakingPool contract
        stakingPool.stake(stakeAmount);

        // Distribute NFT that represent stake for 6 months
        badgeFor6MonthsFactory.createStakingNFTBadgeFor6Months(to, tokenURI);
    }

    /**
     * @notice - Stake SNX tokens into Synthetix
     * @notice - Staking period is for 1 year
     */
    function stakeFor1Year(address to, string memory tokenURI, uint stakeAmount) public returns (bool) {
        // Staked-token (LP tokens) is transferred from msg.sender to this contract
        lpToken.transferFrom(msg.sender, address(this), stakeAmount);

        // Stake LP tokens into the StakingPool contract
        stakingPool.stake(stakeAmount);

        // Distribute NFT that represent stake for 1 year
        badgeFor1YearFactory.createStakingNFTBadgeFor1Year(to, tokenURI);
    }

}
