const VoucherKernel = artifacts.require("VoucherKernel")
const ERC1155ERC721 = artifacts.require("ERC1155ERC721")

const erc1155ERC721 = ERC1155ERC721.address

module.exports = async function(deployer) {
    await deployer.deploy(VoucherKernel, erc1155ERC721)
}
