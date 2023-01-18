import { ethers } from 'hardhat'
import { Signer } from 'ethers'
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

export function getSIDResolverAddressByEnv() {
    return hre.network.name == "testnet" ? "0x65085651CcbCd165A9d20902ED1dFFB823d915A2" : "0x65085651CcbCd165A9d20902ED1dFFB823d915A2"
}
