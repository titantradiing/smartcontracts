const { expect } = require('chai');
describe('TESToken', function () {
  let contract;
  let erc20;

  let happyPathAccount;
  let unhappyPathAccount;
  const amount = ethers.utils.parseUnits("10.0");
  before(async function () {
    /**
     * Deploy ERC20 token
     * */
    const ERC20Contract = await ethers.getContractFactory("TESToken");
    erc20 = await ERC20Contract.deploy();
    await erc20.deployed()
    /**
     * Get test accounts
     * */
    const accounts = await hre.ethers.getSigners();
    deployer = accounts[0];
    // anotherAccount = accounts[1];
    // /**
    //  * Transfer some ERC20s to happyPathAccount
    //  * */
    // const transferTx = await erc20.transfer(anotherAccount.address, "80000000000000000000");
    // await transferTx.wait();
  });

  it("check total TES", async function () {
    // const contractWithSigner = contract.connect(happyPathAccount);
    // const trxHash = await contract.getHash(amount);
    // const depositEscrowTx = await contractWithSigner.depositEscrow(trxHash, amount);
    const total = await erc20.totalSupply();
    const convert = ethers.utils.parseUnits("100000000");

    expect(
      (await erc20.balanceOf(deployer.address)).toString()
    ).to.equal(convert);
  });

  it("after transfer TES", async function () {
    const accounts = await hre.ethers.getSigners();
    anotherAccount = accounts[1];
    const convert = ethers.utils.parseUnits("100.0");
    // /**
    //  * Transfer some ERC20s to happyPathAccount
    //  * */
    const transferTx = await erc20.transfer(anotherAccount.address, convert);
    await transferTx.wait();

    expect(
      (await erc20.balanceOf(anotherAccount.address)).toString()
    ).to.equal(convert);
  });

  it("check burn TES", async function () {
    const accounts = await hre.ethers.getSigners();
    const burnAmount = ethers.utils.parseUnits("1.0");

    const beforeTotal = await erc20.totalSupply();
    await erc20.burn(burnAmount);
    const afterTotal = await erc20.totalSupply();

    expect(
      (afterTotal - 0.0).toString()).to.equal((beforeTotal - burnAmount).toString());
  });

  it("check fee TES", async function () {


    let [buyFee, sellFee] = await erc20.getFees();

    expect
      (buyFee).to.equal(0);
    expect
      (sellFee).to.equal(0);

    await erc20.setSellFeeRate(1);
    await erc20.setBuyFeeRate(2);

    [buyFee, sellFee] = await erc20.getFees();

    expect
      (buyFee).to.equal(2);
    expect
      (sellFee).to.equal(1);
   
  });

  it("test init swap with pancake", async function () {
    try{
        const accounts = await hre.ethers.getSigners();
        await erc20.initSwap(accounts[0].address);
    } catch(e) {
        console.log("cannot process init swap panckage for missing pancake contract");
    }
  });

  it("check whitelist and fee for swap", async function () {
    const accounts = await hre.ethers.getSigners();
    anotherAccount2 = accounts[2];
    anotherAccount3 = accounts[3];
    anotherAccount4 = accounts[4];

    await erc20.setWhiteLists(anotherAccount2.address);
    
    await erc20.setEnableTransferFee(false);
    await erc20.setSellFeeRate(5);
    await erc20.setBuyFeeRate(5);

    await erc20.setSwapBalance(anotherAccount4.address);
    await erc20.setPairAddress(anotherAccount4.address);

    const amount = ethers.utils.parseUnits("100.0");
    let transferTx = await erc20.transfer(anotherAccount2.address, amount);
    await transferTx.wait();

    expect(
        (await erc20.balanceOf(anotherAccount2.address)).toString()
    ).to.equal((amount - 0.0).toString());

    await erc20.setEnableTransferFee(true);

    transferTx = await erc20.transfer(anotherAccount3.address, amount);
    await transferTx.wait();

    expect(
        (await erc20.balanceOf(anotherAccount3.address)).toString()
    ).to.not.equal((amount - 0.0).toString());

    await erc20.removeWhiteLists(anotherAccount2.address);

    const a = ethers.utils.parseUnits("5.0");
    try{
        await erc20.updateSwapBalance(a);
    } catch(e) {
        console.log("cannot process for missing router pancacke");
    }
  });

})