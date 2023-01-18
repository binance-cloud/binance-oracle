import { ethers } from "hardhat";
import {
  FEED_REGISTRY_SID_SUBDOMAIN,
  SYMBOL_PAIR_SUBDOMAINS,
} from "../constants";
import hre from 'hardhat'
import { getNodeValue } from '../scripts/sid'
import { getSIDRegistryAddressByEnv } from "../test/helpers/setup";
import fs from 'fs';

//Deploy to testnet/mainnet
export async function main() {

  // Deploy feed registry
  const frNode = getNodeValue(`${FEED_REGISTRY_SID_SUBDOMAIN}`)
  const PriceConsumerFromRegistry = await ethers.getContractFactory("PriceConsumerFromRegistry");
  const feedRegistryConsumer = await PriceConsumerFromRegistry.deploy(
    getSIDRegistryAddressByEnv(),
    frNode,
    {
      gasLimit: 1000000
    }
  );
  await feedRegistryConsumer.deployed();
  // save arguments
  fs.writeFileSync('./fr.js', `module.exports = ${JSON.stringify([getSIDRegistryAddressByEnv(), frNode])}`)
  console.log(`[${hre.network.name}] Mock Price Consumer through Registry deployed to: ${feedRegistryConsumer.address}`);

  // deploy feed adapters on by one
  const feedAdapters = {}
  for (const symbolPair of SYMBOL_PAIR_SUBDOMAINS) {
    // const adapterAddress = await resolver['addr(bytes32)'](getNodeValue(symbolPair))
    const PriceConsumerWithAdapter = await ethers.getContractFactory("PriceConsumerWithAdapter");
    const adapterConsumer = await PriceConsumerWithAdapter.deploy(
      getSIDRegistryAddressByEnv(),
      getNodeValue(symbolPair),
      {
        gasLimit: 1000000
      });
    await adapterConsumer.deployed();
    feedAdapters[symbolPair] = adapterConsumer.address;
    fs.writeFileSync(`./${symbolPair}.js`, `module.exports = ${JSON.stringify([getSIDRegistryAddressByEnv(), getNodeValue(symbolPair)])}`)
    console.log(`[${hre.network.name}] Mock Price Consumer from ${symbolPair} Feed Adapter deployed to: ${adapterConsumer.address}`);
  }

  console.log('Verify your contracts running the these commands, then you can interact with your consumer contracts on BSCScan!')
  console.log('*** Don\'t forget to set your ETHERSCAN_API_KEY in the .env file ***')
  console.log(`npx hardhat verify ${feedRegistryConsumer.address} --network ${hre.network.name} --constructor-args ./fr.js`)
  for(const addr in feedAdapters) {
    console.log(`npx hardhat verify ${feedAdapters[addr]} --network ${hre.network.name} --constructor-args ./${addr}.js`)
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
