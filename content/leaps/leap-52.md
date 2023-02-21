---
LEAP: 52
title: SNX Perps V2 hedging and Cash Collateralization on Optimism
status: Draft
author: GUNBOATs (@gunboatsss), Mastermojo83, Ksett
created: 2023-02-21
---

<!--You can leave these HTML comments in your merged LEAP and delete the visible duplicate text guides, they will not appear and may be helpful to refer to if you edit it again. This is the suggested template for new LEAPs. Note that a LEAP number will be assigned by an editor. When opening a pull request to submit your LEAP, please use an abbreviated title in the filename, `leap-draft_title_abbrev.md`. The title should be 44 characters or less.-->

This is the suggested template for new LEAP. Note that a LEAP number will be assigned by an editor. When opening a pull request to submit your LEAP, please use an abbreviated title in the filename, `leap-draft_title_abbrev.md`. The title should be 44 characters or less.

## Simple Summary
<!--"If you can't explain it simply, you don't understand it well enough." Simply describe the outcome the proposed changes intends to achieve. This should be non-technical and accessible to a casual community member.-->
Integrate Lyra with Synthetix Perps V2 and deploy a cash collateralized version of the contracts on Optimism.

## Abstract
<!--A short (~200 word) description of the proposed change, the abstract should clearly describe the proposed change. This is what *will* be done if the LEAP is implemented, not *why* it should be done or *how* it will be done. If the LEAP proposes deploying a new contract, write, "we propose to deploy a new contract that will do x".-->
Deploy a new version of the Lyra protocol to Optimism, using SNX V2 perpetual futures as the source of liquidity with which to delta hedge the AMM. These contracts will support USDC as a `quoteAsset`, whilst using wETH, wBTC, and native tokens (e.g. UNI) as collateral against short call positions as well as routing the hedger to swap USDC to sUSD (or snxUSD in future versions).

## Motivation
<!--This is the problem statement. This is the *why* of the LEAP. It should clearly explain *why* the current state of the protocol is inadequate.  It is critical that you explain *why* the change is needed, if the LEAP proposes changing how something is calculated, you must address *why* the current calculation is innaccurate or wrong. This is not the place to describe how the LEAP will address the issue!-->
After the success of Lyra’s cash-collateralized Newport version on Arbitrum, this LEAP proposes to apply a similar mechanism and improve capital efficiency in Lyra’s Optimism deployment by removing the need for the AMM to lock one `baseAsset` (i.e. sETH) per call sold. To achieve this, the pool will instead hold a significant portion against the options in cash and all `quoteAsset` funds held by the pool will be available for delta hedging. 

Notably, not being fully collateralized opens the pool to possible insolvency. To handle these black swan events, contract adjustments will be introduced which reduce long holder positions, allowing all long holders to get an equal share, and preventing the LP from being emptied fully.

This deployment will normalize the AMMs returns and lessen the protocol’s reliance on rebates and direct integration fees from Synthetix to provide competitive bid/ask spreads. By integrating with multiple perpetual futures platforms, the resiliency of the protocol to an individual shock to one of them increases. Optimism has a vibrant defi community and by deploying the most capital-efficient version of the protocol, we can provide the most competitive and liquid markets to our integrators within the Optimism ecosystem
Further, the use of USDC as quote collateral (and wrapped ETH/BTC + native collateral for DeFi tokens), will increase the pool liquidity available to Lyra for use within the protocol. Using a Curve integration to swap to sUSD in order to hedge will decrease our reliance on spot synthetic assets and minimize any scaling issues around sUSD supply. Furthermore, the sUSD 3-curve pools has $41m TVL which should handle hedging with ease.

Synthetix Perps V2 will significantly reduce perps trading fees to only 5-10 basis points while maintaining optimal performance and execution efficiency. These reduced fees will open up endless opportunities and growth within the Lyra ecosystem.

New off-chain oracles provided by Pyth Network allow perps fees to be reduced to 5-10bps—on par with centralized perps platforms. These oracles, pioneered by SNX, greatly improve the trader experience & minimize the risk of frontrunning attacks. They work as follows: off-chain oracles save prices off-chain and are provided to traders by keepers when a trade is initiated, with an 8-sec delay due to block times. The on-chain validation process includes staleness checks, key-threshold confirmation, and a final check against on-chain oracles. This has improved from spot trading fees which ranged from 30-100bps, reducing cost by 6-10x.

The price impact function of SNX Perps V2 incentivizes arbitrage traders with a price discount given to traders who return markets to neutral. Funding rate changes allow funding rates to drift upwards in the presence of continued imbalance, incentivizing arbitrage traders to step in.

Both functions will introduce arbitrage opportunities for traders to keep markets neutral over the long term. This innovative path to risk management will help increase scalability and capital efficiency while supporting a wider range of markets.

Synthetix recently released 22 new perpetual futures for the total of 23 markets as in writing of this LEAP. It has markets including but not limited to OP, DOGE, Gold, and more to come over the coming weeks. This will allow greater flexibility for Lyra to add additional markets. 
https://blog.synthetix.io/22-new-synthetix-perp-futures-market-are-now-live/ 


## Specification
<!--The specification should describe the syntax and semantics of any new feature, there are five sections
1. Overview
2. Rationale
3. Technical Specification
4. Test Cases
5. Configurable Values
-->
The Lyra protocol’s Optimism contracts will need to be modified to handle `quoteAsset` and `baseAsset` ERC20 tokens.

The `SynthetixAdapter` will be replaced by a `SynthetixPerpAdapter` contract. The  `SynthetixPerpAdapter` will be responsible for handling swapping covered call collateral (`baseAsset`) collected at settlement and during liquidations into `quoteAsset`.

### Delta Hedging
The `ShortPoolHedger` will be replaced by a `SNXFuturesPoolHedger` contract. This will be responsible for opening and managing perpetual future positions against the SNX pool to delta-hedge the liquidity pool.

The hedger will be responsible for swapping USDC into sUSD prior to hedging the MMV with SNX Perps and trading sUSD that is not being used to hedge back into USDC.
The hedger should also check the premium/discount function on SNX Perps prior to allowing trades, hedging, or liquidating after settlement, blocking short delta trades if the premium is too high and blocking long delta trades if the discount is too high. Trades and hedges should both be blocked if the premium/discount is over a certain % until the market has had a chance to normalize.
Within the `SNXFuturesPoolHedger` target leverage can be specified, allowing for greater capital efficiency of the Liquidity Pool funds being used to hedge.

### Liquidity Pool Changes

There will be an additional `canHedge` check added to the `LiquidityPool` contract, which will block the opening of trades when the hedging module (`SNXFuturesPoolHedger`) deems the position to increase risk beyond an acceptable threshold (i.e. the delta exposure increases beyond the available hedging liquidity on SNX).

### Configurable Values
<!--Please list all values configurable under this implementation.-->
| Parameter      | Description                                                             | Value |
|----------------|-------------------------------------------------------------------------|-------|
| deltaThreshold | Bypass the interaction delay if the required hedge is greater than this | 100   |
| targetLeverage | Target leverage ratio                                                   | 1.5   |
| leverageBuffer | Leverage tolerance before allowing collateral updates                   | 0.4   |
| minCancelDelay | Seconds until a pending order can be canceled                           | 120   |

## Copyright
Copyright and related rights waived via [CC0](https://creativecommons.org/publicdomain/zero/1.0/).
