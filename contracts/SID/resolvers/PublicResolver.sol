// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;
import "../SID.sol";
import "./ResolverBase.sol";

/**
 * A more advanced resolver that allows for multiple records of the same domain.
 */
contract PublicResolver is ResolverBase {
  SID immutable sid;
  uint private constant COIN_TYPE_BNB = 60;
  mapping(bytes32 => mapping(uint => bytes)) _addresses;

  constructor(SID _sid) {
    sid = _sid;
  }

  function addr(bytes32 node) public view virtual returns (address payable) {
    bytes memory a = addr(node, COIN_TYPE_BNB);
    if (a.length == 0) {
      return payable(0);
    }
    return bytesToAddress(a);
  }

  function setAddr(bytes32 node, address a)
  external
  virtual
  authorised(node)
  {
    setAddr(node, COIN_TYPE_BNB, addressToBytes(a));
  }

  function setAddr(
    bytes32 node,
    uint coinType,
    bytes memory a
  ) public virtual authorised(node) {
    if (coinType == COIN_TYPE_BNB) {}
    _addresses[node][coinType] = a;
  }

  function isAuthorised(bytes32 node) internal view override returns (bool) {
    address owner = sid.owner(node);
    return owner == msg.sender;
  }

  function bytesToAddress(bytes memory b)
  internal
  pure
  returns (address payable a)
  {
    require(b.length == 20);
    assembly {
      a := div(mload(add(b, 32)), exp(256, 12))
    }
  }

  function addressToBytes(address a) internal pure returns (bytes memory b) {
    b = new bytes(20);
    assembly {
      mstore(add(b, 32), mul(a, exp(256, 12)))
    }
  }

  function addr(bytes32 node, uint coinType)
  public
  view
  virtual
  returns (bytes memory)
  {
    return _addresses[node][coinType];
  }
}
