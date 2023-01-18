// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../interfaces/SIDRegistry.sol";
import "../interfaces/SIDPublicResolver.sol";

library SID {
  /**
  * @notice Obtain the contract address by passing the node value to the SID resolver
  * @return address
  */
  function resolve(address sidRegistryAddr, bytes32 node) internal view returns (address) {
    SIDRegistry sid = SIDRegistry(sidRegistryAddr);
    SIDPublicResolver resolver = sid.resolver(node);
    return resolver.addr(node);
  }
}

