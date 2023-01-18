// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "../interfaces/AggregatorV2V3Interface.sol";

/*
*   Consumer contract which retrieves price data from a FeedAdapter of a particular trading pair
*   Access control is enforced for most of the trading pairs. Only whitelisted users will be able to retrieve the price data onchain
*   However, some pairs will be open to all
*   See https://oracle.binance.com/docs/price-feeds/feed-adapter/ for more details.
*/
contract PriceConsumerWithAdapter {
    AggregatorV2V3Interface private s_feedAdapter;

    constructor(address _feedAdapterAddress) {
        s_feedAdapter = AggregatorV2V3Interface(_feedAdapterAddress);
    }

    function getDescription() public view returns (string memory) {
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
