---
leap: 27
title: Liquidations and the Role of the USDC Security Module in Partial Collateralization
status: Draft
author: Sean Dawson (@SeanDaws), Joshua Kim (), Ksett (), Vladislav Abramov (@vladislavabramov), Lochcrest (@Lochcrest)
created: 2022-06-29 
---

<!--You can leave these HTML comments in your merged LEAP and delete the visible duplicate text guides, they will not appear and may be helpful to refer to if you edit it again. This is the suggested template for new LEAPs. Note that a LEAP number will be assigned by an editor. When opening a p ull request to submit your LEAP, please use an abbreviated title in the filename, `leap-draft_title_abbrev.md`. The title should be 44 characters or less.-->

## Simple Summary
<!--"If you can't explain it simply, you don't understand it well enough." Simply describe the outcome the proposed changes intends to achieve. This should be non-technical and accessible to a casual community member.-->
This is a LEAP to address the role of the (USDC) security module in insolvent shorts that occur at settlement on Avalon. 

## Abstract
<!--A short (~200 word) description of the proposed change, the abstract should clearly describe the proposed change. This is what *will* be done if the LEAP is implemented, not *why* it should be done or *how* it will be done. If the LEAP proposes deploying a new contract, write, "we propose to deploy a new contract that will do x".-->
In Avalon, short positions can be fully or partially collateralized. For the AMM, the latter risks insolvency when the amount of collateral deposited for a position falls beneath the value of the option it is guaranteeing. Though rare, these events are possible during large market shifts or network failures. 
This is a proposal for specifying how the security module will react to insolvencies that occur post expiry. 

##  Motivation
<!--This is the problem statement. This is the *why* of the LEAP. It should clearly explain *why* the current state of the protocol is inadequate.  It is critical that you explain *why* the change is needed, if the LEAP proposes changing how something is calculated, you must address *why* the current calculation is innaccurate or wrong. This is not the place to describe how the LEAP will address the issue!-->
The collateral traders must put up when shorting options (fully or partially) is stored in the short collateral pool (SCP). Each expiry has its own SCP (with base and quote collateral stored separately). Insolvency is when a trader’s option debt to the AMM is greater than their deposited short collateral. 

The AMM accepts the risk of insolvent traders at all times, but the SM takes on the risk of ensuring solvent traders are promptly reimbursed at settlement.

When any short position is closed or liquidated, the AMM takes from the SCP what it is owed, up to the user’s collateral. However, when a board is settled, the AMM settles all positions in bulk.

A consequence of this is that any insolvency that is not liquidated pre-expiry will cause the AMM to temporarily overdraft profits from the SCP. As positions are settled individually after the board is settled, the AMM will reimburse the SCP. However, if the AMM does not have enough free liquidity at time of reimbursement, some solvent (including fully collateralized!) shorts may be unable to settle. We call this an overdraw blockage to settlement (OBS). Note that long traders will always be able to fully settle (since the AMM is fully collateralized); this LEAP does not affect them.

It is expected that most solvent traders will be able to settle (on a first come, first served basis) with no issues during an OBS. This number decreases with the size of the insolvency.

OBS appears to be an extremely unlikely edge case. This is because the contracts will be capable of using the SCP of other expiries to temporarily repay the overdrawn SCP. That is, OBS will only occur if the capital in the SCP for ALL expiries is not enough to cover the AMM’s overdraw for the settlement in question.

It is therefore especially important that a framework is established to deal with tail events where such large insolvencies at expiration cause an OBS. This LEAP provides such a protocol.


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
This LEAP proposes the following:
If an OBS has occurred for longer than 24 hours because of:
Case 1) a series of pending withdrawals: the USDC SM will deposit the required funds (USDC converted into sUSD) into the LP (in turn transferred to the SCP). A Guardian intervention will also be required to bypass the liquidity circuit breaker and speed up the process. When sufficient liquidity has been re-established and all solvent traders repaid, the SM will withdraw its funds. 

The overdrawing of short collateral temporarily inflates the NAV of the pool (until all solvent traders settle) meaning depositors having their funds processed at this time risk having their share of the LP undercut (there is always a 6 hour lockout of processing after settlement to avoid this possibility, but this may not be enough in extreme cases). To have the SM deposit fast tracked, all pending deposits will be fast tracked as well by the Guardians (deposits work on a queued system). This means a substantially large insolvency could dilute the pending deposits. Since substantial insolvencies at settlement are an unlikely tail event, this is an acceptable risk of LPing. If sufficient dilution of depositing LPs occurs, a LEAP can be proposed by the community to reimburse LPs for their losses via the SM.

Case 2) a series of trades locking collateral: the USDC SM will deposit the required funds to the LP. If it appears that a malicious actor is trading in such a way to block users from settling, then the Guardians reserve the right to temporarily pause trading.  When sufficient liquidity has been restored and all solvent traders have settled, the SM will withdraw its funds from the LP.

Case 3) the NAV of the pool is less than the amount the LP owes to solvent traders (such as in the case of an attack/exploit): the USDC SM will donate the required funds (sUSD, converted from USDC) to the LP. In donating these funds, the SM will not be reimbursed. There will initially be no cap on the amount of funds the SM will be able to donate to the LP. The Council reserves the right to cap the amount of funds at a later time. Finally, note that the SM is still responsible (as it has been up to time of writing) for reimbursing LPs/traders in the event of attacks/exploits per Council discretion.

To perform the appropriate donation/deposit, the multi-sig holders of the SM (i.e. the Guardians, as to be further defined in future LEAPs) will have to manually execute the appropriate transactions. 
To compensate for this risk, members of  the SM will receive 1) LYRA tokens (as has been the case up to time of writing) and 2) (new) a percentage of all liquidations that occur on the Avalon platform, paid out in USDC.

SM stakers will periodically be able to claim both their LYRA and USDC rewards. The frequency of claims will be set by the core contributors at a later date.

The rest of this section will be used to explain the rationale for each action in cases 1) - 3). 


### Rationale

We will now explain why the above proposal is necessary by describing how short collateral is stored in Avalon. We then highlight some edge cases where the short collateral could be temporarily emptied by a series of trades/withdrawals, thereby preventing some solvent traders from closing their positions.

#### How Collateral is stored for shorts:

When a user shorts an option (either fully or partially), the collateral they put up is stored in the short collateral pool (SCP). When a short is settled at expiration, the AMM takes from the SCP the value of its position. 

Example (closing at settlement): Alice and Bob both open short positions. Alice puts up 1.0M in collateral and Bob 3.0M. The SCP contains 1.0 + 3.0 = 4.0M in collateral. At settlement, Alice’s short is worth 0.6M (so her collateral is worth 0.4M) and Bob’s 2.2M (0.8M). To settle, the AMM will take 2.8M from the SCP, leaving 1.2M behind. Alice will close and claim 0.4M while Bob will receive 0.8M. 

When a short is closed during normal trading times (so not at settlement), the AMM will only interact with the trader’s collateral.

Example (closing not at settlement): As before, Alice and Bob put up 1.0M and 3.0M in collateral. If Alice closes her short (with value 0.6M), then the AMM will take 0.6M from her collateral (leaving Bob’s untouched!) and return 0.4M to her. There will be 3.0M remaining in the SCP.

A user is insolvent when the value of their collateral is less than the value of the options they are short. In the previous example, this could be the case if, say, Alice’s shorts were worth, say 1.2M, yet she only had 1.0M in collateral. Insolvency should be rare, but extreme market conditions and network failures mean this is a possibility that needs to be considered.

When an insolvency does not occur at expiry (i.e. during “normal” trading times), the AMM will just take all the collateral the insolvent trader has put up to close the position. All other collateral is untouched. However, when an insolvency occurs at settlement, the AMM will “overdraw” from the SCP, taking more than it should. 

Example (insolvency at settlement): As before, Alice and Bob both have short positions with 1.0M and 3.0M in collateral. At settlement, suppose Alice’s position is worth 0.6M (as before) while Bob’s position increases in value to 3.2M and he becomes insolvent. The AMM will take the 3.8M it is owed for its long position, leaving 0.2M behind. When Alice comes to settle, it calculates that it has overdrawn 0.2M more than it should have and so quickly returns 0.2M back to the SCP, allowing Alice to complete settlement. 

Example (insolvency during normal trading): Suppose in the previous example, Bob’s insolvency occurs during normal trading times. When Bob is liquidated, the AMM will look at Bob’s collateral, realize that while it is owed 3.2M for its options, it can only take 3.0M (since that is all that Bob has put up). It will then take 3.0M (the maximum it can). Alice’s collateral is never touched.

It should be stressed that the LPs are responsible for potentially diminished profits in all insolvencies. 

The distinction between insolvency pre/post expiry is important, since it means the AMM can only ever overdraw at settlement. This is why the SM will only need to be responsible for reimbursing solvent traders at settlement. 

Sufficiently large insolvencies coupled with low free liquidity can cause the SCP to be temporarily emptied, meaning settlement (even for fully collateralized traders) could temporarily be blocked.

Example: Again, suppose Alice and Bob have short positions with 1.0 and 3.0M locked in collateral and the AMM has 1.4M in free liquidity. At settlement, Alice’s short is worth 0.3M and Bob’s increases in value to 3.2M - making him insolvent. The AMM will take 0.3 + 3.2 = 3.5M from the SCP, leaving 0.5M in the pool. The AMM has overdrawn 0.2M. The AMM now has 3.5 + 1.4 = 4.9M in free liquidity, but owes a debt of 0.2M to the SCP. 
Suppose before it can repay this debt this free liquidity is locked. This could be through any (or some combination of) any of the following:

Case 1 (withdrawal blockage): Charlie makes a large withdrawal, requiring the AMM to lock at least 4.9M (it will still take time to process),
Case 2 (trade blockage): David puts in a large long call position, requiring the AMM to lock 4.9M as collateral.
Case 3 (NAV blockage): An exploit results in the AMM losing a substantial amount of funds, causing the NAV of the entire pool to decrease to less than 0.2M.  

In all of these cases, the AMM’s debt to the SCP means some solvent traders will be unable to settle. 

The Avalon smart contracts have a SCP for each expiry. This means short collateral from other expiries can be used to temporarily fill up the SCP of the settled board. In the worst case scenario (such as with a very large insolvency) this temporary transfer of short collateral might not be enough.

The above cases 1) - 3) are scenarios where the Security Module will be required to intervene. The rules for how this would work were described at the beginning of this section. 

#### Benefits for being a part of the SM

This LEAP has so far described the responsibilities of the SM in the case of shortfall events. To compensate members of the SM a reward rate in LYRA will continue to be paid out (as is the case at time of writing). Avalon increases the role of the SM, and to compensate these contributors the SM will receive 10% of the fees from all liquidations performed on the platform. This is a configurable variable and can be changed with a Council vote. 
These two methods of compensation (LYRA tokens and a percentage of all liquidations) are expected to result in positive expectancy for SM contributors. 

## Copyright
Copyright and related rights waived via [CC0](https://creativecommons.org/publicdomain/zero/1.0/).
