/// Using local network
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'))

/// Openzeppelin test-helper
const { time } = require('@openzeppelin/test-helpers')

/// web3.js
const BN = web3.utils.BN

/// Truffle
const truffleAssert = require('truffle-assertions')

/// Boson's helper
const constants = require('./testHelpers/constants');
const timemachine = require('./testHelpers/timemachine');
const Utils = require('./testHelpers/utils');
const Users = require('./testHelpers/users');
const { assert } = require('chai');

/// Import deployed-addresses
const contractAddressList = require("../../migrations/addressesList/contractAddress/contractAddress.js")
const tokenAddressList = require("../../migrations/addressesList/tokenAddress/tokenAddress.js")

/// Artifact of smart contracts 
const ERC1155ERC721 = artifacts.require('ERC1155ERC721')
const VoucherKernel = artifacts.require('VoucherKernel')
const Cashier = artifacts.require('Cashier')
const BosonRouter = artifacts.require('BosonRouter')
const FundLimitsOracle = artifacts.require('FundLimitsOracle')


/**
 * @notice - This is the test of GeyserFactory.sol
 * @notice - [Execution command]: $ truffle test ./test/test-local/GeyserFactory.test.js
 * @notice - [Using kovan-fork with Ganache-CLI and Infura]: Please reference from README
 */
contract("Boson General Scenatio", function(accounts) {
    /// Acccounts
    let deployer = accounts[0]
    let seller = accounts[1]
    let buyer = accounts[2]

    /// Global contract instance
    let erc1155ERC721
    let voucherKernel
    let cashier
    let bosonRouter
    let fundLimitsOracle

    let tokenSupplyKey1
    let tokenSupplyKey2
    let tokenVoucherKey1
    let tokenVoucherKey2
    let promiseId1
    let promiseId2

    /// Global variable for each contract addresses
    let ERC1155_ERC721
    let VOUCHER_KERNEL
    let CASHIER
    let BOSON_ROUTER
    let FUND_LIMITS_ORACLE

    async function getEvents(contractInstance, eventName) {
        const _latestBlock = await time.latestBlock()
        const LATEST_BLOCK = Number(String(_latestBlock))

        /// [Note]: Retrieve an event log of eventName (via web3.js v1.0.0)
        let events = await contractInstance.getPastEvents(eventName, {
            filter: {},
            fromBlock: LATEST_BLOCK, /// [Note]: The latest block on Kovan testnet
            //fromBlock: 0,
            toBlock: 'latest'
        })
        //console.log(`\n=== [Event log]: ${ eventName } ===`, events[0].returnValues)
        return events[0].returnValues
    } 

    describe("Setup smart-contracts", () => {
        it("Deploy the ERC1155ERC721 contract instance", async () => {
            erc1155ERC721 = await ERC1155ERC721.new({ from: deployer })
            ERC1155_ERC721 = erc1155ERC721.address
        })

        it("Deploy the FundLimitsOracle contract instance", async () => {
            fundLimitsOracle = await FundLimitsOracle.new({ from: deployer })
            FUND_LIMITS_ORACLE = fundLimitsOracle.address
        })

        it("Deploy the VoucherKernel contract instance", async () => {
            voucherKernel = await VoucherKernel.new(ERC1155_ERC721, { from: deployer })
            VOUCHER_KERNEL = voucherKernel.address
        })

        it("Deploy the Cashier contract instance", async () => {
            cashier = await Cashier.new(VOUCHER_KERNEL,{ from: deployer })
            CASHIER = cashier.address
        })

        it("Deploy the BosonRouter contract instance", async () => {
            bosonRouter = await BosonRouter.new(VOUCHER_KERNEL, FUND_LIMITS_ORACLE, CASHIER, { from: deployer })
            BOSON_ROUTER = bosonRouter.address
        })

        it("[Log]: Deployed-contracts addresses", async () => {
            console.log("=== ERC1155_ERC721 ===", ERC1155_ERC721)
            console.log("=== FUND_LIMITS_ORACLE ===", FUND_LIMITS_ORACLE)
            console.log("=== VOUCHER_KERNEL ===", VOUCHER_KERNEL)
            console.log("=== CASHIER ===", CASHIER)
            console.log("=== BOSON_ROUTER ===", BOSON_ROUTER)
        })
    })

    describe("Create Voucher Sets (ERC1155)", () => {
        it("adding one new order / promise", async () => {
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
                    to: CASHIER,
                    value: constants.PROMISE_DEPOSITSE1
                }
            )

            let tokenSupplyKey1
        })
    })

    describe("Commit to buy a voucher (ERC1155)", () => {
        it("fill one order (aka commit to buy a voucher)", async () => {
            /// [Todo]:
        })
    })

    describe("Vouchers (ERC721)", () => {
        it("redeeming one voucher", async () => {
            /// [Todo]:
        })
    })
})
