const LPToken = artifacts.require("LPToken")

module.exports = async function(deployer) {
    await deployer.deploy(LPToken)
}
