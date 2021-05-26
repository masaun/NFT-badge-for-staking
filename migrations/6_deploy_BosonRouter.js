const BosonRouter = artifacts.require("BosonRouter")
const VoucherKernel = artifacts.require("VoucherKernel")
const FundLimitsOracle = artifacts.require("FundLimitsOracle")
const Cashier = artifacts.require("Cashier")

const voucherKernel = VoucherKernel.address
const fundLimitsOracle = FundLimitsOracle.address
const cashier = Cashier.address

module.exports = async function(deployer) {
    await deployer.deploy(BosonRouter, voucherKernel, fundLimitsOracle, cashier)
}
