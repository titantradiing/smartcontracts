const {expect} = require("chai");
const TESToken = artifacts.require("TESToken");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("token", function ( accounts ) {
	beforeEach(async function () {
		this.token = await TESToken.deployed();
		this.totalSupply = web3.utils.toWei("100000000", "ether");
	});

	it("should has 100.000.000 tokens", async function () {
		// rate 1 => 1 token bits = 1 wei
		total = await this.token.totalSupply();
		expect(total.toString()).to.equal(this.totalSupply);

	});

	it("check deployers account", async function() {
		deployer = accounts[0];
		allowance = await this.token.balanceOf(deployer);
		expect(allowance.toString()).to.equal(this.totalSupply);
	});
});
