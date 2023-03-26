---
leap: 49
title: Trading Rewards 2.0
status: Proposed
author: dappbeast, Sean Dawson, Dillon Lin
created: 2023-2-9
---

## Simple Summary

New reward programs for trading and referrals.

## Abstract

This LEAP proposes two new reward programs for trading and referrers:

1. Trading Pools: Traders earn from a pool of rewards each epoch proportional to their fees generated.
2. Referrals: Integrations and affiliates earn a share of fees generated as rewards. Verified partners who stake LYRA earn more rewards.

This LEAP also proposes discontinuing existing trading reward programs:

1. [LEAP 34](https://leaps.lyra.finance/leaps/leap-34/): The tiered fee rebate program will be replaced with trading pools.
2. [LEAP 30](https://leaps.lyra.finance/leaps/leap-30): The short collateral rewards program will be discontinued.

## Motivation

1. Existing trading programs don't incentivize protocol growth:
   - Fee rebates are rewarded in volatile tokens (LYRA and OP) instead of the quote asset (USDC and sUSD). This means traders cannot lock in a rebate's value until the end of an epoch up to 2 weeks after a trade. Additionally, stkLYRA tiers reward incumbent traders but introduce a high barrier to entry for new traders.
   - The short collateral program is difficult to understand and communicate due to its unpredictable rates impacted by option deltas.
2. The new trading pools program generates more trading activity:
   - Increases total available rewards, solving the fee rebate program's cold start problem.
   - Sybil resistant with a unique rewards formula based on open interest.
3. The new referral program onboards new traders and steady sources of volume from integrators:
   - Referrers earn a steady stream of rewards for generating protocol fees, separate to the trading pools competition between individual traders.
   - Verified partners who stake LYRA and establish long-term alignment with the DAO unlock higher reward tiers.

## Specification

### Trading Pools

Traders earn points for each open position they hold. Traders earn more points when they:

- Pay more fees relative to premiums.
- Open shorter dated positions. This frees up more liquidity to keep pool utilization low.
- Hold a position until expiry. This punishes malicious users who repeatedly open and close positions to generate fees.

**Trading Score**

Let:

- `F` be the amount of fees in a trade
- `P` be the premium of the trade
- `T` be the time to expiry of the trade
- `L` be the epoch length

Define the fee score `Fs` as

`Fs = 1 + sqrt(F/P)`

Define the time score `Ts` as

`Ts = max(1 - T/L, 0.2)`

Define a position score `Ps` if they hold the position until expiry as

`Ps = F * Fs * Ts`

When a position's size is adjusted or closed, the position score is the time weighted average of the rate before and after based on contract size.

For example, if a position with 10 contracts expiring in 2 weeks has score `Ps1`. The position size is reduced to 5 contracts after 1 week and held until expiry. The new score `Ps2` is

`Ps2 = 10/10 * 1/2 * Ps1 + 5/10 * 1/2 * Ps1`

A trader's total score is the sum of the square root of their daily scores for each position held over an epoch. This creates a flatter distribution and balances daily multipliers (see next section).

If a position is held across multiple epochs, the score carries across epochs.

**Multipliers**

A trader's score can be multiplied when they:

- Stake LYRA
- Hold a top trader score over a 24 hour period
- Get referred by another trader

The stkLYRA condition requires a user to have a stkLYRA balance at the end of each 24 hour window. Only a trader's points over that 24 hour period are multiplied.

The top trader condition applies over a 24 hour window starting 00:00 UTC every day. Only a trader's points over that 24 hour period are multiplied.

The referred condition is applied on a per trade basis based on a referrer address being populated in the `OptionMarket.Trade` event's `referrer` field.

|Tier | Conditions | Multiplier |
|---| --------------- | ------ |
|I| 1k stkLYRA or top 50 or referred | 1.2x |
|II| 10k stkLYRA or top 25 | 1.5x |
|III| 50k stkLYRA or top 10 | 2x |
|IV| 250k stkLYRA or top 3 | 2.5x |

### Referrals

Accounts that refer trades will earn a share of their referred trading fees as rewards. The fee rewards will be tiered by stkLYRA balance, with the same functionality and implementation of [LEAP 34](https://leaps.lyra.finance/leaps/leap-34/).

Accounts must verify themselves to access higher rebate tiers. The verification process from [LEAP 39](https://leaps.lyra.finance/leaps/leap-39) will be adopted, allowing integrations to delegate stkLYRA and payout addresses. Post [LEAP 51](https://leaps.lyra.finance/leaps/leap-51/) the Grants Council will be responsible for approving new integrations. Additionally, the Grants Council will be able to denylist malicious addresses that are gaming the referral program.

|Tier | Conditions | Fee Rewards |
|---| --------------- | ------ |
|I| 0 stkLYRA, unverified | 10% |
|II| 500k stkLYRA, verified | 35% |
|III| 1m stkLYRA, verified | 50% |
|IV| 5m stkLYRA, verified | 60% |

The referral allowlist and denylist will be maintained publicly in this [spreadsheet](https://docs.google.com/spreadsheets/d/1lerDJEghSfdutnvqzyLmY2QrLN7T2lBa2sj-eY2DDnE/edit#gid=0) and will be initialized with the existing [LEAP 39](https://leaps.lyra.finance/leaps/leap-39) allowlist.

### Implementation

- Trading scores will be calculated in an off-chain script.
- Referrals will be tracked on-chain via the `OptionMarket.Trade` event's `referrer` field. Population of a trade's `referrer` field is up to the integrator.
	- Referrals will only be available on Newport versions of the protocol since previous versions do not support the `referrer` field.
	- Interfaces may track affiliation off-chain using tools like [Spindl](https://www.spindl.xyz/) that provide vanity links with short referral codes and measure more precise attribution windows for trader to trader referrals. They could then populate the `referrer` parameter on-chain as a trade is made.
	- On-chain integrations such as dHedge, Polynomial and Brahma may choose to hardcode a `referrer` parameter to their DAO's address, then distribute rewards to LPs periodically.
- Reward quantities, tiers and their conditions for trading pools and referrals will be set by Council pre [LEAP 51](https://leaps.lyra.finance/leaps/leap-51/) and by off-chain Snapshot vote post [LEAP 51](https://leaps.lyra.finance/leaps/leap-51/).
- Rewards for both programs will be distributed after each epoch.

### Program Adjustments

For posterity, this LEAP proposes three amendments for all epoch-based reward programs, covering trading rewards, referral rewards and vault rewards programs.

1. Thresholds: Each program has a threshold for minimum distributions. For example, if a threshold of 1 LYRA is set for the trading rewards program, traders who earn less than 1 LYRA will be ignored in the distribution. This makes distributions more gas efficient by ignoring sybil accounts. 
2. Distribution Buffer: Rewards can be distributed up to 1 week after an epoch ends. This gives the DAO time to identify and resolve issues in distributions.
3. Updates: Post [LEAP 51](https://leaps.lyra.finance/leaps/leap-51/) changes to reward programs must be made via Snapshot vote using the off-chain signaling process. For proposals that update or introduce a new program, the full LEAP structure should be used. For proposals that adjust a program's configuration, for example increasing a rewards cap or changing a program's reward token, only the new configuration needs to be included in the proposal.

## Copyright

Copyright and related rights waived via [CC0](https://creativecommons.org/publicdomain/zero/1.0/).
