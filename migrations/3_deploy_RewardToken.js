const RewardToken = artifacts.require("RewardToken")

module.exports = async function(deployer) {
    await deployer.deploy(RewardToken)
}
