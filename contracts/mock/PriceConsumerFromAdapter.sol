// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../interfaces/AggregatorV2V3Interface.sol";
import "../SID/SIDRegistry.sol";
import "../SID/resolvers/PublicResolver.sol";

/*
*   Consumer contract which retrieves price data from a FeedAdapter of a particular trading pair
*   Access control is enforced for most of the trading pairs. Only whitelisted users will be able to retrieve the price data onchain
*   However, some pairs will be open to all
*   See https://oracle.binance.com/docs/price-feeds/feed-adapter/ for more details.
*/
contract PriceConsumerWithAdapter {
    AggregatorV2V3Interface private s_feedAdapter;

    constructor(address _sidRegistryAddress, bytes32 _feedAdapterNodeHash) {
        SIDRegistry _sidRegistry = SIDRegistry(_sidRegistryAddress);
        address _publicResolverAddress = _sidRegistry.resolver(_feedAdapterNodeHash);
        PublicResolver _publicResolver = PublicResolver(_publicResolverAddress);
        address _feedAdapterAddress = _publicResolver.addr(_feedAdapterNodeHash);
        s_feedAdapter = AggregatorV2V3Interface(_feedAdapterAddress);
    }

    function getDescription() external view returns (string memory) {
        return s_feedAdapter.description();
    }

    function getDecimals() external view returns (uint8) {
        return s_feedAdapter.decimals();
    }

    function getLatestAnswer()
    external
    view
    returns (int256 answer)
    {
        return s_feedAdapter.latestAnswer();
    }
}
