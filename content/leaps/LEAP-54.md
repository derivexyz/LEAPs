---
leap: 54
title: Newport Rewards Reduction and Terminal Rate
status: Draft  
author: nickf24
created: 2023-27-10
---

## Simple Summary

To prepare for the launch of Lyra v2, it is necessary to start gradually reducing the incentives programs for the current version of the protocol, Newport. Additionally, we should establish a final rate of incentives until v2 is fully operational.

## Abstract

Proposing an adjustment of the current incentive programs which apply to the Lyra Newport deployments on both Arbitrum and Optimism. 

## Motivation

The launch of Lyra v2 is expected in Q4 2023. v2 will provide a significant increase in capital efficiency and enhance the trading experience for users. To prepare for its launch, we should start unwinding incentive programs for Newport and shift our incentives and focus towards v2.

## Specification

The current incentive schemes for Newport are divided between the Optimism and Arbitrum deployments as follows:

**Arbitrum Rewards (per 2 week epoch)**

| Category | Trading | WETH Vault | Total |
| --- | --- | --- | --- |
| LYRA | 26,400 | 255,000 | 281,400 |

**Optimism Rewards (per 2 week epoch)**

| Category | Trading | WETH Vault | WBTC Vault | OP Vault | ARB Vault | XRP Vault | LINK Vault | Total |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| OP | 7,500 | 14,600 | 2,270 | 603 | 603 | 603 | 603 | 26,782 |

We propose a reduction in rates according the below schedules:  

**Optimism**

| Epoch | OP-TRADING | OP-WETH Vault | OP-WBTC Vault | OP-OP Vault | OP-ARB Vault | OP-XRP Vault | OP-LINK Vault | Total OP |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Nov8 - Nov21 | 4,500 | 8,800 | 1,400 | 360 | 360 | 360 | 360 | 16,140 |
| Nov22 - Dec5  | 3,500 | 7,000 | 1,100 | 288 | 288 | 288 | 288 | 12,752 |
| Dec6 - Dec19 | 2,800 | 5,300 | 900 | 250 | 250 | 250 | 250 | 10,000 |
| Dec20 - Jan2 | 2,800 | 5,300 | 900 | 250 | 250 | 250 | 250 | 10,000 |

**Arbitrum**

| Epoch | LYRA-TRADING | LYRA-WETH Vault | Total LYRA |
| --- | --- | --- | --- |
| Nov8 - Nov21 | 20,000 | 150,000 | 170,000 |
| Nov22 - Dec5  | 15,000 | 115,000 | 130,000 |
| Dec6 - Dec19 | 15,000 | 85,000 | 100,000 |
| Dec20 - Jan2 | 15,000 | 85,000 | 100,000 |

## Rationale
The proposed reduction in rewards gives LPs and users the requisite notice for a graceful migration. The proposed schedule offers a gradual reduction in incentives so as to not create a disconnect in the trading experience at any particular point in time. With the launch of v2 expected to come before the end of Q4, this schedule also provides a buffer to ensure that the protocol has a live product throughout Q4, during the transition.

## Copyright
Copyright and related rights waived via [CC0](https://creativecommons.org/publicdomain/zero/1.0/).
