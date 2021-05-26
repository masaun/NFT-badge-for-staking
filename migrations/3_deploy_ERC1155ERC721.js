const ERC1155ERC721 = artifacts.require("ERC1155ERC721")

module.exports = async function(deployer) {
    await deployer.deploy(ERC1155ERC721)
}
