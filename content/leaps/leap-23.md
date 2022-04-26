---
leap: 23
title: Add Lyra Liquidity on Bancor
status: Draft
author: Ksett
created: 2022-04-22
---
<!--You can leave these HTML comments in your merged LEAP and delete the visible duplicate text guides, they will not appear and may be helpful to refer to if you edit it again. This is the suggested template for new LEAPs. Note that a LEAP number will be assigned by an editor. When opening a pull request to submit your LEAP, please use an abbreviated title in the filename, `leap-draft_title_abbrev.md`. The title should be 44 characters or less.-->

## Simple Summary
<!--"If you can't explain it simply, you don't understand it well enough." Simply describe the outcome the proposed changes intends to achieve. This should be non-technical and accessible to a casual community member.-->

Fund Lyra pool on Bancor with DAO owned LYRA tokens.

## Abstract
<!--A short (~200 word) description of the proposed change, the abstract should clearly describe the proposed change. This is what *will* be done if the LEAP is implemented, not *why* it should be done or *how* it will be done. If the LEAP proposes deploying a new contract, write, "we propose to deploy a new contract that will do x".-->

This LEAP proposes Lyra DAO funds liquidity in the LYRA pool on Bancor. The Lyra DAO will add LYRA tokens to the pool to seed its liquidity.


## Motivation
<!--This is the problem statement. This is the *why* of the LEAP. It should clearly explain *why* the current state of the protocol is inadequate.  It is critical that you explain *why* the change is needed, if the LEAP proposes changing how something is calculated, you must address *why* the current calculation is inaccurate or wrong. This is not the place to describe how the LEAP will address the issue!-->

This proposal aims to create sustainable, DAO owned liquidity on L1. Since token launch, Lyra has launched a number of programs to encourage liquidity in the LYRA token by using incentives. LEAP - 21, Bridging Emissions Until Avalon, greatly reduced emissions for liquidity and increased capital efficiency by moving all of the incentivised liquidity along with some DAO funds to a Uni V3 managed Gelato pool. While this has been very effective in providing liquidity for LYRA, it leaves very little liquidity on mainnet and therefore restricts access for some traders who may want to access LYRA without moving to L2. Two sided liquidity pools can also suffer from large amounts of impermanent loss which is not ideal.

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

Bancor provides an excellent solution for protocol owned, L1 liquidity with zero additional emissions or incentives required. Once the initial liquidity is bootstrapped, Lyra DAO can add liquidity in LYRA up to the approved trading limit. Bancor allows for single-sided liquidity with 100% protection from Impermanent Loss after 100 days of liquidity providing.  This pool gives LYRA holders the confidence that they can always efficiently buy and sell their LYRA on Bancor at any time on Mainnet.

### Rationale
<!--This is where you explain the reasoning behind how you propose to solve the problem. Why did you propose to implement the change in this way, what were the considerations and trade-offs. The rationale fleshes out what motivated the design and why particular design decisions were made. It should describe alternate designs that were considered and related work. The rationale may also provide evidence of consensus within the community, and should discuss important objections or concerns raised during discussion.-->

By funding our own LYRA/BNT pool, we can offer consistent liquidity on L1 without paying emissions for the liquidity or using a bonding discount. We can avoid mercenary capital that will farm and dump our token and protect DAO funds from losses with Bancor’s IL protection. Bancor V3 will be available in approximately 6 weeks and will shorten the IL protection window to 7 days. Once V3 is available, the Lyra DAO will migrate the pool's liquidity over at the council's discretion while maintaining IL protection.


### Technical Specification
<!--The technical specification should outline the public API of the changes proposed. That is, changes to any of the interfaces Lyra currently exposes or the creations of new ones.-->

Deposit Lyra
Lyra's DAO will deposit LYRA into the pool up to the limit of 100,000 BNT ($224,000 in notional value currently)

### Test Cases
<!--Test cases for an implementation are mandatory for LEAPs but can be included with the implementation..-->
Over 30 DAOs [https://blog.bancor.network/nexus-mutual-joins-30-daos-adopting-bancors-dao-treasury-management-solution-2eb60b762259] have adopted Bancor’s single sided staking for their treasury management.

Sample Bootstrapping Event: https://etherscan.io/tx/0xa6f0dd4bbd6c3c8fda0e20b3164294782b4fc36799f7785ccbd56edc0e623c2d

Sample Deposit:
https://etherscan.io/tx/0xbf08ad49da92d4b509c0745a59eb780684e5f2c2c9b9eb68f4aa9cedcf8a24fb

### Configurable Values
<!--Please list all values configurable under this implementation.-->
```

BNT/LYRA Pool Deposit Limit = 100,000 BNT
Days in Pool = >100 days or until IL protection is reached with Bancor V3

```

## Copyright
Copyright and related rights waived via [CC0](https://creativecommons.org/publicdomain/zero/1.0/).
