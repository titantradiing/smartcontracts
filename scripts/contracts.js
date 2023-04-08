const TESToken = artifacts.require("TESToken");

module.exports = async function(callback)  {
    const token = await TESToken.deployed();

    console.log("TES contract: " + token.address);
    

}