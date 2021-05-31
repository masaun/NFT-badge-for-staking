const Fancet = artifacts.require("Fancet")
const LPToken = artifacts.require("LPToken")
const RewardToken = artifacts.require("RewardToken")

const lpToken = LPToken.address
const rewardToken = RewardToken.address

module.exports = async function(deployer) {
    await deployer.deploy(Fancet, lpToken, rewardToken)
}
