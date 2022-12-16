import { ethers } from "hardhat";
import {
  SID_TOP_DOMAIN,
  FEED_REGISTRY_SID_SUBDOMAIN,
} from "../constants";
import hre from 'hardhat'
import { getNodeValue } from '../scripts/sid'

//Deploy to testnet/ mainnet
export async function main() {
  const FR_NODE = getNodeValue(SID_TOP_DOMAIN + "." + FEED_REGISTRY_SID_SUBDOMAIN);
  const BTCUSD_NODE = getNodeValue(SID_TOP_DOMAIN + "." + FEED_REGISTRY_SID_SUBDOMAIN);

  const PriceConsumer_Registry = await ethers.getContractFactory("PriceConsumerFromRegistry");
  const pc = await PriceConsumer_Registry.deploy(FR_NODE);
  await pc.deployed();
  console.log(`${hre.network.name}: Mock Price Consumer through Registry deployed to: ${pc.address}`);

  const PriceConsumer_Adapter = await ethers.getContractFactory("PriceConsumerWithAdapter");
  const pc2 = await PriceConsumer_Adapter.deploy(BTCUSD_NODE);
  await pc2.deployed();
  console.log(`${hre.network.name}: Mock Price Consumer from  BTCUSD Adapter deployed to: ${pc2.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
