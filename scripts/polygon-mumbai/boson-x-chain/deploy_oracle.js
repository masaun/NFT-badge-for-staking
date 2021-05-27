// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

const erc1155721Address = {
    ganache: '0xbf5753e5b6fC7617E4cD27011E9FaB47A3AAB1ae',
    mumbai: '0x2D750240d3d392C5C55300a7596B5eA404f3D98C',
    goerli: ''
}

async function main() {

    // Attach ERC1155ERC721
    const ERC1155ERC721 = await hre.ethers.getContractFactory("ERC1155ERC721");
    const erc1155721 = ERC1155ERC721.attach(erc1155721Address[hre.network.name]);
    await erc1155721.deployed();
    console.log("ERC1155ERC721 deployed to:", erc1155721.address);

    //Deploy LocalOracle
    const LocalOracle = await hre.ethers.getContractFactory("LocalOracle");
    const localOracle = await LocalOracle.deploy();
    await localOracle.deployed();
    console.log("LocalOracle deployed to:", localOracle.address);

    //Call admin functions
    const promises = [];
    console.log("$ Setting initial values ...");

    await erc1155721.setLocalOracleAddress(localOracle.address).then((tx) => {
        promises.push(tx.wait());
        console.log("\n$ ERC1155ERC721 set LocalOracle");
    });

    await localOracle.setERC1155(erc1155721.address).then((tx) => {
        promises.push(tx.wait());
        console.log("\n$ LocalOracle set token contract address");
    });

    console.log('\n...');
    await Promise.all(promises);
    console.log('\n$ All done !');

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });