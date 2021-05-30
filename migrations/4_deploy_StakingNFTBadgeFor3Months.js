const StakingNFTBadgeFor3Months = artifacts.require("StakingNFTBadgeFor3Months")

module.exports = async function(deployer) {
    await deployer.deploy(StakingNFTBadgeFor3Months)
}
