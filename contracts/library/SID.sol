// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interfaces/SIDRegistry.sol";
import "../interfaces/SIDPublicResolver.sol";

library SID {

  address internal constant SID_REGISTRY = 0x08CEd32a7f3eeC915Ba84415e9C07a7286977956;

  /**
  * @notice Obtain the contract address by passing the node value to the SID resolver
  * @return address
  */
  function resolve(bytes32 node) public view returns (address) {
    SIDRegistry sid = SIDRegistry(SID_REGISTRY);
    SIDPublicResolver resolver = sid.resolver(node);
    return resolver.addr(node);
  }
}

