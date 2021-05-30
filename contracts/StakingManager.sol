// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import { LPToken } from "./LPToken.sol";
import { RewardToken } from "./RewardToken.sol";
import { StakingPool } from "./StakingPool.sol";

import { StakingNFTBadgeFor3Months } from "./StakingNFTBadgeFor3Months.sol";
import { StakingNFTBadgeFor6Months } from "./StakingNFTBadgeFor6Months.sol";
import { StakingNFTBadgeFor1Year } from "./StakingNFTBadgeFor1Year.sol";

/**
 * @notice - Controller of rule for duration of SNX Staking: 3 months, 6 months, 1 year..
 * @notice - Set up conditions to create a NFT
 */
contract StakingManager {

    LPToken public lpToken;
    RewardToken public rewardToken;
    StakingPool public stakingPool;

    StakingNFTBadgeFor3Months public badgeFor3Months;
    StakingNFTBadgeFor6Months public badgeFor6Months;
    StakingNFTBadgeFor1Year public badgeFor1Year;

    constructor(
        LPToken _lpToken,
        RewardToken _rewardToken,
        StakingPool _stakingPool,
        StakingNFTBadgeFor3Months _badgeFor3Months, 
        StakingNFTBadgeFor6Months _badgeFor6Months, 
        StakingNFTBadgeFor1Year _badgeFor1Year
    ) public {
        lpToken = _lpToken;
        rewardToken = _rewardToken;
        stakingPool = _stakingPool;
        badgeFor3Months = _badgeFor3Months;
        badgeFor6Months = _badgeFor6Months;
        badgeFor1Year = _badgeFor1Year;
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
        badgeFor3Months.mintBadge(to, tokenURI);
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
        badgeFor6Months.mintBadge(to, tokenURI);
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
        badgeFor1Year.mintBadge(to, tokenURI);
    }

}
