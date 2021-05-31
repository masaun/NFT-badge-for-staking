const StakingManager = artifacts.require("StakingManager")
const LPToken = artifacts.require("LPToken")
const RewardToken = artifacts.require("RewardToken")
const StakingPool = artifacts.require("StakingPool")
const StakingNFTBadgeFor3Months = artifacts.require("StakingNFTBadgeFor3Months")
const StakingNFTBadgeFor6Months = artifacts.require("StakingNFTBadgeFor6Months")
const StakingNFTBadgeFor1Year = artifacts.require("StakingNFTBadgeFor1Year")

const LP_TOKEN = LPToken.address
const REWARD_TOKEN = RewardToken.address
const STAKING_POOL = StakingPool.address
const STAKING_NFT_BADGE_FOR_3_MONTHS = StakingNFTBadgeFor3Months.address
const STAKING_NFT_BADGE_FOR_6_MONTHS = StakingNFTBadgeFor6Months.address
const STAKING_NFT_BADGE_FOR_1_YEAR = StakingNFTBadgeFor1Year.address

module.exports = async function(deployer) {
    await deployer.deploy(StakingManager, 
                          LP_TOKEN, 
                          REWARD_TOKEN, 
                          STAKING_POOL, 
                          STAKING_NFT_BADGE_FOR_3_MONTHS, 
                          STAKING_NFT_BADGE_FOR_6_MONTHS, 
                          STAKING_NFT_BADGE_FOR_1_YEAR)
}
