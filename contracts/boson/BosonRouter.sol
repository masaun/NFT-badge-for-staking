// SPDX-License-Identifier: LGPL-3.0-or-later
pragma solidity 0.7.1;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./interfaces/IVoucherKernel.sol";
import "./interfaces/IFundLimitsOracle.sol";
import "./interfaces/IBosonRouter.sol";
import "./interfaces/ICashier.sol";
import "./UsingHelpers.sol";

/**
 * @title Contract for interacting with Boson Protocol from the user's perspective.
 */
contract BosonRouter is
    IBosonRouter,
    UsingHelpers,
    ReentrancyGuard,
    Ownable
{
    using Address for address payable;
    using SafeMath for uint256;

    mapping(address => uint256) public correlationIds; // whenever a seller or a buyer interacts with the smart contract, a personal txID is emitted from an event.

    using SafeMath for uint256;

    address public cashierAddress;
    address public voucherKernel;
    address public fundLimitsOracle;

    event LogOrderCreated(
        uint256 indexed _tokenIdSupply,
        address _seller,
        uint256 _quantity,
        uint8 _paymentType,
        uint256 _correlationId
    );

    /**
     * @notice Acts as a modifier, but it's cheaper. Checking if a non-zero address is provided, otherwise reverts.
     */
    function notZeroAddress(address tokenAddress) private pure {
        require(tokenAddress != address(0), "0A"); //zero address
    }

    /**
     * @notice Acts as a modifier, but it's cheaper. Replacement of onlyOwner modifier. If the caller is not the owner of the contract, reverts.
     */
    function onlyRouterOwner() internal view {
        require(owner() == _msgSender(), "NO"); //not owner
    }

    /**
     * @notice Acts as a modifier, but it's cheaper. Checks whether provided value corresponds to the limits in the FundLimitsOracle.
     * @param value the specified value is per voucher set level. E.g. deposit * qty should not be greater or equal to the limit in the FundLimitsOracle (ETH).
     */
    function notAboveETHLimit(uint256 value) internal view {
        require(
            value <= IFundLimitsOracle(fundLimitsOracle).getETHLimit(),
            "AL" // above limit
        );
    }

    /**
     * @notice Acts as a modifier, but it's cheaper. Checks whether provided value corresponds to the limits in the FundLimitsOracle.
     * @param _tokenAddress the token address which, we are getting the limits for.
     * @param value the specified value is per voucher set level. E.g. deposit * qty should not be greater or equal to the limit in the FundLimitsOracle (ETH).
     */
    function notAboveTokenLimit(address _tokenAddress, uint256 value)
        internal
        view
    {
        require(
            value <=
                IFundLimitsOracle(fundLimitsOracle).getTokenLimit(
                    _tokenAddress
                ),
            "AL" //above limit
        );
    }

    constructor(
        address _voucherKernel,
        address _fundLimitsOracle,
        address _cashierAddress
    ) {
        notZeroAddress(_voucherKernel);
        notZeroAddress(_fundLimitsOracle);
        notZeroAddress(_cashierAddress);

        voucherKernel = _voucherKernel;
        fundLimitsOracle = _fundLimitsOracle;
        cashierAddress = _cashierAddress;
    }


    /**
     * @notice Issuer/Seller offers promises as supply tokens and needs to escrow the deposit
        @param metadata metadata which is required for creation of a voucher
        Metadata array is used as in some scenarios we need several more params, as we need to recover 
        owner address in order to permit the contract to transfer funds on his behalf. 
        Since the params get too many, we end up in situation that the stack is too deep.
        
        uint256 _validFrom = metadata[0];
        uint256 _validTo = metadata[1];
        uint256 _price = metadata[2];
        uint256 _depositSe = metadata[3];
        uint256 _depositBu = metadata[4];
        uint256 _quantity = metadata[5];
     */
    function requestCreateOrderETHETH(uint256[] calldata metadata)
        external
        payable
        override
    {
        notAboveETHLimit(metadata[2].mul(metadata[5]));
        notAboveETHLimit(metadata[3].mul(metadata[5]));
        notAboveETHLimit(metadata[4].mul(metadata[5]));
        require(metadata[3].mul(metadata[5]) == msg.value, "IF"); //invalid funds
        //hex"54" FISSION.code(FISSION.Category.Finance, FISSION.Status.InsufficientFunds)

        uint256 tokenIdSupply =
            IVoucherKernel(voucherKernel).createTokenSupplyID(
                msg.sender,
                metadata[0],
                metadata[1],
                metadata[2],
                metadata[3],
                metadata[4],
                metadata[5]
            );

        IVoucherKernel(voucherKernel).createPaymentMethod(
            tokenIdSupply,
            ETHETH,
            address(0),
            address(0)
        );

        //record funds in escrow ...
        ICashier(cashierAddress).addEscrowAmount{value: msg.value}(msg.sender);

        emit LogOrderCreated(
            tokenIdSupply,
            msg.sender,
            metadata[5],
            ETHETH,
            correlationIds[msg.sender]++
        );
    }

    /**
     * @notice Consumer requests/buys a voucher by filling an order and receiving a Voucher Token in return
     * @param _tokenIdSupply    ID of the supply token
     * @param _issuer           Address of the issuer of the supply token
     */
    function requestVoucherETHETH(uint256 _tokenIdSupply, address _issuer)
        external
        payable
        override
        nonReentrant
    {
        uint256 weiReceived = msg.value;

        //checks
        (uint256 price, , uint256 depositBu) =
            IVoucherKernel(voucherKernel).getOrderCosts(_tokenIdSupply);
        require(price.add(depositBu) == weiReceived, "IF"); //invalid funds
        //hex"54" FISSION.code(FISSION.Category.Finance, FISSION.Status.InsufficientFunds)

        IVoucherKernel(voucherKernel).fillOrder(
            _tokenIdSupply,
            _issuer,
            msg.sender,
            ETHETH,
            correlationIds[msg.sender]++
        );

        //record funds in escrow ...
        ICashier(cashierAddress).addEscrowAmount{value: msg.value}(msg.sender);
    }


    /**
     * @notice Redemption of the vouchers promise
     * @param _tokenIdVoucher   ID of the voucher
     */
    function redeem(uint256 _tokenIdVoucher) external override {
        IVoucherKernel(voucherKernel).redeem(_tokenIdVoucher, msg.sender);
    }


    // // // // // // // //
    // UTILS
    // // // // // // // //

    /**
     * @notice Increment a seller or buyer's correlation Id
     * @param _party   The address of the seller or buyer
     */
    function incrementCorrelationId(address _party) 
        external
        override
    {
         correlationIds[_party]++;
    }
}
