
# Binance-Oracle
Binance Oracle lets smart contracts query the price of assets on BSC. For detailed documentation, please visit [docs](https://oracle.binance.com/docs).

## Installation
If you like to import the Binance-Oracle contracts into your project, you can do so by running the following command:
```shell
npm install --save-dev @binance-oracle/binance-oracle-starter
```
## Import contracts to solidity

After installation, for instance if you like to import the 'FeedRegistryInterface' contract, you can do so by running the following command:

```solidity 
import "@binance-oracle/binance-oracle-starter/contracts/FeedRegistryInterface.sol";
```


## Run standalone tests

```shell
npm install
npm hardhat test
```

## Deploy mock consumer contracts to Testnet/ Mainnet

First make sure, you copy .env.example to .env in the root directory of the project. 
The .env file should be populated with the private keys and few other credentials of the environment you like to deploy to.
Then run either of the scripts below to deploy to Testnet or Mainnet

```shell
npm run deploy:testnet
npm run deploy:mainnet
```



