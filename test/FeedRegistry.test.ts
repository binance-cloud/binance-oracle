import { assert, expect } from "chai";
import { ethers } from "hardhat";
import { getSIDResolverAddressByEnv } from "./helpers/setup";
import { Contract } from "ethers";
import { getNodeValue } from "../scripts/sid";

describe("Consumer through FeedRegistry", async function () {

    // never timeout
    this.timeout(0);

    let registry: Contract
    let resolver: Contract
    let baseSymbolAddress: string
    let quoteSymbolAddress: string

    // ----- Change your query here
    const BASE_SYMBOL = 'BTC'
    const QUOTE_SYMBOL = 'USD'

    before(async function () {
        // get adapter address
        resolver = await ethers.getContractAt('PublicResolver', getSIDResolverAddressByEnv())
        const feedRegistryAddress = await resolver['addr(bytes32)'](getNodeValue('fr'))
        console.log(feedRegistryAddress)
        registry = await ethers.getContractAt('FeedRegistryInterface', feedRegistryAddress)

        // get base and quote token address
        const pairDetail = await registry.getTradingPairDetails(BASE_SYMBOL, QUOTE_SYMBOL)
        baseSymbolAddress = pairDetail[0]
        quoteSymbolAddress = pairDetail[1]
        console.log(`${BASE_SYMBOL} token address: `, pairDetail[0])
        console.log(`${QUOTE_SYMBOL} token address: `, pairDetail[1])
        console.log(`${BASE_SYMBOL}/${QUOTE_SYMBOL} FeedAdapter contract address: `, pairDetail[2])
    })

    it("Should be able to get all the available pairs", async function () {
        const totalCount = await registry.totalPairsAvailable()
        assert(totalCount > 0)
        console.log(`Total pairs available: ${totalCount.toString()}`)

        const allPairs = await registry.getAllPairs()
        console.log(`All pairs available on registry: ${allPairs.map(p => p.toString().replace(',', '/'))}`)
    });

    it("Should be able to retrieve latest round data", async function () {
        const roundData = await registry.latestRoundData(baseSymbolAddress, quoteSymbolAddress)
        assert(roundData != null)
        console.log(`Latest round data for BTC/USD: ${roundData.toString()}`)
    })

    it("Should be able to retrieve decimals for a pair", async function () {
        const decimals = await registry.decimals(baseSymbolAddress,quoteSymbolAddress)
        assert(decimals > 0)
        console.log(`Decimals for the answer of BTC/USD: ${decimals.toString()}`)
    })
})
