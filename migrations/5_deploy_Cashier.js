const Cashier = artifacts.require("Cashier")
const VoucherKernel = artifacts.require("VoucherKernel")

const voucherKernel = VoucherKernel.address

module.exports = async function(deployer) {
    await deployer.deploy(Cashier, voucherKernel)
}
