require('dotenv').config()
//const Tx = require('ethereumjs-tx').Transaction

/// Web3 instance
const Web3 = require('web3')
const provider = new Web3.providers.HttpProvider(`https://goerli.infura.io/v3/${ process.env.INFURA_KEY }`)
const web3 = new Web3(provider)

/// Truffle
truffleAssert = require('truffle-assertions')

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
    await executeAllMethods()
}


async function executeAllMethods() {

    /// Accounts
    console.log('--------------- Accounts ---------------')    
    const seller = process.env.DEPLOYER_ADDRESS
    const buyer = process.env.DEPLOYER_ADDRESS    

    /// Constants
    console.log('--------------- Setup constants ---------------')    
    const timestamp = await Utils.getCurrTimestamp()
    constants.PROMISE_VALID_FROM = timestamp
    constants.PROMISE_VALID_TO = timestamp + 2 * constants.SECONDS_IN_DAY


    console.log('--------------- Setup contracts ---------------')
    // Deploy FundLimitsOracle
    const fundLimitsOracle = await FundLimitsOracle.at(FUND_LIMITS_ORACLE);
    console.log("FundLimitsOracle deployed to:", fundLimitsOracle.address);

    // Deploy ERC1155ERC721
    const erc1155ERC721 = await ERC1155ERC721.at(ERC1155_ERC721);
    console.log("ERC1155ERC721 deployed to:", erc1155ERC721.address);

    //Deploy VoucherKernel
    const voucherKernel = await VoucherKernel.at(VOUCHER_KERNEL);
    console.log("VoucherKernel deployed to:", voucherKernel.address);

    //Deploy Cashier
    const cashier = await Cashier.at(CASHIER);
    console.log("Cashier deployed to:", cashier.address);

    //Deploy BosonRouter
    const bosonRouter = await BosonRouter.at(BOSON_ROUTER)
    console.log("BosonRouter deployed to:", bosonRouter.address)

    //Call admin functions
    const promises = [];
    console.log(" Setting initial values ...");

    await erc1155ERC721.setApprovalForAll(voucherKernel.address, 'true')
    console.log("\n ERC1155ERC721 approved VoucherKernel");

    await erc1155ERC721.setVoucherKernelAddress(voucherKernel.address)
    console.log("\n ERC1155ERC721 set VoucherKernel address")

    await erc1155ERC721.setCashierAddress(cashier.address)
    console.log("\n ERC1155ERC721 set Cashier address");

    await voucherKernel.setBosonRouterAddress(bosonRouter.address)
    console.log("\n VoucherKernel set BosonRouter address");

    await voucherKernel.setCashierAddress(cashier.address)
    console.log("\n VoucherKernel set Cashier address");

    await cashier.setBosonRouterAddress(bosonRouter.address)
    console.log("\n Cashier set BosonRouter address");

    await cashier.setTokenContractAddress(erc1155ERC721.address)
    console.log("\n Cashier set token contract address");

    console.log('\n$ All done !')


    ///----------------------------------
    /// 'Create Voucher Sets (ERC1155)'
    ///----------------------------------

      console.log('--------------- Create Voucher Sets (ERC1155) ---------------')

      console.log('adding one new order / promise')

      const txOrder = await bosonRouter.requestCreateOrderETHETH(
        [
          constants.PROMISE_VALID_FROM,
          constants.PROMISE_VALID_TO,
          constants.PROMISE_PRICE1,
          constants.PROMISE_DEPOSITSE1,
          constants.PROMISE_DEPOSITBU1,
          constants.ORDER_QUANTITY1,
        ],
        {
          from: seller,
          to: cashier.address,
          value: constants.PROMISE_DEPOSITSE1,
        }
      );

      let tokenSupplyKey1;

      truffleAssert.eventEmitted(
        txOrder,
        'LogOrderCreated',
        (ev) => {
          tokenSupplyKey1 = ev._tokenIdSupply;
          return (
            ev._tokenIdSupply.gt(constants.ZERO) &&
            ev._seller === seller &&
            ev._quantity.eq(new BN(constants.ORDER_QUANTITY1)) &&
            ev._paymentType.eq(constants.ONE) &&
            ev._correlationId.eq(constants.ZERO)
          );
        },
        'order1 event incorrect'
      );

      const internalVoucherKernelTx = await truffleAssert.createTransactionResult(
        voucherKernel,
        txOrder.tx
      );

      let promiseId1;

      truffleAssert.eventEmitted(
        internalVoucherKernelTx,
        'LogPromiseCreated',
        (ev) => {
          promiseId1 = ev._promiseId;
          return (
            ev._promiseId > 0 &&
            ev._nonce.eq(constants.ONE) &&
            ev._seller === seller &&
            ev._validFrom.eq(new BN(constants.PROMISE_VALID_FROM)) &&
            ev._validTo.eq(new BN(constants.PROMISE_VALID_TO)) &&
            ev._idx.eq(constants.ZERO)
          );
        },
        'promise event incorrect'
      );

      const internalTokenTx = await truffleAssert.createTransactionResult(
        erc1155ERC721,
        txOrder.tx
      );

      truffleAssert.eventEmitted(
        internalTokenTx,
        'TransferSingle',
        (ev) => {
          return (
            ev._operator === voucherKernel.address &&
            ev._from === constants.ZERO_ADDRESS &&
            ev._to == seller &&
            ev._id.eq(tokenSupplyKey1) &&
            ev._value.eq(new BN(constants.ORDER_QUANTITY1))
          );
        },
        'transfer event incorrect'
      );

      //Check BosonRouter state
      assert.equal(
        await bosonRouter.correlationIds(seller),
        1,
        'Correlation Id incorrect'
      );

      //Check VoucherKernel State
      const promise = await voucherKernel.promises(promiseId1);
      assert.equal(promise.promiseId, promiseId1, 'Promise Id incorrect');
      assert.isTrue(promise.nonce.eq(constants.ONE), 'Nonce is incorrect');
      assert.strictEqual(
        promise.seller,
        seller,
        'Seller incorrect'
      );
      assert.isTrue(promise.validFrom.eq(new BN(constants.PROMISE_VALID_FROM)));
      assert.isTrue(promise.validTo.eq(new BN(constants.PROMISE_VALID_TO)));
      assert.isTrue(promise.price.eq(new BN(constants.PROMISE_PRICE1)));
      assert.isTrue(promise.depositSe.eq(new BN(constants.PROMISE_DEPOSITSE1)));
      assert.isTrue(promise.depositBu.eq(new BN(constants.PROMISE_DEPOSITBU1)));
      assert.isTrue(promise.idx.eq(constants.ZERO));

      const orderPromiseId = await voucherKernel.ordersPromise(
        tokenSupplyKey1
      );
      assert.strictEqual(
        orderPromiseId,
        promiseId1,
        'Order Promise Id incorrect'
      );

      const tokenNonce = await voucherKernel.tokenNonces(
        seller
      );
      assert.isTrue(tokenNonce.eq(constants.ONE));

      //Check ERC1155ERC721 state
      const sellerERC1155ERC721Balance = await erc1155ERC721.balanceOf(
        seller,
        tokenSupplyKey1
      );
      assert.isTrue(sellerERC1155ERC721Balance.eq(constants.ONE));
}



// main()
//     .then(() => process.exit(0))
//     .catch(error => {
//         console.error(error);
//         process.exit(1);
//     });
