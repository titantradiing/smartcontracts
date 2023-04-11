const TESToken = artifacts.require("TESToken");

module.exports = async function (deployer, network, accounts) {

  if (network === "truffletest") {
    return;
  }
  
  if (network === "development" || network === "development-fork") {
    pancakeswapRouter = '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3';
  }

  else if (network === 'bsctestnet' || network === 'bsctestnet-fork') {
    pancakeswapRouter = '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3';

  } else if  (network == "bscmainnet" || network == "bscmainnet-fork") {
    pancakeswapRouter = '0x10ED43C718714eb63d5aA57B78B54704E256024E';
  }

  await deployer.deploy(TESToken);
  const tesToken = await TESToken.deployed();  
  
  if (network === 'bscmainnet' || network === 'bscmainnet-fork' || network === 'bsctestnet' || network === 'bsctestnet-fork') {
    await tesToken.initSwap(pancakeswapRouter);
    await tesToken.initblacklistTime();
    await tesToken.setBpEnabled(false);
    await tesToken.setSwapBalance(accounts[0]);
  }
  
};


