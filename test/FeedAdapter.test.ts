import {assert, expect} from "chai";
import { ethers } from "hardhat";
import {
  getAdapterAddressByEnv,
  getRegistryAddressByEnv,
  getSIDRegistryAddressByEnv,
  getUsers
} from "./helpers/setup";
import {Contract} from "ethers";

describe("Consumer through FeedAdapter", async function () {
    let SIDRegistry: Contract
    let adapter: Contract

    before(async function () {
        const users = await getUsers()
        this.owner = users.roles.defaultAccount;
        SIDRegistry = await ethers.getContractAt('SIDRegistry', getSIDRegistryAddressByEnv())
        // FeedAdapterInterface or AggregatorV2V3Interface are equivalent
        adapter = await ethers.getContractAt('AggregatorV2V3Interface', getAdapterAddressByEnv())
    })

    it("Should be able to get description from an adapter's address", async function () {
        const description = await adapter.description()
        assert(description != null)
        console.log(`Description of the adapter: ${description}`)
    });

    it("Should be able to retrieve latest round data", async function () {
        const roundData = await adapter.latestRoundData()
        assert(roundData != null)
        console.log(`Latest round data for BTC/USD: ${roundData.toString()}`)
    })

    it("Should be able to retrieve decimals for a pair", async function () {
        const decimals = await adapter.decimals()
        assert(decimals > 0)
        console.log(`Decimals for the answer of BTC/USD: ${decimals.toString()}`)
    })
})
