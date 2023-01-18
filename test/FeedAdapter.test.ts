import { assert } from "chai";
import { ethers } from "hardhat";
import { getSIDResolverAddressByEnv } from "./helpers/setup";
import { getNodeValue } from '../scripts/sid'
import { Contract } from "ethers";

describe("Consumer through FeedAdapter", async function () {

    let adapter: Contract
    let resolver: Contract

    // Access the full list of supporting symbol pairs through the following links:
    // BSC Mainnet: https://oracle.binance.com/docs/price-feeds/contract-addresses/bnb-mainnet
    // BSC Testnet: https://oracle.binance.com/docs/price-feeds/contract-addresses/bnb-testnet
    const symbolPair = 'btc-usd'

    before(async function () {
        // get adapter address
        resolver = await ethers.getContractAt('PublicResolver', getSIDResolverAddressByEnv())
        // NOTE: We use lowercase in Space ID
        const adapterAddress = await resolver['addr(bytes32)'](getNodeValue(symbolPair.toLowerCase()))
        // FeedAdapterInterface or AggregatorV2V3Interface are equivalent
        adapter = await ethers.getContractAt('AggregatorV2V3Interface', adapterAddress)
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
