const StakingPool = artifacts.require("StakingPool")
const LPToken = artifacts.require("LPToken")

const LP_TOKEN = LPToken.address

module.exports = async function(deployer) {
    await deployer.deploy(StakingPool, LP_TOKEN)
}
