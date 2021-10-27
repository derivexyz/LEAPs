---
LEAP: 9
title: Launch BTC Market
status: Draft
author: @nickf24
created: 2021-10-27
---

<!--You can leave these HTML comments in your merged LEAP and delete the visible duplicate text guides, they will not appear and may be helpful to refer to if you edit it again. This is the suggested template for new LEAPs. Note that a LEAP number will be assigned by an editor. When opening a pull request to submit your LEAP, please use an abbreviated title in the filename, `leap-draft_title_abbrev.md`. The title should be 44 characters or less.-->

## Simple Summary
<!--"If you can't explain it simply, you don't understand it well enough." Simply describe the outcome the proposed changes intends to achieve. This should be non-technical and accessible to a casual community member.-->
Launch the Lyra BTC options market as part of the Ignition phase, to be incentivized with LYRA rewards equivalent to the ETH market rewards.

## Abstract
<!--A short (~200 word) description of the proposed change, the abstract should clearly describe the proposed change. This is what *will* be done if the LEAP is implemented, not *why* it should be done or *how* it will be done. If the LEAP proposes deploying a new contract, write, "we propose to deploy a new contract that will do x".-->
This LEAP proposes launching the BTC market as part of the Lyra Ignition phase. This market should be incentivized equally to the ETH market within the Ignition program, reflecting the dominance of both ETH and BTC across other exchanges and financial products. 
## Motivation
<!--This is the problem statement. This is the *why* of the LEAP. It should clearly explain *why* the current state of the protocol is inadequate.  It is critical that you explain *why* the change is needed, if the LEAP proposes changing how something is calculated, you must address *why* the current calculation is innaccurate or wrong. This is not the place to describe how the LEAP will address the issue!-->

Lyra's AMM mechanism generalizes to any asset with a liquid spot market. sBTC is tradeable on Synthetix's Optimistic Ethereum (OΞ) deployment. BTC is the most traded asset in crypto markets (DeFi and CeFi) so having a liquid BTC market is essential to drive more volume and new users to the Lyra protocol. 

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
Two Lyra options markets (ETH and LINK), have been successfully deployed, which means that there is minimal infrastructure/engineering work required to launch a BTC market. Since BTC has a liquid options market on Deribit, a liquid options CEX, initial parameters can be selected by the core team that are in line with Deribit. 
### Rationale
<!--This is where you explain the reasoning behind how you propose to solve the problem. Why did you propose to implement the change in this way, what were the considerations and trade-offs. The rationale fleshes out what motivated the design and why particular design decisions were made. It should describe alternate designs that were considered and related work. The rationale may also provide evidence of consensus within the community, and should discuss important objections or concerns raised during discussion.-->
Lyra's ETH options markets have been live for 2 months, with LINK trading for the last month. The Lyra mechanism has performed as intended, and has currently had early success in recent rounds. BTC is a bedrock asset to quote for any crypto-native protocol, due to the demand for BTC trading and the stature it holds within the crypto community. Given volumes observed on other CEXs/DEXs, it is likely that demand for BTC markets will be similar to ETH demand (which has been relatively high). 

### Technical Specification
<!--The technical specification should outline the public API of the changes proposed. That is, changes to any of the interfaces Lyra currently exposes or the creations of new ones.-->
1. Liquidity
Liquidity rewards should be incentivized within the Ignition framework, equal to the ETH market rewards. The BTC rounds schedule should mirror existing Ignition plans for ETH and LINK markets (same expiries, same trading start date). 

### Test Cases
<!--Test cases for an implementation are mandatory for LEAPs but can be included with the implementation..-->
Test cases for an implementation are mandatory for LEAPs but can be included with the implementation.

### Configurable Values
<!--Please list all values configurable under this implementation.-->
Configurable values will be determined by the core team, in consultation with the Council/Community, prior to market launch. 

## Copyright
Copyright and related rights waived via [CC0](https://creativecommons.org/publicdomain/zero/1.0/).
