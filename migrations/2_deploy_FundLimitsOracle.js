const FundLimitsOracle = artifacts.require("FundLimitsOracle")

module.exports = async function(deployer) {
    await deployer.deploy(FundLimitsOracle)
}
