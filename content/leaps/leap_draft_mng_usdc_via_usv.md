---
leap: TBD
title: Deploy USDC from treasury into USV
status: Draft
author: Charles Storry (Phuture)
created: 2022-12-13
---

<!--You can leave these HTML comments in your merged LEAP and delete the visible duplicate text guides, they will not appear and may be helpful to refer to if you edit it again. This is the suggested template for new LEAPs. Note that a LEAP number will be assigned by an editor. When opening a pull request to submit your LEAP, please use an abbreviated title in the filename, `leap-draft_title_abbrev.md`. The title should be 44 characters or less.-->

## Simple Summary
<!--"If you can't explain it simply, you don't understand it well enough." Simply describe the outcome the proposed changes intends to achieve. This should be non-technical and accessible to a casual community member.-->
Deposit USDC from treasury into the USDC Savings Vault (USV)


## Abstract
<!--A short (~200 word) description of the proposed change, the abstract should clearly describe the proposed change. This is what *will* be done if the LEAP is implemented, not *why* it should be done or *how* it will be done. If the LEAP proposes deploying a new contract, write, "we propose to deploy a new contract that will do x".-->
At this point in time, the Lyra treasury has $4,669,325 USDC. This capital should be put to work, in a safe, low risk environment. Starting with a select percentage then growing the exposure from there.

Phuture is a decentralised protocol that gives users passive exposure to crypto assets. We create on-chain index funds and structured products so you can get exposure without the complexity.

We’ve created a low-risk USDC savings vault built upon Notional Finance’s fixed rate market. This product has been built as a treasury management solution for the likes of the Lyra treasury.

USV offers an optimised interest rate by investing into a blend of three and six-month bonds. USV then dynamically allocates capital to whichever maturity has the highest interest rate at the time.

Key benefits:

* Removes the cost, complexity and time needed to manage different maturities.
* Access your capital at any time.
* Higher yields than other providers like Yearn, AAVE or Compound.

## Motivation
<!--This is the problem statement. This is the *why* of the LEAP. It should clearly explain *why* the current state of the protocol is inadequate.  It is critical that you explain *why* the change is needed, if the LEAP proposes changing how something is calculated, you must address *why* the current calculation is innaccurate or wrong. This is not the place to describe how the LEAP will address the issue!-->
To improve the efficiency of the Lyra DAO's treasury by generating yield on a portion of the held USDC. 

Why Generate Yield?

The Lyra community could use the additional funds to grow the treasury, fund token buybacks, deploy more capital into new projects, increase marketing spend, fund philanthropic activities. The possibilities are endless. The Lyra treasury is in a strong position and one where taking advantage of USV will bring great upside with little to no risk downside risk.



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
We propose to move 20% ($933,865) of the Lyra Treasury USDC holdings to USV - the yield bearing USDC - over a period of time. The Lyra treasury can expect to earn 2.5-5% APY.
* 2.5% of the 20% allocated would return per year = $23,346
* 2.5% on the total USDC holding would return per year = $116,733

Execution:

Directly mint USV, allowing the strategy to manage the underlying bonds and produce the yields on Lyra treasury’s behest.
We would suggest introducing the 20% ($933,865) through multiple tranches over a time period which we can share with a more detailed breakdown upon the success of this proposal.

Lyra network would hold the USV assets in their custody. USV is redeemable for USDC at any given time.
We also note that a smaller test transaction would be merited to make sure the Lyra treasury can become comfortable with the process. The Phuture team will be available to run through the process for the Lyra treasury team.



### Rationale
<!--This is where you explain the reasoning behind how you propose to solve the problem. Why did you propose to implement the change in this way, what were the considerations and trade-offs. The rationale fleshes out what motivated the design and why particular design decisions were made. It should describe alternate designs that were considered and related work. The rationale may also provide evidence of consensus within the community, and should discuss important objections or concerns raised during discussion.-->

* USV is able to produce higher yields than Aave, Compound and other like providers because it benefits from the premium that fixed rates can obtain.
* USDC is deposited for USV, this USV will be held by the DAO. USV has no lock-ups and will be redeemable at any given time.
Due to the fixed nature of USV’s lending, the interest earned at maturity on its underlying bonds are insulated from immediate changes in the market rate.
* The Lyra treasury will be able to fully verify the on-chain process and where the yield is generated. They custody the yielding bearing assets and can take comfort in knowing the safety of the yield generated.
* Entire USV stack has been fully audited and battle tested in production.  

Why Phuture?

* Phuture is a decentralised protocol that gives users passive exposure to crypto assets. We create on-chain index funds and structured products so you can get exposure without the complexity.
* Our savings vault product range, starting with USDC has been purpose built as a treasury management tool. We benefit from the premium fixed rate yields which means the high yields are not variable, but dependable for users.
* USV requires zero management from the Lyra treasury, due to the passive nature of the product. Meaning the Lyra treasury just has to withdraw if they decide to in the far future.




### Technical Specification
<!--The technical specification should outline the public API of the changes proposed. That is, changes to any of the interfaces Lyra currently exposes or the creations of new ones.-->
N/A


### Test Cases
<!--Test cases for an implementation are mandatory for LEAPs but can be included with the implementation..-->
N/A

### Configurable Values
<!--Please list all values configurable under this implementation.-->
N/A

## Copyright
Copyright and related rights waived via [CC0](https://creativecommons.org/publicdomain/zero/1.0/).
