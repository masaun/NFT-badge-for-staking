require('dotenv').config()

/// Web3 instance
const Web3 = require('web3')
const provider = new Web3.providers.HttpProvider(`https://goerli.infura.io/v3/${ process.env.INFURA_KEY }`)
const web3 = new Web3(provider)

const Fancet = artifacts.require("Fancet")
const LPToken = artifacts.require("LPToken")
const RewardToken = artifacts.require("RewardToken")

let LP_TOKEN = LPToken.address
let REWARD_TOKEN = RewardToken.address
let FANCET

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(Fancet, LP_TOKEN, REWARD_TOKEN)

    FANCET = Fancet.address

    const lpToken = await LPToken.at(LP_TOKEN)
    const rewardToken = await RewardToken.at(REWARD_TOKEN)

    /// Deposit each tokens into the Fancet contract
    const amount = web3.utils.toWei('1000000', 'ether')  /// 1 milion (all amount of total supply)
    await lpToken.transfer(FANCET, amount, { from: accounts[0] })
    await rewardToken.transfer(FANCET, amount, { from: accounts[0] })    
}
