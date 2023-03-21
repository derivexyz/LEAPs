---
LEAP: 51
title: LYRA Market Making Proposal - Arrakis PALM
status: Draft
author: barbarossa <0xbarbarossa@arrakis.fi>

created: 2023-03-21
---

## Simple Summary
Deploy Arrakis PALM to conduct market-making for LYRA/WETH with Lyra POL on mainnet UniV3.

## Abstract
**Arrakis PALM** - Protocol Automated Liquidity Management - built by [Arrakis Finance](https://www.arrakis.finance/), is a novel liquidity bootstrapping mechanism that taps into the organic trading volume on UniV3. It is the first product built on top of the Arrakis infrastructure.

In essence, PALM helps protocols bootstrap their base asset inventory (ETH, DAI, etc.) and attain deep and sustainable liquidity. The major advantages of using PALM include:
- **Zero incentive**: no LM incentive needed, liquidity bootstrapping is done solely via market making.
- **Low requirement in base asset**: the initial liquidity can be made of mostly LYRA, and PALM will progressively balance it towards 50% to create an equal buy/sell support.
- **High capital efficiency**: by autonomously and actively managing concentrated liquidity, especially once a sufficient amount of base asset has been bootstrapped, PALM can further reduce the slippage for large trades even if with limited overall liquidity.
- **No biased price impact**: PALM conducts market making by setting up ranges / limit orders, no swaps involved.
- **Trustless & transparency**: Lyra retains the ownership of the liquidity and can withdraw at all times. PALM only autonomously manages the liquidity but can never remove it. All executions of PALM can be monitored on-chain with full transparency.

Here is an [example](https://dune.com/arrakisfi/mainnet-palm?vault_address_t1b1d8=0xd42dd60fbE8331413383075ac91EDE56784e93D3) for GEL/WETH that demonstrates the overall performance of PALM and how it’s able to bootstrap and deepen the liquidity regardless of the price action.

Arrakis has been assisting Lyra with liquidity management since long ago (see [LEAP-21](https://leaps.lyra.finance/leaps/leap-21/) and [LEAP-44](https://leaps.lyra.finance/leaps/leap-44/)), and we would like to strengthen this long-term relationship with more and better services that can further benefit the Lyra community.
.

## Motivation
Currently, there are two major challenges in terms of LYRA liquidity:
1. **High liquidity rental cost**: a large amount of LYRA is given away as LM incentives (5m LYRA annually as in [LEAP-44](https://leaps.lyra.finance/leaps/leap-44/)) to LPs that are most probably going to leave once the reward runs low. Renting liquidity is never a sustainable solution and eventually does more harm than good to the protocol and token holders.
2. **Low capital efficiency**: Bulk of LYRA liquidity resides in Velodrome, a constant function market maker that only accepts full range liquidity provision. There is also LYRA liquidity on UniV3. Although UniV3 can significantly improve capital efficiency by the concentrated liquidity feature, the complexity and lack of sophisticated management makes the capital efficiency for LYRA still far from being ideal.

All of this presents both a huge cost and a missed opportunity for Lyra. The liquidity incentive could have been reserved for better purposes that contribute to the development of the protocol, and Lyra could have consistently pocketed a handsome amount of trading fees by LPing with high capital efficiency to absorb most of the volume.

To help Lyra save the cost and capture the opportunity, Arrakis proposes to provide Lyra with the full spectrum of market-making services on UniV3 with PALM to bootstrap and create deep on-chain liquidity.


## Specification
### Phase 1 - Accumulate base asset
Based on the discussions with the Lyra core team, we suggest that Lyra initially deposit $100k worth of ETH and $200k worth of LYRA (roughly 67 WETH and 1845491 LYRA at the time of writing the proposal) into a PALM-managed vault. PALM will pull that ratio towards 50/50 over time.

There are three key parameters that dictate PALM’s behavior:
- Range size (S): the number of ticks in a range
- Allocation (L): the percentage of liquidity deployed in a range
- Threshold (T): the boundary across which a rebalance is called

![Screenshot 2023-01-19 132708](https://user-images.githubusercontent.com/106374517/226589688-68f5abc4-afa6-460b-8130-259581940cca.jpg)

After running a series of simulations for LYRA/WETH, the proposed values for these parameters are:
- Range size: 600 ticks (see official [explanation](https://uniswap.org/blog/uniswap-v3-math-primer) of tick from Uniswap)
- Allocation: 5% total allocation (the rest stays in the vault as reserve readily to be deployed)
  - 1.5% base range
  - 1.0% mid range
  - 2.5% asset range
- Threshold:
  - Asset rebalance: 480 ticks from asset range limit towards mid range
  - Base rebalance: 120 ticks from base range limit towards mid range

With the values above, the simulation results indicate that PALM can effectively bootstrap WETH for LYRA over 3 months, and at the same time keep the value of the deposited liquidity close to the value of holding.
<img width="880" alt="image" src="https://user-images.githubusercontent.com/106374517/226590839-a380b850-e3cc-4748-9ca3-c9dfaf7b914d.png">
<img width="880" alt="image (1)" src="https://user-images.githubusercontent.com/106374517/226590850-080f2b97-4d0a-4233-94b2-0d1d51c99053.png">

### Phase 2 - Establish deep liquidity
Once the target ratio of 50/50 is reached, the focus is then on market-making to create deep liquidity for LYRA and to minimize the slippage on both the buy and sell side of the volume.

During the deployment period, the Lyra community has complete visibility into the execution and performance of PALM via a custom dashboard, and retains full custody of the liquidity in the vault, which means that the Lyra community can withdraw from the vault or revoke managing access from PALM at any time. PALM can only conduct market-making with the liquidity deposited in the vault and will never be able to remove the fund.

For the services provided, Arrakis charges fees on two fronts:
- Management fee: 1% AUM fee on a yearly basis 
- Performance fee: 50% of trading fees generated.

## References
[Arrakis Finance](https://www.arrakis.finance/)

[Documentation](https://resources.arrakis.fi/)

[Audits](https://resources.arrakis.fi/resources/audits)

[Twitter](https://twitter.com/ArrakisFinance)

[Discord](https://discord.com/invite/arrakisfinance)

## Copyright
Copyright and related rights waived via [CC0](https://creativecommons.org/publicdomain/zero/1.0/).
