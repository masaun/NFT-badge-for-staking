const Fancet = artifacts.require("Fancet")
const LPToken = artifacts.require("LPToken")
const RewardToken = artifacts.require("RewardToken")

let LP_TOKEN = LPToken.address
let REWARD_TOKEN = RewardToken.address
let FANCET

module.exports = async function(deployer) {
    await deployer.deploy(Fancet, LP_TOKEN, REWARD_TOKEN)

    FANCET = Fancet.address

    const lpToken = await LPToken.at(LP_TOKEN)
    const rewardToken = await RewardToken.at(REWARD_TOKEN)

    /// Deposit each tokens into the Fancet contract
    const amount = 1e8 * 1e18  /// 1 milion (all amount of total supply)
    await lpToken.transfer(FANCET, amount, { from: deployer })
    await rewardToken.transfer(FANCET, amount, { from: deployer })    
}
