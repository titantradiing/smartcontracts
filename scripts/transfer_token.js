const TESToken = artifacts.require("TESToken");
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');


module.exports = async function(callback)  {
    const { argv } = yargs(hideBin(process.argv)).usage("Usage: $0 -c [addr] -u [addr] -n [amount]")
        .option("c", {
            alias: "contract_address",
            describe: "contract address of tes",
            type: "string",
            nargs: 1,
        }).option("u", {
            alias: "user_address",
            describe: "user address will be got token",
            type: "string",
            nargs: 1,
        }).option("n", {
            alias: "amount",
            describe: "amount of token that user 'll be received",
            type: "number",
            nargs: 1,
        });

    let tesAddr = argv.contract_address;
    let userAddr = argv.user_address;
    let amount = argv.amount;

    if (tesAddr && userAddr && amount) {
        const tesToken = await TESToken.at(tesAddr);
        await tesToken.transfer(userAddr, amount);
        console.log("Sending token to address %s with amount %s", userAddr, amount);
    }
    console.log("Finished");
    process.exit(0);
}
