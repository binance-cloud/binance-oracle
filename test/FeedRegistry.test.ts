import {assert, expect} from "chai";
import { ethers } from "hardhat";
import {getBTCAddressByEnv, getRegistryAddressByEnv, getUSDAddressByEnv, getUsers} from "./helpers/setup";
import {Contract} from "ethers";

describe("Consumer through FeedRegistry", async function () {
    let registry: Contract

    before(async function () {
        const users = await getUsers()
        this.owner = users.roles.defaultAccount;
        registry = await ethers.getContractAt('FeedRegistryInterface', getRegistryAddressByEnv())
    })

    it("Should be able to get all the available pairs", async function () {
        const totalCount = await registry.totalPairsAvailable()
        assert(totalCount > 0)
        console.log(`Total pairs available: ${totalCount.toString()}`)

        const allPairs = await registry.getAllPairs()
        console.log(`All pairs available on registry: ${allPairs.map(p => p.toString().replace(',', '/'))}`)
    });

    it("Should be able to retrieve latest round data", async function () {
        const roundData = await registry.latestRoundData(getBTCAddressByEnv(), getUSDAddressByEnv())
        assert(roundData != null)
        console.log(`Latest round data for BTC/USD: ${roundData.toString()}`)
    })

    it("Should be able to retrieve decimals for a pair", async function () {
        const decimals = await registry.decimals(getBTCAddressByEnv(), getUSDAddressByEnv())
        assert(decimals > 0)
        console.log(`Decimals for the answer of BTC/USD: ${decimals.toString()}`)
    })

    it("Should be able to retrieve details of a pair", async function () {
        const details = await registry.getTradingPairDetails("BTC", "USD")
        assert(details != null)
        console.log('BTC token address', details[0],'\n', 'USD token address',
            details[1] ,'\n', 'Feed adapter address', details[2],'\n')
    })
})