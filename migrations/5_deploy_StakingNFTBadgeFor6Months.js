const StakingNFTBadgeFor6Months = artifacts.require("StakingNFTBadgeFor6Months")

module.exports = async function(deployer) {
    await deployer.deploy(StakingNFTBadgeFor6Months)
}
