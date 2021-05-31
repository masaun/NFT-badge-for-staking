require('dotenv').config()
//const Tx = require('ethereumjs-tx').Transaction

/// Web3 instance
const Web3 = require('web3')
const provider = new Web3.providers.HttpProvider(`https://goerli.infura.io/v3/${ process.env.INFURA_KEY }`)
const web3 = new Web3(provider)

/// Import deployed-addresses
const contractAddressList = require("../../migrations/addressesList/contractAddress/contractAddress.js")
const tokenAddressList = require("../../migrations/addressesList/tokenAddress/tokenAddress.js")

/// Artifact of smart contracts 
const LPToken = artifacts.require("LPToken")
const RewardToken = artifacts.require("RewardToken")
const StakingNFTBadgeFor3Months = artifacts.require("StakingNFTBadgeFor3Months")
const StakingNFTBadgeFor6Months = artifacts.require("StakingNFTBadgeFor6Months")
const StakingNFTBadgeFor1Year = artifacts.require("StakingNFTBadgeFor1Year")
const StakingPool = artifacts.require("StakingPool")
const StakingManager = artifacts.require("StakingManager")
const Fancet = artifacts.require("Fancet")

/// Deployed-contract addresses on Polygon testnet
let LP_TOKEN = tokenAddressList["Polygon Mumbai"]["LPToken"]
let REWARD_TOKEN = tokenAddressList["Polygon Mumbai"]["RewardToken"]
let BADGE_FOR_3_MONTHS = contractAddressList["Polygon Mumbai"]["StakingNFTBadgeFor3Months"]
let BADGE_FOR_6_MONTHS = contractAddressList["Polygon Mumbai"]["StakingNFTBadgeFor6Months"]
let BADGE_FOR_1_YEAR = contractAddressList["Polygon Mumbai"]["StakingNFTBadgeFor1Year"]
let STAKING_POOL = contractAddressList["Polygon Mumbai"]["StakingPool"]
let STAKING_MANAGER = contractAddressList["Polygon Mumbai"]["StakingManager"]
let FANCET = contractAddressList["Polygon Mumbai"]["Fancet"]

/// Variable to assign a Geyser contract address
// let LP_TOKEN
// let REWARD_TOKEN
// let BADGE_FOR_3MONTHS
// let BADGE_FOR_6MONTHS
// let BADGE_FOR_1YEAR
// let STAKING_POOL
// let STAKING_MANAGER

/// Global contract instance
let lpToken
let rewardToken
let badgeFor3Months
let badgeFor6Months
let badgeFor1Year
let stakingPool
let stakingManager

/// Acccounts
let user
//let deployer


/***
 * @dev - Execution COMMAND: $ npm run script:StakingManager
 *        ($ truffle exec ./scripts/polygon-mumbai/StakingManager.script.js --network polygon_mumbai) 
 **/


///-----------------------------------------------
/// Execute all methods
///-----------------------------------------------

/// [Note]: For truffle exec (Remarks: Need to use module.exports)
module.exports = function(callback) {
    main().then(() => callback()).catch(err => callback(err))
};

async function main() {
    console.log("\n------------- Set a wallet address -------------")
    await setWalletAddress()

    console.log("\n------------- Setup smart contracts on Polygon mumbai testnet -------------")
    await setupSmartContracts()

    console.log("\n------------- Receive each tokens from Fancet -------------")
    await receiveTokensFromFancet()

    console.log("\n------------- Check status before workflow is started -------------")
    await checkStatusBefore()

    console.log("\n------------- Workflow of the StakingManager contract -------------")
    await stakeFor3Months()
    await stakeFor6Months()
    await stakeFor1Year()

    console.log("\n------------- Check status after a user staked -------------")
    await checkStatusAfterStake()
}


///-----------------------------------------------
/// Preparation
///-----------------------------------------------
async function setWalletAddress() {
    user = process.env.DEPLOYER_ADDRESS
    //deployer = process.env.DEPLOYER_ADDRESS

    /// [Log]
    console.log('=== user ===', user)
}

async function setupSmartContracts() {
    //console.log("Deploy the LP Token contract instance + A deployer receive 1000000 LP Tokens as initial supply")
    console.log("Create the LP Token (mock) contract instance")
    //lpToken = await LPToken.new({ from: deployer })
    lpToken = await LPToken.at(LP_TOKEN)
    //LP_TOKEN = lpToken.address

    //console.log("Deploy the Reward Token contract instance + A deployer receive 1000000 Reward Tokens as initial supply")
    console.log("Create the Reward Token (mock) contract instance")
    //rewardToken = await RewardToken.new({ from: deployer })
    rewardToken = await RewardToken.at(REWARD_TOKEN)
    //REWARD_TOKEN = rewardToken.address

    //console.log("Deploy the StakingNFTBadgeFor3Months contract instance")
    console.log("Create the StakingNFTBadgeFor3Months contract instance")
    //badgeFor3Months = await StakingNFTBadgeFor3Months.new({ from: deployer })
    badgeFor3Months = await StakingNFTBadgeFor3Months.at(BADGE_FOR_3_MONTHS)
    //BADGE_FOR_3_MONTHS = badgeFor3Months.address

    //console.log("Deploy the StakingNFTBadgeFor6Months contract instance")
    console.log("Create the StakingNFTBadgeFor6Months contract instance")
    //badgeFor6Months = await StakingNFTBadgeFor6Months.new({ from: deployer })
    badgeFor6Months = await StakingNFTBadgeFor6Months.at(BADGE_FOR_6_MONTHS)
    //BADGE_FOR_6_MONTHS = badgeFor6Months.address

    //console.log("Deploy the StakingNFTBadgeFor1Year contract instance")
    console.log("Create the StakingNFTBadgeFor1Year contract instance")
    //badgeFor1Year = await StakingNFTBadgeFor1Year.new({ from: deployer })
    badgeFor1Year = await StakingNFTBadgeFor1Year.at(BADGE_FOR_1_YEAR)
    //BADGE_FOR_1_YEAR = badgeFor1Year.address

    //console.log("Deploy the StakingPool contract instance")
    console.log("Create the StakingPool contract instance")
    //stakingPool = await StakingPool.new(LP_TOKEN, { from: deployer })
    stakingPool = await StakingPool.at(STAKING_POOL)
    //STAKING_POOL = stakingPool.address

    //console.log("Deploy the StakingManager contract instance")
    console.log("Create the StakingManager contract instance")
    // stakingManager = await StakingManager.new(LP_TOKEN, 
    //                                           REWARD_TOKEN, 
    //                                           STAKING_POOL, 
    //                                           STAKING_NFT_BADGE_FOR_3_MONTHS, 
    //                                           STAKING_NFT_BADGE_FOR_6_MONTHS, 
    //                                           STAKING_NFT_BADGE_FOR_1_YEAR, 
    //                                           { from: deployer })
    stakingManager = await StakingManager.at(STAKING_MANAGER)
    //STAKING_MANAGER = stakingManager.address

    //console.log("Deploy the Fancet contract instance")
    console.log("Create the Fancet contract instance")
    //fancet = await Fancet.new(LP_TOKEN, REWARD_TOKEN, { from: deployer })
    fancet = await Fancet.at(FANCET)
    //FANCET = fancet.address

    /// Logs (each deployed-contract addresses)
    console.log('=== LP_TOKEN ===', LP_TOKEN)    
    console.log('=== REWARD_TOKEN ===', REWARD_TOKEN)
    console.log('=== BADGE_FOR_3_MONTHS ===', BADGE_FOR_3_MONTHS)    
    console.log('=== BADGE_FOR_6_MONTHS ===', BADGE_FOR_6_MONTHS)
    console.log('=== BADGE_FOR_1_YEAR ===', BADGE_FOR_1_YEAR)
    console.log('=== STAKING_POOL ===', STAKING_POOL)
    console.log('=== STAKING_MANAGER ===', STAKING_MANAGER)
    console.log('=== FANCET ===', FANCET)
}

async function receiveTokensFromFancet() {
    console.log("User should receive 1000 LPTokens and 1000 RewardTokens")
    txReceipt1 = await fancet.transferLPToken({ from: user })
    //txReceipt2 = await fancet.transferRewardToken({ from: user })
}

async function checkStatusBefore() {
    LPTokenBalance = await lpToken.balanceOf(user)
    RewardTokenBalance = await rewardToken.balanceOf(user)
    console.log('=== LP Token balance of user ===', fromWei(LPTokenBalance))
    console.log('=== Reward Token balance of user ===', fromWei(RewardTokenBalance))
}


///--------------------------------------------
/// Methods for workflow
///--------------------------------------------
async function stakeFor3Months() {
    const tokenURI = "https://ipfs.fleek.co/ipfs/QmdSMxjdETpEEDgG1zABTUQjDr3LUi8KXi3ycWUgcmcPRZ"
    const stakeAmount = toWei('0.1')

    let txReceipt1 = await lpToken.approve(STAKING_MANAGER, stakeAmount, { from: user })
    let txReceipt2 = await stakingManager.stakeFor3Months(tokenURI, stakeAmount, { from: user })

    console.log("User should receive a NFT that represent staking for 3 months")
}

async function stakeFor6Months() {
    const tokenURI = "https://ipfs.fleek.co/ipfs/QmdSMxjdETpEEDgG1zABTUQjDr3LUi8KXi3ycWUgcmcPRZ"
    const stakeAmount = toWei('0.1')

    let txReceipt1 = await lpToken.approve(STAKING_MANAGER, stakeAmount, { from: user })
    let txReceipt2 = await stakingManager.stakeFor6Months(tokenURI, stakeAmount, { from: user })

    console.log("User should receive a NFT that represent staking for 6 months")
}

async function stakeFor1Year() {
    const tokenURI = "https://ipfs.fleek.co/ipfs/QmdSMxjdETpEEDgG1zABTUQjDr3LUi8KXi3ycWUgcmcPRZ"
    const stakeAmount = toWei('0.1')

    let txReceipt1 = await lpToken.approve(STAKING_MANAGER, stakeAmount, { from: user })
    let txReceipt2 = await stakingManager.stakeFor1Year(tokenURI, stakeAmount, { from: user })

    console.log("User should receive a NFT that represent staking for 1 year")    
}

async function checkStatusAfterStake() {
    LPTokenBalance = await lpToken.balanceOf(user)
    RewardTokenBalance = await rewardToken.balanceOf(user)
    console.log('=== LP Token balance of user ===', fromWei(LPTokenBalance))
    console.log('=== Reward Token balance of user ===', fromWei(RewardTokenBalance))

    const tokenId = 1
    const owner1 = await badgeFor3Months.ownerOf(tokenId)
    const owner2 = await badgeFor6Months.ownerOf(tokenId)
    const owner3 = await badgeFor1Year.ownerOf(tokenId)
    console.log('=== Owner of NFT badge for 3 months ===', owner1)
    console.log('=== Owner of NFT badge for 6 months ===', owner2)
    console.log('=== Owner of NFT badge for 1 year ===', owner3)
}







///--------------------------------------------
/// Get event
///--------------------------------------------
async function getEvents(contractInstance, eventName) {
    const _latestBlock = await getCurrentBlock()
    const LATEST_BLOCK = Number(String(_latestBlock))

    /// [Note]: Retrieve an event log of eventName (via web3.js v1.0.0)
    let events = await contractInstance.getPastEvents(eventName, {
        filter: {},
        fromBlock: LATEST_BLOCK,  /// [Note]: The latest block on Kovan testnet
        //fromBlock: 0,
        toBlock: 'latest'
    })
    console.log(`\n=== [Event log emitted]: ${ eventName } ===`, events[0].returnValues)
    return events[0].returnValues
} 


///---------------------------------------------------------
/// Get current block number
///---------------------------------------------------------
async function getCurrentBlock() {
    const currentBlock = await web3.eth.getBlockNumber()
    return currentBlock
}

async function getCurrentTimestamp() {
    const currentBlock = await web3.eth.getBlockNumber()
    const currentTimestamp = await web3.eth.getBlock(currentBlock).timestamp

    return currentTimestamp
}


///---------------------------------------------------------
/// Methods for converting unit
///---------------------------------------------------------
function toWei(amount) {
    return web3.utils.toWei(`${ amount }`, 'ether')
} 

function fromWei(amount) {
    return web3.utils.fromWei(`${ amount }`, 'ether')
}
