pragma solidity 0.7.1;

import "./chainlink/v0.7/ChainlinkClient.sol";
import { Ownable } from  "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @notice - This is a smart contract that use TheRundown on Chainlink
 */
contract SportsGameOracle is ChainlinkClient, Ownable {
    uint256 oraclePayment;
    uint256 public score;
    /**
     * Network: Kovan
     * Oracle: 
     *      Name:           LinkPool
     *      Listing URL:    https://market.link/nodes/323602b9-3831-4f8d-a66b-3fb7531649eb?network=42
     *      Address:        0x56dd6586DB0D08c6Ce7B2f2805af28616E082455
     * Job: 
     *      Name:           TheRundown
     *      Listing URL:    ...
     *      ID:             dbb65efc02d34cddb920eca1bec22ade
     *      Fee:            0.1 LINK
     */
    constructor(uint256 _oraclePayment) public {
      setPublicChainlinkToken();
      oraclePayment = _oraclePayment;
    }

    function requestScore
    (
      address _oracle,
      bytes32 _jobId,
      string memory _matchId
    ) 
      public 
      onlyOwner 
    {
      Chainlink.Request memory req = buildChainlinkRequest(_jobId, address(this), this.fulfill.selector);
      req.add("matchId", _matchId);
      sendChainlinkRequestTo(_oracle, req, oraclePayment);
    }

    function fulfill(bytes32 _requestId, uint256 _score)
      public
      recordChainlinkFulfillment(_requestId)
    {
      score = _score;
    }
}
