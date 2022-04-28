---
leap: 18
title:  Universal Closing and Partial Collateralization
status: Draft
author: Sean Dawson (@SeanDaws), Vladislav Abramov (@vladislavabramov), Joshua Kim (@joshua0702k), Domrom (@DominicRomanowski), Nick Forster (@nickf24), Lochcrest (@Lochcrest)
created: 2022-02-18
---

<!--You can leave these HTML comments in your merged LEAP and delete the visible duplicate text guides, they will not appear and may be helpful to refer to if you edit it again. This is the suggested template for new LEAPs. Note that a LEAP number will be assigned by an editor. When opening a p ull request to submit your LEAP, please use an abbreviated title in the filename, `leap-draft_title_abbrev.md`. The title should be 44 characters or less.-->

## Simple Summary

<!--"If you can't explain it simply, you don't understand it well enough." Simply describe the outcome the proposed changes intends to achieve. This should be non-technical and accessible to a casual community member.-->
The LEAP has two objectives. The first is to enhance trader flexibility by allowing users to close any position using
the new \\(\texttt{ForceClose()}\\) function. We call this Universal Closing (UC). The second goal is to substantially
improve capital efficiency by allowing users to partially collateralize short options.

## Abstract

<!--A short (~200 word) description of the proposed change, the abstract should clearly describe the proposed change. This is what *will* be done if the LEAP is implemented, not *why* it should be done or *how* it will be done. If the LEAP proposes deploying a new contract, write, "we propose to deploy a new contract that will do x".-->
This proposal will greatly improve the trader user experience (UX) on Lyra. In V1, users are unable to close very in the
money (ITM) longs (to cash in profits) or out of the money (OTM) shorts (to free up collateral). In this LEAP, we
propose a mechanism by which users can close any trade, regardless of its delta or time to expiry.

Another issue with V1 is how capitally inefficient short selling options is for traders. Currently, shorts are fully
collateralized, meaning selling large amounts of options is out of reach for most users. This LEAP introduces partially
collateralized short options, improving their capital efficiency up to \\(3\\) to \\(4 \times\\).

## Motivation

<!--This is the problem statement. This is the *why* of the LEAP. It should clearly explain *why* the current state of the protocol is inadequate.  It is critical that you explain *why* the change is needed, if the LEAP proposes changing how something is calculated, you must address *why* the current calculation is innaccurate or wrong. This is not the place to describe how the LEAP will address the issue!-->
This LEAP will greatly improve the trading experience of users by introducing:

1. Universal Closing: Users will be able to close very ITM/OTM positions with the introduction of the \\(
   \texttt{ForceClose()}\\) function. These positions will be closed using a penalized geometric time weighted average
   volatility, or GWAV (see [LEAP 16](https://leaps.lyra.finance/leaps/leap-16) for a definition and implementation
   details) to ensure the AMM has positive expected value from these trades.
2. Partially collateralized shorts: In V1, all short options are fully collateralized by traders. The resulting capital
   inefficiency means that it is often undesirable to sell options to the AMM. Users will now be able to partially
   collateralize their short positions, improving capital efficiency by many multiples, with early estimates of \\(3\\)
   \\(-4 \times\\).

## Specification

<!--The specification should describe the syntax and semantics of any new feature, there are five sections
1. Overview
2. Rationale
3. Technical Specification
4. Test Cases
5. Configurable Values
-->

### Overview

<!--This is a high level overview of *how* the LEAP will solve the problem. The overview should clearly describe how the new feature will be implemented.-->
This LEAP will be split into two sections: the first introduces Universal closing using the \\(\texttt{ForceClose()}\\)
function. This allows for users to close very ITM/OTM positions. The second section introduces partially collateralized
shorts, meaning traders shorting options will have to put up substantially less collateral than in V1.

In the following, all parameters are configurable and values specified may change before mainnet deployment subject to further testing. Parameters will be set by the core contributors and these choices will be communicated to the community via the Avalon docs.

### Rationale

Given the complexity of the design of this LEAP, the rationale and trade-offs are addressed in each component in the technical specification below.

### Technical Specification: Universal Closing

#### Delta Inflexibility in V1

In V1, an option can only be closed if the delta of the trade post close (the final delta) is within the interval
\\([10, 90]\\) (the safe range). This restriction was put in place to protect the baseline volatility from being cheaply
manipulated. However, this constraint currently limits the trading experience of users. For instance, a user might want
to close an ITM long option position to cash out profits. Equivalently, a user with a very OTM short might want to close
to free up their locked collateral. With the new closing mechanics described below, we remove this restriction while
still ensuring the integrity of the volatility surface.

#### New Closing Mechanics

To address this issue, users will now be able to close their positions using one of two functions: \\(\texttt{Close()
}\\)  and \\(\texttt{ForceClose()}\\) .

\\(\texttt{Close()}\\)  operates the same as in V1, namely users can only call this function if the listing delta (post
slippage) lies in the safe delta range.

The new \\(\texttt{ForceClose()}\\) function can be called on any option with a (post slippage) delta outside the
\\([12, 88]\\) range or with time to expiry \\((\texttt{Time_to_Expiry})\\) less than the trading cutoff time of \\(
\texttt{Cutoff}=6\\) hours. Note that the current cutoff time in V1 is \\(24\\) hours. This function will close their
position using a penalized GWAVed volatility to ensure the AMM has a positive edge in all market conditions. This will
allow users to exit any position to lock in profits or free up collateral.

To prevent manipulation, options closed using \\(\texttt{ForceClose()}\\) will not update the baseline volatility; only
the skew ratio of the listing will be updated.

Let \\(BS(\sigma, K, S, r, T)\\) denote the Black Scholes price of an option (call or put) using trading volatility \\(
\sigma\\), strike \\(K\\), spot \\(S\\), risk free rate \\(r\\) and time to expiry \\(T\\). Since only the trading
volatility matters in this context, we omit all other parameters.

Recall that to each expiry there is an associated baseline volatility \\(\texttt{BaseIV}\\) and to each strike (in each
expiry) there is a corresponding skew ratio \\(\texttt{Skew}\\). The trading volatility of a listing \\(\sigma\\) is the
product of the skew and baseline, i.e. \\( \sigma =\\) \\(\texttt{BaseIV} \times \texttt{Skew}\\).

The AMM will keep track of the geometric time weighted average values (GWAVs) of these quantities. The length of these
GWAVs will be set in a further LEAP. For the rest of this proposal we denote a GWAVed quantity by the superscript GWAV,
i.e. \\( \sigma^{GWAV} =\\) \\(\texttt{BaseIV}^{GWAV} \times \texttt{Skew}^{GWAV}\\). The spot values are denoted by
SPOT, i.e. \\( \sigma^{SPOT} =\\) \\(\texttt{BaseIV}^{SPOT} \times \texttt{Skew}^{SPOT}\\).

When a user calls \\(\texttt{ForceClose()}\\) on a long, the AMM buys back the option at \\[
\begin{equation} \texttt{Force_buy_back} = BS(\texttt{long_penalty} \times \min(\sigma^{GWAV}, \sigma^{SPOT}))\label{eq:AMMBuyBack} \end{equation} \\]

where \\(\sigma^{SPOT}=(\texttt{Skew}^{SPOT}+\texttt{slippage}) \times \texttt{Base}^{SPOT}\\) and \\(
\texttt{slippage}\\) refers to the skew slippage resulting from the trade (in this case \\(\texttt{slippage}\\) is
negative). The parameter \\(\texttt{long_penalty} = 0.8\\) ensures that the AMM is favored by the trade. If \\(
\texttt{Time_to_Expiry}<\texttt{Cutoff}\\), then \\(\texttt{long_penalty}\\) is decreased to \\(0.5\\).

When a user calls \\(\texttt{ForceClose()}\\) on a short position, the AMM sells back the option at \\[
\begin{equation} \texttt{Force_sell_back} = \max(qS + \texttt{Parity}, BS(\texttt{short_penalty} \times \max(\sigma^{GWAV}, \sigma^{SPOT}))\label{eq:AMMSellBack} \end{equation} \\]
where \\(\texttt{short_penalty} = 1.2\\) and \\(q = 0.01\\). Here \\(\texttt{Parity}\\) refers to the intrinsic value of
the option, namely \\(\max(S-K,0)\\) for calls and \\(\max(K-S,0)\\) for puts. If \\(\texttt{Time_to_Expiry} <
\texttt{Cutoff}\\), then \\(\texttt{short_penalty}\\) is increased to \\(1.5\\).

When a user calls \\(\texttt{ForceClose()}\\) all three fees (spot, option and vega utilization) are charged as normal.

\\(\textbf{Example}\\): Suppose Alice wants to close a long call on the \\(5\\) day, \\($2800\\) ETH strike when the ETH
spot price is \\(S=$3500\\). Let \\(\texttt{Skew}^{SPOT}=1.21\\), \\(\texttt{Skew}^{GWAV}=1.22\\), \\(
\texttt{BaseIV}^{SPOT}=1.1\\), \\(\texttt{BaseIV}^{GWAV}=1.08\\) and \\(\texttt{slippage}=0.005\\). We have \\(
\sigma^{GWAV}= 1.22 \times 1.08 = 1.32\\) and \\(\sigma^{SPOT}= (1.21+0.005) \times 1.1 = 1.34\\).

The AMM will buy back this option for \\[
BS(0.8 \times \min(1.34,1.32), 2800, 3500,0,5/365)) = $705.39 \\]
(this does not include fees). Note that the current price of this option (using the spot volatility) is \\($717.08\\).
This listing has a delta of approximately \\(93\\), so would be unable to be closed in V1.

#### Skew and Baseline Caps

To minimize risk to LPs, we also enforce upper and lower bounds on the skew/baseline/trading volatility for each
listing. These values are presented in the table below. Note that these values will change per asset and are yet to be
finalized.

|| Baseline | Skew | Trading |
|----| ---- | ------ | ----- |
|Min| \\(0.25\\) | \\(0.8\\) | \\(0.2\\) |
|Max| \\(5.0\\) | \\(1.75\\) | \\(10.0\\) |

There are three corner cases we must consider regarding these caps.

\\(\textbf{Case 1}\\): A user opens a trade or calls \\(\texttt{Close()}\\) on a listing that will take the final
skew/baseline/trading vol above/below one of the caps.

\\(\textbf{Response}\\): This trade will not be processed by the AMM.

\\(\textbf{Case 2}\\): \\(\texttt{ForceClose()}\\) takes the skew/trading volatility above (below) the cap.

\\(\textbf{Response}\\): The AMM allows this trade to proceed but blocks further longs (shorts) on this listing. Users
can still call \\(\texttt{ForceClose()}\\) in both directions.

\\(\textbf{Case 3}\\): \\(\texttt{ForceClose()}\\) on a user’s long takes the skew to a negative value or above a
threshold value (say, \\(3\\))

\\(\textbf{Response}\\): This trade will not be processed by the AMM.

\\(\textbf{Technical note}\\): To ensure the integrity of the GWAV of the skew, it is important to ensure that skew is
updated using values sufficiently far from 0. Consequently, the value of the skew fed into the formula for the GWAV will
be \\(\max(z, \texttt{Skew})\\) where \\(z=0.6\\).

### Technical Specification: Partial Collateralization

In V1, options shorted by traders are fully collateralized, which is very inefficient for traders. For instance,
shorting an ATM ETH call worth \\($200\\) would require \\(1\\) sETH as collateral (approximately \\($3000\\) at time of
writing). This capital inefficiency also means large spikes in volatility cannot be easily arbitraged away by the
market. This can pose a risk to LPs.

We now propose a mechanism for allowing partially collateralized short options. This will result in a substantial
improvement in capital efficiency.

#### Minimum Collateral

To open a short position, a user must deposit the minimum amount of collateral. For short calls, a user can deposit the
base (synthetic) asset (sETH, sBTC, etc) or the quote asset (sUSD) as collateral. For short puts, only the quote asset
can be deposited as collateral. A user cannot deposit both the quote and base assets as collateral.

The minimum amount of collateral is given by:

- (short calls in the base asset): \\(\max(\texttt{min_static_base},BS(\texttt{ShockVol},K,S\times
  \texttt{CallShock},r,T))/(S\times \texttt{CallShock})\\)
- (short calls in the quote asset): \\(\max(\texttt{min_static_quote},BS(\texttt{ShockVol},K,S\times
  \texttt{CallShock},r,T))\\)
- (short puts in the quote asset): \\(\max(\texttt{min_static_quote},BS(\texttt{ShockVol},K,S\times
  \texttt{PutShock},r,T))\\)

where \\(\texttt{ShockVol} = \texttt{ShockVolA} = 2.5\\)  if \\(\texttt{Time_to_Expiry} < T_A = 4\\) weeks, \\(\texttt{ShockVol} = \texttt{ShockVolB} = 1.8\\)  if \\(\texttt{Time_to_Expiry} > T_B = 8\\) weeks and
\\[
\texttt{ShockVol} = \texttt{ShockVolA} - \frac{\texttt{ShockVolA} - \texttt{ShockVolB}}{T_{B} - T_{A}} \times (\texttt{Time_to_Expiry} - T_{A})
\\]
when \\(T_{A} \le \texttt{Time_to_Expiry} \le T_{B})\\). \\(\texttt{CallShock}\\) and \\(
\texttt{PutShock}\\) are static percentage shocks to the current spot price and \\(
\texttt{min_static_base},\texttt{min_static_quote}\\) are the minimum deposits necessary to ensure liquidators (described below) can always operate profitably.

These values will be unique to each asset, but for ETH, preliminary values could be \\(\texttt{ShockVol}=250\\%\\), \\(
\texttt{CallShock}=120 \\%\\), \\(\texttt{PutShock}=80\\%\\), \\(\texttt{min_static_base}=0.2\\) ETH and \\(
\texttt{min_static_quote}=$500\\).

When a user opens a short (collateralizing with the quote asset), the premiums paid out by the AMM will be used as part
of the collateral. For instance, if Alice shorts an option worth $100 and the minimum collateral is $500, then she would
need to deposit $400 more.

When a user closes such a short, the premiums to buy back the option are taken from their collateral. In this example,
if Alice's short is worth \\($150\\) when she comes to close, she will receive \\($350\\) to exit her position.

For short calls collateralized by the base asset, the premiums (paid out in sUSD) are deposited directly into the
trader’s wallet and the full collateral (in the base asset) has to be deposited. I.e. if Alice shorts a \\($100\\)
option and needs to deposit \\(0.2\\) ETH, then \\($100\\) sUSD is credited to her wallet and she deposits \\(0.2\\)
ETH.

When a user closes shorts collateralized in the base asset, they must have sufficient sUSD in their wallet to buy back
the option.

\\(\textbf{Example}\\): What is the minimum collateral (in sUSD) for an ATM \\(7\\) day expiry ETH call option when \\(S
= $2600\\)? We have \\(\max(500, BSC(250, 2600, 1.2 \times 2600, 0, 7/365) = $705.62\\). Note that the current price of
the option (with \\(100\\) trading volatility) is \\($143.53\\). In V1, this option would be collateralized with 1 ETH
\\(= $2600\\). This is approximately a \\(4 \times\\) improvement in capital efficiency.

Users can deposit more collateral at any time and can withdraw any excess collateral so long as the remaining amount is
above the minimum.

#### Liquidations

Denote a user’s deposited collateral as \\(\texttt{UserCollateral}\\) and the minimum amount required as \\(
\texttt{MinCollateral}\\).

When a user falls below \\(\texttt{MinCollateral}\\), their position is liquidatable. If the position falls back out of
liquidation range, they are no longer liquidatable. It is assumed that liquidations will happen the vast majority of the
time. The penalties when they do occur outweigh the potential freeroll losses (in expectancy).

Liquidators are users/bots who can liquidate underwater positions by calling a function. It is important to note that
liquidators require no collateral to liquidate a user, they simply call a function which forces the user to close with
the AMM, meaning that the AMM can internalize the bulk of the fees from liquidations (since they are taking on the
collateral risk).

When a position is liquidated, the AMM sells back the options using the \\(\texttt{ForceClose()}\\) function but with
slightly different parameters. An option is sold back to the trader at
\\[
\texttt{Liq_sell_back} = \max(qS + \texttt{Parity}, BS(\texttt{liq_short_penalty} \times \sigma^{GWAV})
\\]

where \\(\texttt{liq_short_penalty} =1.15\\). As with other calls of \\(\texttt{ForceClose()}\\), only the skew ratio is
updated by this trade. If \\(\texttt{Time_to_Expiry} < \texttt{Cutoff}\\) then \\(\texttt{liq_short_penalty}\\) is
increased to \\(1.45\\).

After the user buys back their options, they will have \\(\texttt{RemainingCollateral} = \texttt{UserCollateral} -
\texttt{Liq_sell_back}\\) in funds remaining which will then be penalized by \\(\texttt{penalty%} = 10%\\) or \\(
\texttt{flat_penalty} = $15\\) (whichever is greater).

The remaining funds are then returned to the user. The slashed funds are then distributed three ways between the
liquidator, LPs and security module (SM) stakers. The precise ratios of this split is still up for debate and will be
proposed in a forthcoming LEAP.

Fully collateralized options can never be liquidated. The AMM always fully collateralizes its trades.

#### Under-Collateralization

An under-collateralized position occurs when the value of a user’s short exceeds their deposited collateral (i.e. \\(
\texttt{Liq_sell_back} > \texttt{UserCollateral}\\)).

When a user is under-collateralized, they will be liquidated and all of their \\(\texttt{UserCollateral}\\) (minus the
flat penalty for the liquidator) will be transferred to the AMM. The user has no funds returned to them.

Most under-collateralized positions will be caused by delayed liquidations. This poses a risk to the AMM where the
under-collateralized user can effectively freeroll the AMM if their collateral has been exhausted and they have not yet
been liquidated. That is, the user does not lose more money if the position continues to go against them but can make
money/no longer be under-collateralized if the position moves in their favor. The purpose of the liquidation penalty is
to compensate LPs for this potential scenario, and therefore most of these ‘shortfall’ events will not reimbursable by
the security module.

\\(\textbf{Example}\\): Alice has a short position worth \\($500\\) and has deposited \\($1200\\) in collateral. Due to
some extreme event, her short position suddenly becomes valued at \\($1250\\). Alice is now under-collateralized, but
because of a delay, she is not immediately liquidated.

Suppose that during this lag, the position moves further against Alice and her short eventually becomes worth \\(
$2000\\). Then Alice is liquidated, losing \\($1200\\) when she deserved to lose \\($2000\\). Conversely, if the
position moves in her favor and becomes worth \\($800\\), then she can no longer be liquidated and she freerolls the
AMM.

Post-expiry under-collateralization caused by extreme unforeseen circumstances (e.g. L2 infrastructure issues/attacks)
may be eligible for SM reimbursements, subject to the Council’s discretion. A future LEAP will describe the interaction
between the security module and reimbursement for under-collateralization.

### Transferability

To improve the composability of Lyra, all options positions will be represented as ERC-721 tokens. This means users will
be able to transfer their option positions to any address. Consequently, users can open two positions for the same
listing with different collateral amounts and each would be liquidated separately, allowing users to divide risk. This
also means collateral checks will not have to be performed on transferred short positions.

### Technical Specification: Variance fee

Periods of extreme turbulence in the market should attract higher fees since the AMM is exposed to greater risk and impermanent loss. Such a fee will also further decrease the possibility of the volatility surface being manipulated. For this reason, we propose including a new fee which we call the variance fee.

The variance fee \\(F_{var}\\) will be defined as 
\\[
F_{var}=c_{0}\times(v_{0}+v_{1}\times\text{Vega})\times(s_{0}+s_{1}\left|R_{fix}-R\right|)\times(b_{0}+b_{1}\times\left|b^{GWAV}-b^{Spot}\right|)
\\]

where \\(c_{0},v_{i},s_{i},b_{i},R_{fix}\\) are constants, \\(\text{Vega}\\) is the vega of the trade, \\(R\\) is the skew of the trade and \\(b^{Spot},b^{GWAV}\\) are the spot/GWAV of the baseline volatilities. Essentially, the variance fee will increase for trades that cause the base volatility to deviate significantly from the GWAV.

### Configurable Values
| Name | Symbol | Value |
| ---- | ------ | ----- |
| Delta Cutoff (Close()) | - | 10 |
Delta Cutoff (ForceClose()) | - | 12 |
Trading Cutoff Time | \\(\texttt{Cutoff}\\) | 6 hours |
Long GWAV Vol Penalty | \\(\texttt{long_penalty}\\) | 0.8, 0.5 (depending on \\(\texttt{Time_to_Expiry}\\)) |
Short GWAV Vol Penalty | \\(\texttt{short_penalty}\\) | 1.2, 1.5 (depending on \\(\texttt{Time_to_Expiry}\\)) |
Min Option Price (fraction of spot) | \\(q\\) | 0.01 |
Min baseline vol | - | 0.25 |
Max baseline vol | - | 5.0 |
Min skew | - | 0.8 |
Max skew | - | 1.75 |
Min trading vol| - | 0.2|
Max trading vol| - | 8.75|
Min skew in GWAV| \\(z\\) | 0.6|
Max Shock Volatility | \\(\texttt{ShockVolA}\\) | 2.5 (ETH/BTC), 4.0 (LINK/SOL)|
Min Shock Volatility | \\(\texttt{ShockVolB}\\) | 1.8 (ETH/BTC), 3.2 (LINK/SOL)|
First Shock Point | \\(T_{A}\\) | 4 weeks|
Second Shock Point | \\(T_{B}\\) | 8 weeks|
Call Shock Spot Percent | \\(\texttt{CallShock}\\) | 1.2|
Put Shock Spot Percent | \\(\texttt{PutShock}\\) | 0.8|
Min Quote Collateral | \\(\texttt{min_static_quote}\\) | $300|
Min Base Collateral | \\(\texttt{min_static_base}\\) | 0.15 ETH, 0.01 BTC, 35 LINK, 55 SOL|
Liquidation Vol Penalty | \\(\texttt{liq_short_penalty}\\) | 1.15, 1.45 (depending on \\(\texttt{Time_to_Expiry}\\))|
Flat Penalty | \\(\texttt{flat_penalty}\\) | $15|
Slashed Collateral Percentage | \\(\texttt{penalty}\\) | 10%|
Fee Scale Time 1 | \\(T_{1}\\) | 8 weeks|
Fee Scale Time 2 | \\(T_{2}\\) | 12 weeks|
Option Price Coefficient | \\(\texttt{OptionPriceFeeCoefficient}\\) |1%|
Spot Price Coefficient | \\(\texttt{SpotPriceFeeCoefficient}\\) |0.1%|

## Interfaces

### OptionMarket
```solidity

  struct TradeInputParameters {
    uint strikeId;
    uint positionId;
    uint iterations;
    OptionType optionType;
    uint amount;
    uint setCollateralTo;
    uint minTotalCost;
    uint maxTotalCost;
  }

  function openPosition(TradeInputParameters memory params) 
    external returns (Result memory result)

  function closePosition(TradeInputParameters memory params) 
    external returns (Result memory result)

  function forceClosePosition(TradeInputParameters memory params) 
    external returns (Result memory result)

  function addCollateral(uint positionId, uint amountCollateral) external

  function liquidatePosition(uint positionId, address rewardBeneficiary) external
```

### OptionToken
```solidity
  enum PositionState {
    EMPTY,
    ACTIVE,
    CLOSED,
    LIQUIDATED,
    SETTLED,
    MERGED
  }

  struct OptionPosition {
    uint positionId;
    uint strikeId;
    OptionMarket.OptionType optionType;
    uint amount;
    uint collateral;
    PositionState state;
  }

  function canLiquidate(
    OptionPosition memory position,
    uint expiry,
    uint strikePrice,
    uint spotPrice
  ) public view returns (bool)

  function getOptionPositions(uint[] memory positionIds) 
    external view returns (OptionPosition[] memory)
```

### OptionGreekCache
```solidity
  struct ForceCloseParameters {
    uint ivGWAVPeriod;
    uint skewGWAVPeriod;
    uint shortVolShock;
    uint shortPostCutoffVolShock;
    uint longVolShock;
    uint longPostCutoffVolShock;
    uint liquidateVolShock;
    uint liquidatePostCutoffVolShock;
    uint shortSpotMin;
    uint liquidateSpotMin;
  }

  struct MinCollateralParameters {
    uint minStaticQuoteCollateral;
    uint minStaticBaseCollateral;
    uint shockVolA;
    uint shockVolPointA;
    uint shockVolB;
    uint shockVolPointB;
    uint callSpotPriceShock;
    uint putSpotPriceShock;
  }

  function getMinCollateral(
    OptionMarket.OptionType optionType,
    uint strikePrice,
    uint expiry,
    uint spotPrice,
    uint amount
  ) external view returns (uint) 
```

### OptionMarketPricer
```solidity
  struct TradeLimitParameters {
    int minDelta;
    int minForceCloseDelta;
    uint tradingCutoff;
    uint minBaseIV;
    uint maxBaseIV;
    uint minSkew;
    uint maxSkew;
    uint minVol;
    uint maxVol;
    uint absMinSkew;
    uint absMaxSkew;
  }

  struct VarianceFeeParameters {
    uint defaultVarianceFeeCoefficient;
    uint forceCloseVarianceFeeCoefficient;
    uint skewAdjustmentCoefficient;
    uint referenceSkew;
    uint minimumStaticSkewAdjustment;
    uint vegaCoefficient;
    uint minimumStaticVega;
    uint ivVarianceCoefficient;
    uint minimumStaticIvVariance;
  }
```


## Copyright

Copyright and related rights waived via [CC0](https://creativecommons.org/publicdomain/zero/1.0/).
