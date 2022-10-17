import { ethers } from 'hardhat'
import { Signer } from 'ethers'
import {
    BTC_TOKEN_MAINNET_ADDRESS,
    BTC_TOKEN_TESTNET_ADDRESS,
    BTCUSD_FEEDADAPTER_MAINNET_ADDRESS,
    BTCUSD_FEEDADAPTER_TESTNET_ADDRESS,
    FEEDREGISTRY_MAINNET_ADDRESS,
    FEEDREGISTRY_TESTNET_ADDRESS,
    REGISTRY_LIB_MAINNET_ADDRESS,
    REGISTRY_LIB_TESTNET_ADDRESS,
    USD_TOKEN_MAINNET_ADDRESS, USD_TOKEN_TESTNET_ADDRESS
} from "../../constants";
const hre = require("hardhat");

export interface Roles {
    defaultAccount: Signer
    walletAccount1: Signer
}

export interface Users {
    roles: Roles
}

export async function getUsers() {
    const accounts = await ethers.getSigners()
    const roles: Roles = {
        defaultAccount: accounts[0],
        walletAccount1: accounts[1],
    }
    const users: Users = {
        roles,
    }
    return users
}

export function getLibAddressByEnv() {
    if  (hre.network.name == "testnet") {
        return REGISTRY_LIB_TESTNET_ADDRESS
    } else {
        return REGISTRY_LIB_MAINNET_ADDRESS
    }
}
export function getRegistryAddressByEnv() {
    if  (hre.network.name == "testnet") {
        return FEEDREGISTRY_TESTNET_ADDRESS
    } else {
        return FEEDREGISTRY_MAINNET_ADDRESS
    }
}

export function getAdapterAddressByEnv() {
    if  (hre.network.name == "testnet") {
        return BTCUSD_FEEDADAPTER_TESTNET_ADDRESS
    } else {
        return BTCUSD_FEEDADAPTER_MAINNET_ADDRESS
    }
}

export function getBTCAddressByEnv() {
    if  (hre.network.name == "testnet") {
        return BTC_TOKEN_TESTNET_ADDRESS
    } else {
        return BTC_TOKEN_MAINNET_ADDRESS
    }
}

export function getUSDAddressByEnv() {
    if  (hre.network.name == "testnet") {
        return USD_TOKEN_TESTNET_ADDRESS;
    } else {
        return USD_TOKEN_MAINNET_ADDRESS
    }
}
