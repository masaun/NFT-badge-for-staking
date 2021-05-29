truffleAssert = require('truffle-assertions');
// later consider using
// https://github.com/OpenZeppelin/openzeppelin-test-helpers

const constants = require('./testHelpers/constants');
const timemachine = require('./testHelpers/timemachine');
const Utils = require('./testHelpers/utils');
const Users = require('./testHelpers/users');
const { assert } = require('chai');

const ERC1155ERC721 = artifacts.require('ERC1155ERC721');
const VoucherKernel = artifacts.require('VoucherKernel');
const Cashier = artifacts.require('Cashier');
const BosonRouter = artifacts.require('BosonRouter');
const FundLimitsOracle = artifacts.require('FundLimitsOracle');
const LocalOracle = artifacts.require("LocalOracle")
const BN = web3.utils.BN;

contract('Voucher tests', async (accounts) => {
  //const users = new Users(addresses);

  let contractERC1155ERC721,
    contractVoucherKernel,
    contractCashier,
    contractBosonRouter,
    contractLocalOracle,
    contractFundLimitsOracle;

  let tokenSupplyKey1,
    tokenSupplyKey2,
    tokenVoucherKey1,
    tokenVoucherKey2,
    promiseId1,
    promiseId2;

  async function deployContracts() {
    const sixtySeconds = 60;

    contractFundLimitsOracle = await FundLimitsOracle.new();
    contractERC1155ERC721 = await ERC1155ERC721.new();
    contractLocalOracle = await LocalOracle.new(contractERC1155ERC721.address)
    contractVoucherKernel = await VoucherKernel.new(
      contractERC1155ERC721.address
    );

    contractCashier = await Cashier.new(contractVoucherKernel.address);
    contractBosonRouter = await BosonRouter.new(
      contractVoucherKernel.address,
      contractFundLimitsOracle.address,
      contractCashier.address
    );

    await contractERC1155ERC721.setApprovalForAll(
      contractVoucherKernel.address,
      'true'
    );
    await contractERC1155ERC721.setVoucherKernelAddress(
      contractVoucherKernel.address
    );

    await contractERC1155ERC721.setLocalOracleAddress(contractLocalOracle.address);

    await contractERC1155ERC721.setCashierAddress(contractCashier.address);

    await contractVoucherKernel.setBosonRouterAddress(
      contractBosonRouter.address
    );
    await contractVoucherKernel.setCashierAddress(contractCashier.address);

    await contractCashier.setBosonRouterAddress(contractBosonRouter.address);
    await contractCashier.setTokenContractAddress(
      contractERC1155ERC721.address
    );
  }

  beforeEach('execute prerequisite steps', async () => {
    assert.isAtLeast(accounts.length, 6);

    //Set up accounts for parties. In truffel owner = accounts[0]. 
    [deployer,seller,buyer,attacker,other1,other2] = accounts; 

    const timestamp = await Utils.getCurrTimestamp();
    constants.PROMISE_VALID_FROM = timestamp;
    constants.PROMISE_VALID_TO = timestamp + 2 * constants.SECONDS_IN_DAY;

    await deployContracts();
  });
  describe('Direct minting', function () {
    it('must fail: unauthorized minting ERC-1155', async () => {
      await truffleAssert.reverts(
        contractERC1155ERC721.mint(attacker, 666, 1, []),
        truffleAssert.ErrorType.REVERT
      );
    });

    it('must fail: unauthorized minting ERC-721', async () => {
      await truffleAssert.reverts(
        contractERC1155ERC721.mint(attacker, 666),
        truffleAssert.ErrorType.REVERT
      );
    });
  });

  describe('Create Voucher Sets (ERC1155)', () => {
    it('adding one new order / promise', async () => {
      const txOrder = await contractBosonRouter.requestCreateOrderETHETH(
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
          to: contractCashier.address,
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
        contractVoucherKernel,
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
        contractERC1155ERC721,
        txOrder.tx
      );

      truffleAssert.eventEmitted(
        internalTokenTx,
        'TransferSingle',
        (ev) => {
          return (
            ev._operator === contractVoucherKernel.address &&
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
        await contractBosonRouter.correlationIds(seller),
        1,
        'Correlation Id incorrect'
      );

      //Check VoucherKernel State
      const promise = await contractVoucherKernel.promises(promiseId1);
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

      const orderPromiseId = await contractVoucherKernel.ordersPromise(
        tokenSupplyKey1
      );
      assert.strictEqual(
        orderPromiseId,
        promiseId1,
        'Order Promise Id incorrect'
      );

      const tokenNonce = await contractVoucherKernel.tokenNonces(
        seller
      );
      assert.isTrue(tokenNonce.eq(constants.ONE));

      //Check ERC1155ERC721 state
      const sellerERC1155ERC721Balance = await contractERC1155ERC721.balanceOf(
        seller,
        tokenSupplyKey1
      );
      assert.isTrue(sellerERC1155ERC721Balance.eq(constants.ONE));
    });

    it('adding two new orders / promises', async () => {
      //Create 1st order
      const txOrder1 = await contractBosonRouter.requestCreateOrderETHETH(
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
          to: contractCashier.address,
          value: constants.PROMISE_DEPOSITSE1,
        }
      );

      truffleAssert.eventEmitted(
        txOrder1,
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

      //Create 2nd order
      const txOrder2 = await contractBosonRouter.requestCreateOrderETHETH(
        [
          constants.PROMISE_VALID_FROM,
          constants.PROMISE_VALID_TO,
          constants.PROMISE_PRICE2,
          constants.PROMISE_DEPOSITSE2,
          constants.PROMISE_DEPOSITBU2,
          constants.ORDER_QUANTITY2,
        ],
        {
          from: seller,
          to: contractCashier.address,
          value: constants.PROMISE_DEPOSITSE2,
        }
      );

      truffleAssert.eventEmitted(
        txOrder2,
        'LogOrderCreated',
        (ev) => {
          tokenSupplyKey2 = ev._tokenIdSupply;
          return (
            ev._tokenIdSupply.gt(constants.ZERO) &&
            ev._seller === seller &&
            ev._quantity.eq(new BN(constants.ORDER_QUANTITY2)) &&
            ev._paymentType.eq(constants.ONE) &&
            ev._correlationId.eq(constants.ONE)
          );
        },
        'order2 event incorrect'
      );

      const internalVoucherKernelTx = await truffleAssert.createTransactionResult(
        contractVoucherKernel,
        txOrder2.tx
      );

      let promiseId2;

      truffleAssert.eventEmitted(
        internalVoucherKernelTx,
        'LogPromiseCreated',
        (ev) => {
          promiseId2 = ev._promiseId;
          return (
            ev._promiseId > 0 &&
            ev._nonce.eq(new BN(2)) &&
            ev._seller === seller &&
            ev._validFrom.eq(new BN(constants.PROMISE_VALID_FROM)) &&
            ev._validTo.eq(new BN(constants.PROMISE_VALID_TO)) &&
            ev._idx.eq(constants.ONE)
          );
        },
        'promise event incorrect'
      );

      const internalTokenTx = await truffleAssert.createTransactionResult(
        contractERC1155ERC721,
        txOrder2.tx
      );

      truffleAssert.eventEmitted(
        internalTokenTx,
        'TransferSingle',
        (ev) => {
          return (
            ev._operator === contractVoucherKernel.address &&
            ev._from === constants.ZERO_ADDRESS &&
            ev._to === seller &&
            ev._id.eq(tokenSupplyKey2) &&
            ev._value.eq(new BN(constants.ORDER_QUANTITY2))
          );
        },
        'transfer event incorrect'
      );

      //Check BosonRouter state
      assert.equal(
        await contractBosonRouter.correlationIds(seller),
        2,
        'Correlation Id incorrect'
      );

      //Check VocherKernel State
      const promise = await contractVoucherKernel.promises(promiseId2);
      assert.strictEqual(promise.promiseId, promiseId2, 'Promise Id incorrect');
      assert.isTrue(promise.nonce.eq(new BN(2)));
      assert.strictEqual(
        promise.seller,
        seller,
        'Seller incorrect'
      );
      assert.isTrue(promise.validFrom.eq(new BN(constants.PROMISE_VALID_FROM)));
      assert.isTrue(promise.validTo.eq(new BN(constants.PROMISE_VALID_TO)));
      assert.isTrue(promise.price.eq(new BN(constants.PROMISE_PRICE2)));
      assert.isTrue(promise.depositSe.eq(new BN(constants.PROMISE_DEPOSITSE2)));
      assert.isTrue(promise.depositBu.eq(new BN(constants.PROMISE_DEPOSITBU2)));
      assert.isTrue(promise.idx.eq(constants.ONE));

      const orderPromiseId = await contractVoucherKernel.ordersPromise(
        tokenSupplyKey2
      );
      assert.strictEqual(
        orderPromiseId,
        promiseId2,
        'Order Promise Id incorrect'
      );

      const tokenNonce = await contractVoucherKernel.tokenNonces(
        seller
      );
      assert.isTrue(tokenNonce.eq(new BN(2)));

      //Check ERC1155ERC721 state
      const sellerERC1155ERC721BalanceVoucherSet1 = await contractERC1155ERC721.balanceOf(
        seller,
        tokenSupplyKey1
      );
      assert.isTrue(sellerERC1155ERC721BalanceVoucherSet1.eq(constants.ONE));

      const sellerERC1155ERC721BalanceVoucherSet2 = await contractERC1155ERC721.balanceOf(
        seller,
        tokenSupplyKey2
      );
      assert.isTrue(sellerERC1155ERC721BalanceVoucherSet2.eq(constants.ONE));
    });
  });

  describe('Commit to buy a voucher (ERC1155)', () => {
    beforeEach('execute prerequisite steps', async () => {
      //Create first voucher set
      const txOrder = await contractBosonRouter.requestCreateOrderETHETH(
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
          to: contractBosonRouter.address,
          value: constants.PROMISE_DEPOSITSE1,
        }
      );

      truffleAssert.eventEmitted(
        txOrder,
        'LogOrderCreated',
        (ev) => {
          tokenSupplyKey1 = ev._tokenIdSupply;
          return ev._tokenIdSupply.gt(constants.ZERO);
        },
        'order1 not created successfully'
      );

      const internalVoucherKernelTx = await truffleAssert.createTransactionResult(
        contractVoucherKernel,
        txOrder.tx
      );

      truffleAssert.eventEmitted(
        internalVoucherKernelTx,
        'LogPromiseCreated',
        (ev) => {
          promiseId1 = ev._promiseId;
          return ev._promiseId > 0;
        },
        'promise event incorrect'
      );

      //Create 2nd voucher set
      const txOrder2 = await contractBosonRouter.requestCreateOrderETHETH(
        [
          constants.PROMISE_VALID_FROM,
          constants.PROMISE_VALID_TO,
          constants.PROMISE_PRICE2,
          constants.PROMISE_DEPOSITSE2,
          constants.PROMISE_DEPOSITBU2,
          constants.ORDER_QUANTITY2,
        ],
        {
          from: seller,
          to: contractCashier.address,
          value: constants.PROMISE_DEPOSITSE2,
        }
      );

      truffleAssert.eventEmitted(
        txOrder2,
        'LogOrderCreated',
        (ev) => {
          tokenSupplyKey2 = ev._tokenIdSupply;
          return ev._tokenIdSupply.gt(constants.ZERO);
        },
        'order2 event incorrect'
      );

      const internalVoucherKernelTx2 = await truffleAssert.createTransactionResult(
        contractVoucherKernel,
        txOrder2.tx
      );

      truffleAssert.eventEmitted(
        internalVoucherKernelTx2,
        'LogPromiseCreated',
        (ev) => {
          promiseId2 = ev._promiseId;
          return ev._promiseId > 0;
        },
        'promise event incorrect'
      );
    });

    it('fill one order (aka commit to buy a voucher)', async () => {
      //Buyer commits
      const txFillOrder = await contractBosonRouter.requestVoucherETHETH(
        tokenSupplyKey1,
        seller,
        {
          from: buyer,
          to: contractBosonRouter.address,
          value: constants.PROMISE_PRICE1 + constants.PROMISE_DEPOSITBU1,
        }
      );
      const internalTx = await truffleAssert.createTransactionResult(
        contractVoucherKernel,
        txFillOrder.tx
      );

      let tokenVoucherKey;

      truffleAssert.eventEmitted(
        internalTx,
        'LogVoucherDelivered',
        (ev) => {
          tokenVoucherKey = ev._tokenIdVoucher;
          return (
            ev._tokenIdSupply.eq(tokenSupplyKey1) &&
            ev._tokenIdVoucher.gt(constants.ZERO) &&
            ev._issuer === seller &&
            ev._holder === buyer &&
            ev._promiseId === promiseId1 &&
            ev._correlationId.eq(constants.ZERO)
          );
        },
        'order1 not created successfully'
      );

      const internalTokenTx = await truffleAssert.createTransactionResult(
        contractERC1155ERC721,
        txFillOrder.tx
      );

      truffleAssert.eventEmitted(
        internalTokenTx,
        'TransferSingle',
        (ev) => {
          return (
            ev._operator === contractVoucherKernel.address &&
            ev._from === seller &&
            ev._to === constants.ZERO_ADDRESS &&
            ev._id.eq(tokenSupplyKey1) &&
            ev._value.eq(constants.ONE)
          );
        },
        'transfer single event incorrect'
      );

      truffleAssert.eventEmitted(
        internalTokenTx,
        'Transfer',
        (ev) => {
          return (
            ev._from === constants.ZERO_ADDRESS &&
            ev._to === buyer &&
            ev._tokenId.eq(tokenVoucherKey)
          );
        },
        'transfer event incorrect'
      );

      //Check BosonRouter state
      assert.equal(
        await contractBosonRouter.correlationIds(buyer),
        1,
        'Correlation Id incorrect'
      );

      //Check Voucher Kernel state
      const voucherStatus = await contractVoucherKernel.vouchersStatus(
        tokenVoucherKey
      );
      assert.isTrue(voucherStatus.status.eq(new BN(128))); //128 = COMMITTED
      assert.isFalse(
        voucherStatus.isPaymentReleased,
        'Payment released not false'
      );
      assert.isFalse(
        voucherStatus.isDepositsReleased,
        'Deposit released not false'
      );

      //Check ERC1155ERC721 state
      const sellerERC1155ERC721Balance = await contractERC1155ERC721.balanceOf(
        seller,
        tokenSupplyKey1
      );
      assert.isTrue(sellerERC1155ERC721Balance.eq(constants.ZERO));

      const buyerERC721Balance = await contractERC1155ERC721.balanceOf(
        buyer
      );
      const erc721TokenOwner = await contractERC1155ERC721.ownerOf(
        tokenVoucherKey
      );
      assert.isTrue(buyerERC721Balance.eq(constants.ONE));
      assert.strictEqual(buyer, erc721TokenOwner);
    });

    it('fill second order (aka commit to buy a voucher)', async () => {
      const txFillOrder = await contractBosonRouter.requestVoucherETHETH(
        tokenSupplyKey2,
        seller,
        {
          from: buyer,
          to: contractBosonRouter.address,
          value: constants.PROMISE_PRICE2 + constants.PROMISE_DEPOSITBU2,
        }
      );
      const internalTx = await truffleAssert.createTransactionResult(
        contractVoucherKernel,
        txFillOrder.tx
      );

      let tokenVoucherKey;

      truffleAssert.eventEmitted(
        internalTx,
        'LogVoucherDelivered',
        (ev) => {
          tokenVoucherKey = ev._tokenIdVoucher;
          return (
            ev._tokenIdSupply.eq(tokenSupplyKey2) &&
            ev._tokenIdVoucher.gt(constants.ZERO) &&
            ev._issuer === seller &&
            ev._holder === buyer &&
            ev._promiseId === promiseId2 &&
            ev._correlationId.eq(constants.ZERO)
          );
        },
        'order2 not filled successfully'
      );

      const internalTokenTx = await truffleAssert.createTransactionResult(
        contractERC1155ERC721,
        txFillOrder.tx
      );

      truffleAssert.eventEmitted(
        internalTokenTx,
        'TransferSingle',
        (ev) => {
          return (
            ev._operator === contractVoucherKernel.address &&
            ev._from === seller &&
            ev._to === constants.ZERO_ADDRESS &&
            ev._id.eq(tokenSupplyKey2) &&
            ev._value.eq(constants.ONE)
          );
        },
        'transfer single event incorrect'
      );

      truffleAssert.eventEmitted(
        internalTokenTx,
        'Transfer',
        (ev) => {
          return (
            ev._from === constants.ZERO_ADDRESS &&
            ev._to === buyer &&
            ev._tokenId.eq(tokenVoucherKey)
          );
        },
        'transfer event incorrect'
      );

      //Check BosonRouter state
      assert.equal(
        await contractBosonRouter.correlationIds(buyer),
        1,
        'Correlation Id incorrect'
      );

      //Check Voucher Kernel state
      const voucherStatus = await contractVoucherKernel.vouchersStatus(
        tokenVoucherKey
      );
      assert.isTrue(voucherStatus.status.eq(new BN(128))); //128 = COMMITTED
      assert.isFalse(
        voucherStatus.isPaymentReleased,
        'Payment released not false'
      );
      assert.isFalse(
        voucherStatus.isDepositsReleased,
        'Deposit released not false'
      );

      //Check ERC1155ERC721 state
      const sellerERC1155ERC721Balance = await contractERC1155ERC721.balanceOf(
        seller,
        tokenSupplyKey2
      );
      assert.isTrue(sellerERC1155ERC721Balance.eq(constants.ZERO));

      const buyerERC721Balance = await contractERC1155ERC721.balanceOf(
        buyer
      );
      const erc721TokenOwner = await contractERC1155ERC721.ownerOf(
        tokenVoucherKey
      );
      assert.isTrue(buyerERC721Balance.eq(constants.ONE));
      assert.strictEqual(buyer, erc721TokenOwner);
    });

    it('must fail: adding new order with incorrect value sent', async () => {
      await truffleAssert.reverts(
        contractBosonRouter.requestCreateOrderETHETH(
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
            to: contractBosonRouter.address,
            value: 0,
          }
        ),
        truffleAssert.ErrorType.REVERT
      );
    });

    it('must fail: fill an order with incorrect value', async () => {
      await truffleAssert.reverts(
        contractBosonRouter.requestVoucherETHETH(
          tokenSupplyKey1,
          seller,
          {
            from: buyer,
            to: contractBosonRouter.address,
            value: 0,
          }
        ),
        truffleAssert.ErrorType.REVERT
      );
    });
  });

  describe('Vouchers (ERC721)', function () {
    beforeEach('execute prerequisite steps', async () => {
      //Create first voucher set
      const txOrder = await contractBosonRouter.requestCreateOrderETHETH(
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
          to: contractBosonRouter.address,
          value: constants.PROMISE_DEPOSITSE1,
        }
      );

      truffleAssert.eventEmitted(
        txOrder,
        'LogOrderCreated',
        (ev) => {
          tokenSupplyKey1 = ev._tokenIdSupply;
          return ev._tokenIdSupply.gt(constants.ZERO);
        },
        'order1 not created successfully'
      );

      const internalVoucherKernelTx = await truffleAssert.createTransactionResult(
        contractVoucherKernel,
        txOrder.tx
      );

      truffleAssert.eventEmitted(
        internalVoucherKernelTx,
        'LogPromiseCreated',
        (ev) => {
          promiseId1 = ev._promiseId;
          return ev._promiseId > 0;
        },
        'promise event incorrect'
      );

      //Buyer commits - voucher set 1
      const txFillOrder = await contractBosonRouter.requestVoucherETHETH(
        tokenSupplyKey1,
        seller,
        {
          from: buyer,
          to: contractBosonRouter.address,
          value: constants.PROMISE_PRICE1 + constants.PROMISE_DEPOSITBU1,
        }
      );

      const internalTx = await truffleAssert.createTransactionResult(
        contractVoucherKernel,
        txFillOrder.tx
      );

      truffleAssert.eventEmitted(
        internalTx,
        'LogVoucherDelivered',
        (ev) => {
          tokenVoucherKey1 = ev._tokenIdVoucher;
          return ev._tokenIdVoucher.gt(constants.ZERO);
        },
        'order1 not created successfully'
      );

      //Create 2nd voucher set
      const txOrder2 = await contractBosonRouter.requestCreateOrderETHETH(
        [
          constants.PROMISE_VALID_FROM,
          constants.PROMISE_VALID_TO,
          constants.PROMISE_PRICE2,
          constants.PROMISE_DEPOSITSE2,
          constants.PROMISE_DEPOSITBU2,
          constants.ORDER_QUANTITY2,
        ],
        {
          from: seller,
          to: contractCashier.address,
          value: constants.PROMISE_DEPOSITSE2,
        }
      );

      truffleAssert.eventEmitted(
        txOrder2,
        'LogOrderCreated',
        (ev) => {
          tokenSupplyKey2 = ev._tokenIdSupply;
          return ev._tokenIdSupply.gt(constants.ZERO);
        },
        'order1 event incorrect'
      );

      //Buyer commits - Voucher Set 2
      const txFillOrder2 = await contractBosonRouter.requestVoucherETHETH(
        tokenSupplyKey2,
        seller,
        {
          from: buyer,
          to: contractBosonRouter.address,
          value: constants.PROMISE_PRICE2 + constants.PROMISE_DEPOSITBU2,
        }
      );
      const internalTx2 = await truffleAssert.createTransactionResult(
        contractVoucherKernel,
        txFillOrder2.tx
      );

      truffleAssert.eventEmitted(
        internalTx2,
        'LogVoucherDelivered',
        (ev) => {
          tokenVoucherKey2 = ev._tokenIdVoucher;
          return ev._tokenIdVoucher.gt(constants.ZERO);
        },
        'order2 not filled successfully'
      );
    });

    it('redeeming one voucher', async () => {
      const txRedeem = await contractBosonRouter.redeem(tokenVoucherKey1, {
        from: buyer,
      });
      const internalTx = await truffleAssert.createTransactionResult(
        contractVoucherKernel,
        txRedeem.tx
      );

      truffleAssert.eventEmitted(
        internalTx,
        'LogVoucherRedeemed',
        (ev) => {
          return (
            ev._tokenIdVoucher.eq(tokenVoucherKey1) &&
            ev._holder === buyer &&
            ev._promiseId == promiseId1
          );
        },
        'voucher not redeemed successfully'
      );

      //Check VoucherKernel state
      const voucherStatus = await contractVoucherKernel.vouchersStatus(
        tokenVoucherKey1
      );
      assert.isTrue(voucherStatus.status.eq(new BN(192)));

      const transaction = await web3.eth.getTransaction(txRedeem.tx);
      const transactionBlock = await web3.eth.getBlock(transaction.blockNumber);
      assert.isTrue(
        voucherStatus.complainPeriodStart.eq(new BN(transactionBlock.timestamp))
      );
    });
  });
}); //end of contract

