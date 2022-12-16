// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SIDPublicResolver.sol";

interface SIDRegistry {
  function resolver(bytes32 node) external view returns (SIDPublicResolver);
}
