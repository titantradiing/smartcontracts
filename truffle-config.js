/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * trufflesuite.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

// const infuraKey = "fj4jll3k.....";
//
// const fs = require('fs');
// enable if use file 
// const mnemonic = fs.readFileSync(".secret").toString().trim();

function hdWalletProviderOptions(
	privateKeyEnvVarValue,
	mnemonicPhraseEnvVarValue,
	otherOpts
) {
	const opts = { ...otherOpts };
	if (privateKeyEnvVarValue) {
		opts.privateKeys = [privateKeyEnvVarValue];
	} else {
		opts.mnemonic = mnemonicPhraseEnvVarValue;
	}
	return opts;
}

const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
	/**
	 * Networks define how you connect to your ethereum client and let you set the
	 * defaults web3 uses to send transactions. If you don't specify one truffle
	 * will spin up a development blockchain for you on port 9545 when you
	 * run `develop` or `test`. You can ask a truffle command to use a specific
	 * network from the command line, e.g
	 *
	 * $ truffle test --network <network-name>
	 */
	plugins: ['truffle-plugin-verify', 'truffle-plugin-stdjsonin'],
	contracts_build_directory: "./build",
	networks: {
		// Useful for testing. The `development` name is special - truffle uses it by default
		// if it's defined here and no other network is specified at the command line.
		// You should run a client (like ganache-cli, geth or parity) in a separate terminal
		// tab if you use this network and you must also set the `host`, `port` and `network_id`
		// options below to some value.
		//
		development: {
			host: "127.0.0.1", // Localhost (default: none)
			port: 8545, // Standard Ethereum port (default: none)
			network_id: "*", // Any network (default: none)
			// provider: () =>
			// 	new HDWalletProvider(
			// 		hdWalletProviderOptions(
			// 			process.env.WALLET_PRIVATE_KEY,
			// 			process.env.WALLET_MNEMONIC,
			// 			{
			// 				providerOrUrl:
			// 					"http://127.0.0.1:8545",
			// 			}
			// 		)
			// 	),
		},
		// workaround environment to prevent truffle to always running migration when run tests
		truffletest: {
			host: "127.0.0.1", // Localhost (default: none)
			port: 8545, // Standard Ethereum port (default: none)
			network_id: "*", // Any network (default: none)			
		},
		bsctestnet: {
			networkCheckTimeout: 999999,
			provider: () =>
				new HDWalletProvider(
					hdWalletProviderOptions(
						process.env.TESTNET_WALLET_PRIVATE_KEY,
						process.env.TESTNET_WALLET_MNEMONIC,
						{
							providerOrUrl: process.env.PROVIDER_URL || "https://data-seed-prebsc-1-s1.binance.org:8545/",
						}
					)
				),			
			network_id: 0x61,
			confirmations: 10,
			timeoutBlocks: 200,
			gas: 8000000,
			skipDryRun: true,
		},
		bscmainnet: {
			provider: () =>
				new HDWalletProvider(
					hdWalletProviderOptions(
						process.env.MAINNET_WALLET_PRIVATE_KEY,
						process.env.MAINNET_WALLET_MNEMONIC,
						{
							providerOrUrl: process.env.PROVIDER_URL || "",
						}
					)
				),
			networkCheckTimeout: 999999,
			network_id: 0x38,
			confirmations: 3,
			timeoutBlocks: 200,
			// gas: 8500000,
			// gasPrice: 5000000000,
			skipDryRun: true,
		},
	},

	// Set default mocha options here, use special reporters etc.
	mocha: {
		// timeout: 100000
	},

	// Configure your compilers
	compilers: {
		solc: {
			version: "0.8.7", // Fetch exact version from solc-bin (default: truffle's version)
			//docker: true, // Use "0.5.1" you've installed locally with docker (default: false)
			settings: {
				// See the solidity docs for advice about optimization and evmVersion
				optimizer: {
					enabled: true,
					runs: 200, // default config
				},
				evmVersion: "byzantium",
				
			},
		},
	},

	// Truffle DB is currently disabled by default; to enable it, change enabled: false to enabled: true
	//
	// Note: if you migrated your contracts prior to enabling this field in your Truffle project and want
	// those previously migrated contracts available in the .db directory, you will need to run the following:
	// $ truffle migrate --reset --compile-all

	db: {
		enabled: false,
	},
	api_keys: {
		etherscan: '',
	},
	api_bscscan: {
		etherscan: '',
	}
};
