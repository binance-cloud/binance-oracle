import { ethers } from "hardhat";
import {
  SID_TOP_DOMAIN,
  FEED_REGISTRY_SID_SUBDOMAIN,
  SYMBOL_PAIR_SUBDOMAINS,
} from "../constants";
import hre from 'hardhat'
import { getNodeValue } from '../scripts/sid'

const SID_REGISTRY = hre.network.name == "testnet" ? "0xfFB52185b56603e0fd71De9de4F6f902f05EEA23" : "0x08CEd32a7f3eeC915Ba84415e9C07a7286977956"

//Deploy to testnet/mainnet
export async function main() {

  // Deploy feed registry
  const FR_NODE = getNodeValue(SID_TOP_DOMAIN + "." + FEED_REGISTRY_SID_SUBDOMAIN);
  const PriceConsumerFromRegistry = await ethers.getContractFactory("PriceConsumerFromRegistry");
  const feedRegistryConsumer = await PriceConsumerFromRegistry.deploy(SID_REGISTRY, FR_NODE, { gasLimit: 500000 });
  await feedRegistryConsumer.deployed();
  console.log(`[${hre.network.name}] Mock Price Consumer through Registry deployed to: ${feedRegistryConsumer.address}`);

  // deploy feed adapters on by one
  const feedAdapters = {}
  for (const SYMBOL_PAIR of SYMBOL_PAIR_SUBDOMAINS) {
    const node = getNodeValue(SYMBOL_PAIR);
    const PriceConsumerWithAdapter = await ethers.getContractFactory("PriceConsumerWithAdapter");
    const adapterConsumer = await PriceConsumerWithAdapter.deploy(SID_REGISTRY, node, { gasLimit: 500000 });
    await adapterConsumer.deployed();
    feedAdapters[SYMBOL_PAIR] = adapterConsumer.address;
    console.log(`[${hre.network.name}] Mock Price Consumer from ${SYMBOL_PAIR.toUpperCase()} Feed Adapter deployed to: ${adapterConsumer.address}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
