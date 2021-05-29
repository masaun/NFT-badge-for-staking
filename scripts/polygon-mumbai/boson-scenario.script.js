require('dotenv').config()
//const Tx = require('ethereumjs-tx').Transaction

/// Web3 instance
const Web3 = require('web3')
const provider = new Web3.providers.HttpProvider(`https://goerli.infura.io/v3/${ process.env.INFURA_KEY }`)
const web3 = new Web3(provider)

/// Hardhat
const hre = require("hardhat")

const constants = require('../../test/test-local/testHelpers/constants');
const timemachine = require('../../test/test-local/testHelpers/timemachine');
const Utils = require('../../test/test-local/testHelpers/utils');
const Users = require('../../test/test-local/testHelpers/users');

/// Import deployed-addresses
const contractAddressList = require("../../migrations/addressesList/contractAddress/contractAddress.js")
const tokenAddressList = require("../../migrations/addressesList/tokenAddress/tokenAddress.js")

/// Artifacts
const ERC1155ERC721 = artifacts.require('ERC1155ERC721');
const VoucherKernel = artifacts.require('VoucherKernel');
const Cashier = artifacts.require('Cashier');
const BosonRouter = artifacts.require('BosonRouter');
const FundLimitsOracle = artifacts.require('FundLimitsOracle');
const LocalOracle = artifacts.require("LocalOracle")
const BN = web3.utils.BN;

/// Global contract instance
let erc1155ERC721
let voucherKernel
let cashier
let bosonRouter
let fundLimitsOracle

/// Global variable for each contract addresses
let ERC1155_ERC721 = contractAddressList["Polygon Mumbai"]["ERC1155ERC721"]
let VOUCHER_KERNEL = contractAddressList["Polygon Mumbai"]["VoucherKernel"]
let CASHIER = contractAddressList["Polygon Mumbai"]["Cashier"]
let BOSON_ROUTER = contractAddressList["Polygon Mumbai"]["BosonRouter"]
let FUND_LIMITS_ORACLE = contractAddressList["Polygon Mumbai"]["FundLimitsOracle"]

let tokenSupplyKey1
let tokenSupplyKey2
let tokenVoucherKey1
let tokenVoucherKey2
let promiseId1
let promiseId2


/// [Note]: For truffle exec (Remarks: Need to use module.exports)
module.exports = function(callback) {
    main().then(() => callback()).catch(err => callback(err))
};


async function main() {
    // Deploy FundLimitsOracle
    const fundLimitsOracle = await FundLimitsOracle.at(FUND_LIMITS_ORACLE);
    console.log("FundLimitsOracle deployed to:", fundLimitsOracle.address);

    // Deploy ERC1155ERC721
    const erc1155721 = await ERC1155ERC721.at(ERC1155_ERC721);
    console.log("ERC1155ERC721 deployed to:", erc1155721.address);

    //Deploy VoucherKernel
    const voucherKernel = await VoucherKernel.at(VOUCHER_KERNEL);
    console.log("VoucherKernel deployed to:", voucherKernel.address);

    //Deploy Cashier
    const cashier = await Cashier.at(CASHIER);
    console.log("Cashier deployed to:", cashier.address);

    //Deploy BosonRouter
    const bosonRouter = await BosonRouter.at(BOSON_ROUTER)
    console.log("BosonRouter deployed to:", bosonRouter.address);

    //Call admin functions
    const promises = [];
    console.log("$ Setting initial values ...");

    await erc1155721.setApprovalForAll(voucherKernel.address, 'true')
    console.log("\n$ ERC1155ERC721 approved VoucherKernel");

    await erc1155721.setVoucherKernelAddress(voucherKernel.address)
    console.log("\n$ ERC1155ERC721 set VoucherKernel address")

    await erc1155721.setCashierAddress(cashier.address)
    console.log("\n$ ERC1155ERC721 set Cashier address");

    await voucherKernel.setBosonRouterAddress(bosonRouter.address)
    console.log("\n$ VoucherKernel set BosonRouter address");

    await voucherKernel.setCashierAddress(cashier.address)
    console.log("\n$ VoucherKernel set Cashier address");

    await cashier.setBosonRouterAddress(bosonRouter.address)
    console.log("\n$ Cashier set BosonRouter address");

    await cashier.setTokenContractAddress(erc1155721.address)
    console.log("\n$ Cashier set token contract address");

    console.log('\n$ All done !')
}


// main()
//     .then(() => process.exit(0))
//     .catch(error => {
//         console.error(error);
//         process.exit(1);
//     });
