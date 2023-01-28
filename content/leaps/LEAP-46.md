---
leap: 46
title: Incentivize LYRA-ETH UniswapV3 pool on Mainnet
status: Draft
author: Defiedge
created: 2023-01-29
---


## Simple Summary

This LEAP proposes 5m LYRA to be distributed to liquidity providers on the Mainnet LYRA-ETH pool.
  

## Motivation
As per current discussions on leap 42 and the Lyra discord space, users will need LYRA on the Mainnet to participate in Lyra governance. We were inspired by the sound comments and discussions on the Lyra discord space. Having all the liquidity in a pool in one range creates single points of failure. For efficient price discovery, markets require diversified participants for different market conditions. If all users behave similarly and have similar pay-outs, they will have similar actions, and during times of market turmoil, this can lead to more volatility. Our smart contracts and intuitive UI can be used by the Lyra community to easily launch a liquidity mining program on the Mainnet in a only a few days.


## Specification
<!--The specification should describe the syntax and semantics of any new feature, there are five sections
1. Overview
2. Rationale
3. Technical Specification
4. Test Cases
5. Configurable Values
-->

### Overview
[DefiEdge](https://www.defiedge.io/) contracts allow permissionless deployment of liquidity across multiple price ranges (20). We propose to manage two different DefiEdge strategies with different ranges. One strategy will deploy tokens in a range of 0.1x to 10x of the spot price, and the other will deploy in a 0.4x to 2.5x range.


### Rationale
* We will incentivize strategies on the LYRA-ETH 1% pool on UniswapV3 
* 3M Lyra will be distributed to the more aggressive 0.4x to 2.5x range to compensate for higher impermanent loss
* 2M Lyra will be distributed to the more conservative 0.1x to 10x range
* The ranges can be updated by the Council as they see fit
  

  
### Test Cases
Users have been exploiting the flexible contracts and simple UI at DefiEdge for almost a year. Total liquidity managed through our platform across close to $5M. We were also chosen to distribute rewards by UniswapV3 to incentivize liquidity on UniswapV3 pools on Optimism and have been managing close to $3M worth of tokens on Optimism.

  
### Configurable Values
Two strategies with a range of 0.1x to 10x and  0.4x to 2.5x of the spot price.


