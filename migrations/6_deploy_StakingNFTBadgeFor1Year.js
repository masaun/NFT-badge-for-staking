const StakingNFTBadgeFor1Year = artifacts.require("StakingNFTBadgeFor1Year")

module.exports = async function(deployer) {
    await deployer.deploy(StakingNFTBadgeFor1Year)
}
