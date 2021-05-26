// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // If this script is run directly using `node` you may want to call compile 
    // manually to make sure everything is compiled
    // await hre.run('compile');

    // Deploy FundLimitsOracle
    const FundLimitsOracle = await hre.ethers.getContractFactory("FundLimitsOracle");
    const fundLimitsOracle = await FundLimitsOracle.deploy();
    await fundLimitsOracle.deployed();
    console.log("FundLimitsOracle deployed to:", fundLimitsOracle.address);

    // Deploy ERC1155ERC721
    const ERC1155ERC721 = await hre.ethers.getContractFactory("ERC1155ERC721");
    const erc1155721 = await ERC1155ERC721.deploy();
    await erc1155721.deployed();
    console.log("ERC1155ERC721 deployed to:", erc1155721.address);

    //Deploy LocalOracle
    const LocalOracle = await hre.ethers.getContractFactory("LocalOracle");
    const localOracle = await LocalOracle.deploy();
    await localOracle.deployed();
    console.log("LocalOracle deployed to:", localOracle.address);

    //Deploy VoucherKernel
    const VoucherKernel = await hre.ethers.getContractFactory("VoucherKernel");
    const voucherKernel = await VoucherKernel.deploy(erc1155721.address);
    await voucherKernel.deployed();
    console.log("VoucherKernel deployed to:", voucherKernel.address);

    //Deploy Cashier
    const Cashier = await hre.ethers.getContractFactory("Cashier");
    const cashier = await Cashier.deploy(voucherKernel.address);
    await cashier.deployed();
    console.log("Cashier deployed to:", cashier.address);

    //Deploy BosonRouter
    const BosonRouter = await hre.ethers.getContractFactory("BosonRouter");
    const bosonRouter = await BosonRouter.deploy(voucherKernel.address, fundLimitsOracle.address, cashier.address);
    await bosonRouter.deployed();
    console.log("BosonRouter deployed to:", bosonRouter.address);

    //Call admin functions
    const promises = [];
    console.log("$ Setting initial values ...");
    await erc1155721.setApprovalForAll(voucherKernel.address, 'true').then((tx) => {
        promises.push(tx.wait());
        console.log("\n$ ERC1155ERC721 approved VoucherKernel");
    });
    await erc1155721.setLocalOracleAddress(localOracle.address).then((tx) => {
        promises.push(tx.wait());
        console.log("\n$ ERC1155ERC721 set LocalOracle");
    });

    await erc1155721.setVoucherKernelAddress(voucherKernel.address).then((tx) => {
        promises.push(tx.wait());
        console.log("\n$ ERC1155ERC721 set VoucherKernel address");
    });

    await erc1155721.setCashierAddress(cashier.address).then((tx) => {
        promises.push(tx.wait());
        console.log("\n$ ERC1155ERC721 set Cashier address");
    });

    await voucherKernel.setBosonRouterAddress(bosonRouter.address).then((tx) => {
        promises.push(tx.wait());
        console.log("\n$ VoucherKernel set BosonRouter address");
    });

    await voucherKernel.setCashierAddress(cashier.address).then((tx) => {
        promises.push(tx.wait());
        console.log("\n$ VoucherKernel set Cashier address");
    });

    await cashier.setBosonRouterAddress(bosonRouter.address).then((tx) => {
        promises.push(tx.wait());
        console.log("\n$ Cashier set BosonRouter address");
    });

    await cashier.setTokenContractAddress(erc1155721.address).then((tx) => {
        promises.push(tx.wait());
        console.log("\n$ Cashier set token contract address");
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