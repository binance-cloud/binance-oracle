// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

interface SIDPublicResolver {
  function addr(bytes32 node) external view returns (address);
}
