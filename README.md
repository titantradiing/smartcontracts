# TES smart contract 

Smart contract for TES which a EVM multichain token ( ERC20, BEP20, etc ) for titan trading bot.


### Requirement Environment with Tool:
- ubuntu >= 20.04 or macosx > 10.13.x
- nodejs >= 14.7
- truffle or hardhat ( in this source we use hardhat )
- docker 
- ganache ( local dev )
- remix ide ( options )

### How to setup for development
- Setup dependency package
`run npm install`

- Start ganache with config port 8545 or use hardhat
`npm run ganache`

- Start docker ( option ) for download solidity compile runtime.
- Start remixd ide for coding or use visual code.

- You need to run compile all source solidity:
`npm run compile`

- To compile without cache use 
`npm run build`

- For running testcase use 
`npm run test`

- Check coverage from unittest use 
`npm run coverage`

### Create and run migration

- Firstly, you need to run compile all source solidity

`npm run compile`

- Then, add new migrations/deploy file into folder ./migrations with specific number 
for example:
`touch ./migrations/3_make_new_contract.js`

- Implement logic for migration and deploy with

`./node_modules/.bin/hardhat run --network localhost migrations/2_init_tes_token.js`

- In that case you want deploy with testnet or mainnet, please update into file `hardhat.config.js` then run with specific network 

`./node_modules/.bin/hardhat run --network [network] migrations/2_init_tes_token.js`

note: please replace private key deploy address for deploy to mainnet/test 

`export MAINNET_ENDPOINT=xxxxx` 



