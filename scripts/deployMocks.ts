import { ethers } from "hardhat";
import {
  BTCUSD_FEEDADAPTER_MAINNET_ADDRESS,
  BTCUSD_FEEDADAPTER_TESTNET_ADDRESS,
  FEEDREGISTRY_MAINNET_ADDRESS,
  FEEDREGISTRY_TESTNET_ADDRESS
} from "../constants";
const hre = require("hardhat");

//Deploy to testnet/ mainnet
export async function main() {
  if(hre.network.name == "testnet") {
    const PriceConsumer_Registry = await ethers.getContractFactory("PriceConsumerFromRegistry");
    const pc = await PriceConsumer_Registry.deploy(FEEDREGISTRY_TESTNET_ADDRESS);
    await pc.deployed();
    console.log(`Testnet: Mock Price Consumer through Registry deployed to: ${pc.address}`);

    const PriceConsumer_Adapter = await ethers.getContractFactory("PriceConsumerWithAdapter");
    const pc2 = await PriceConsumer_Adapter.deploy(BTCUSD_FEEDADAPTER_TESTNET_ADDRESS);
    await pc2.deployed();
    console.log(`Testnet: Mock Price Consumer from  BTCUSD Adapter deployed to: ${pc2.address}`);
  } else {
    const PriceConsumer_Registry = await ethers.getContractFactory("PriceConsumerFromRegistry");
    const pc = await PriceConsumer_Registry.deploy(FEEDREGISTRY_MAINNET_ADDRESS);
    await pc.deployed();
    console.log(`Mainnet: Mock Price Consumer from Registry deployed to: ${pc.address}`);

    const PriceConsumer_Adapter = await ethers.getContractFactory("PriceConsumerWithAdapter");
    const pc2 = await PriceConsumer_Adapter.deploy(BTCUSD_FEEDADAPTER_MAINNET_ADDRESS);
    await pc2.deployed();
    console.log(`Mainnet: Mock Price Consumer from  BTCUSD Adapter deployed to: ${pc2.address}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
