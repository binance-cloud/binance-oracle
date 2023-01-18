import { ethers } from "hardhat";
import {
  FEED_REGISTRY_SID_SUBDOMAIN,
  SYMBOL_PAIR_SUBDOMAINS,
} from "../constants";
import hre from 'hardhat'
import { getNodeValue } from '../scripts/sid'
import { getSIDResolverAddressByEnv } from "../test/helpers/setup";

//Deploy to testnet/mainnet
export async function main() {

  // get adapter address
  const resolver = await ethers.getContractAt('PublicResolver', getSIDResolverAddressByEnv())

  // Deploy feed registry
  const frNode = getNodeValue(`${FEED_REGISTRY_SID_SUBDOMAIN}`)
  const feedRegistryAddress = await resolver['addr(bytes32)'](frNode)
  const PriceConsumerFromRegistry = await ethers.getContractFactory("PriceConsumerFromRegistry");
  const feedRegistryConsumer = await PriceConsumerFromRegistry.deploy(feedRegistryAddress, { gasLimit: 1000000 });
  await feedRegistryConsumer.deployed();
  console.log(`[${hre.network.name}] Mock Price Consumer through Registry deployed to: ${feedRegistryConsumer.address}`);

  // deploy feed adapters on by one
  const feedAdapters = {}
  for (const symbolPair of SYMBOL_PAIR_SUBDOMAINS) {
    const adapterAddress = await resolver['addr(bytes32)'](getNodeValue(symbolPair))
    const PriceConsumerWithAdapter = await ethers.getContractFactory("PriceConsumerWithAdapter");
    const adapterConsumer = await PriceConsumerWithAdapter.deploy(adapterAddress, { gasLimit: 1000000 });
    await adapterConsumer.deployed();
    feedAdapters[symbolPair] = adapterConsumer.address;
    console.log(`[${hre.network.name}] Mock Price Consumer from ${symbolPair} Feed Adapter deployed to: ${adapterConsumer.address}`);
  }

  console.log('Verify your contracts running the these commands:')
  console.log('*** Don\'t forget to set your ETHERSCAN_API_KEY in the .env file ***')
  console.log(`npx hardhat verify ${feedRegistryConsumer.address} --network ${hre.network.name}`)
  for(const addr of Object.values(feedAdapters)) {
    console.log(`npx hardhat verify ${addr} --network ${hre.network.name}`)
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
