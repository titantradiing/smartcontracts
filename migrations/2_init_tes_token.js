// We require the Hardhat Runtime Environment explicitly here. This is optiona// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  var pancakeswapRouter;
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  if (ethers.provider.network === "truffletest") {
    return;
  }
  
  if (ethers.provider.network  === "localhost" || ethers.provider.network === "development" || ethers.provider.network  === "development-fork") {
    pancakeswapRouter = '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3';
  }

  else if (ethers.provider.network  === 'bsctestnet' || ethers.provider.network  === 'bsctestnet-fork') {
    pancakeswapRouter = '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3';

  } else if  (ethers.provider.network  == "bscmainnet" || ethers.provider.network  == "bscmainnet-fork") {
    pancakeswapRouter = '0x10ED43C718714eb63d5aA57B78B54704E256024E';
  }

  const TES = await ethers.getContractFactory("TESToken");
  const tesToken = await TES.deploy();

  if (ethers.provider.network === 'bscmainnet' || ethers.provider.network === 'bscmainnet-fork' ||
   ethers.provider.network === 'bsctestnet' || ethers.provider.network === 'bsctestnet-fork') {
    await tesToken.initSwap(pancakeswapRouter);
    await tesToken.setSwapBalance(deployer.address);
  }

  console.log(
    `TESToken deployed to ${tesToken.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
