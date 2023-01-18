// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../interfaces/FeedRegistryInterface.sol";
import "../library/EnumerableTradingPairMap.sol";
import "../SID/SIDRegistry.sol";
import "../SID/resolvers/PublicResolver.sol";

/*
*   Consumer contract which retrieves price data from FeedRegistry
*   Access control is enforced for most of the trading pairs. Only whitelisted users will be able to retrieve the price data onchain
*   However, some pairs will be open to all
*   See https://oracle.binance.com/docs/price-feeds/feed-registry/ for more details.
*/
contract PriceConsumerFromRegistry {
    FeedRegistryInterface internal s_feedRegistry;

    constructor(address _sidRegistryAddress, bytes32 _feedRegistryNodeHash) {
        SIDRegistry _sidRegistry = SIDRegistry(_sidRegistryAddress);
        address _publicResolverAddress = _sidRegistry.resolver(_feedRegistryNodeHash);
        PublicResolver _publicResolver = PublicResolver(_publicResolverAddress);
        address _feedRegistryAddress = _publicResolver.addr(_feedRegistryNodeHash);
        s_feedRegistry = FeedRegistryInterface(_feedRegistryAddress);
    }

    // Get all the available feeds on the registry. A pair is (base, quote) as strings
    function getAllFeeds() external view returns (EnumerableTradingPairMap.Pair[] memory) {
        return s_feedRegistry.getAllPairs();
    }

    // Returns the details of a particular feed.
    // The structure returned is (Base token address, quote token address, Pair's feed adapter address)
    function getFeedDetails(string memory base, string memory quote) external view returns (address, address, address) {
        return s_feedRegistry.getTradingPairDetails(base, quote);
    }

    //Query using the token addresses
    function getLatestAnswer(address base, address quote)
    external
    view
    returns (int256 answer)
    {
        return s_feedRegistry.latestAnswer(base, quote);
    }

    //Query decimal point precision for the pair
    function getDecimalsForPair(address base, address quote) external view returns (uint8 decimals) {
        return s_feedRegistry.decimals(base, quote);
    }

    //Query by using base/quote token names
    function getLatestPriceByName(string calldata base, string calldata quote) external view returns (int256 answer) {
        return s_feedRegistry.latestAnswerByName(base, quote);
    }

}
