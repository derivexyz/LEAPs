---
leap: <to be assigned>
title: Setting up GrantsDAO
status: Draft
author: Cinque (@Cinqu3), Burtrock, Ksett
created: 2022-02-03
---

<!--You can leave these HTML comments in your merged LEAP and delete the visible duplicate text guides, they will not appear and may be helpful to refer to if you edit it again. This is the suggested template for new LEAPs. Note that a LEAP number will be assigned by an editor. When opening a pull request to submit your LEAP, please use an abbreviated title in the filename, `leap-draft_title_abbrev.md`. The title should be 44 characters or less.-->

## Simple Summary
<!--"If you can't explain it simply, you don't understand it well enough." Simply describe the outcome the proposed changes intend to achieve. This should be non-technical and accessible to a casual community member.-->
This LEAP proposes to set up a GrantsDAO.

## Abstract
<!--A short (~200 word) description of the proposed change, the abstract should clearly describe the proposed change. This is what *will* be done if the LEAP is implemented, not *why* it should be done or *how* it will be done. If the LEAP proposes deploying a new contract, write, "we propose to deploy a new contract that will do x".-->
GrantsDAO is a five-seat Committee responsible for evaluating and considering grant proposals for contributing to Lyra Protocol/DAO.

##  Motivation
<!--This is the problem statement. This is the *why* of the LEAP. It should clearly explain *why* the current state of the protocol is inadequate. It is critical that you explain *why* the change is needed, if the LEAP proposes changing how something is calculated, you must address *why* the current calculation is inaccurate or wrong. This is not the place to describe how the LEAP will address the issue!-->
Community grants are a great way to reward contributors for providing meaningful contributions to the Lyra Protocol/DAO. The GrantsDAO offers a sustainable way to reward contributors and transparency to these decisions. As Lyra evolves, these sub-DAO's will help LyraDAO to streamline the management process and promote stability and accountability for DAO's actions.

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
GrantsDAO will be governed by five members that are elected by token holder vote. GrantsDAO members are responsible for rewarding grants and allocating the GrantDAO funds.
Committee consists of <number> DAO members and <number> Core Contributers.


### Rationale
Setting up a GrantsDAO is another step towards decentralized governance. This will enable LyraDAO to manage funds towards the betterment of the protocol and attract talent/skills/culture to develop and sustain the growth of Lyra.

### Technical Specification

1. Grants
    - A grant is a financial award given to a contributor/receiver who provides meaningful contributions to the DAO/Protocol.
	- Anyone can propose a grant.
	- Accepting/Rejecting a grant requires a majority of GrantDAO member votes in favor (i.e., 3/5).

2. Token Holder
	 - Token holders are eligible to vote in Grants DAO elections.
	 - Tokens that the Lyra DAO controls are NOT eligible to vote.

3. GrantsDAO

	The Grants DAO will be a five-seat committee and will sit for three calendar months at a time. The responsibilities of Grants DAO include, but are not limited to:
	- Being an active member in Discord and the broader Defi community
	- Recognize contributions made by the community members and reward them accordingly.
	- Attract talent and incentivize protocols/contributors to integrate with Lyra
	- Vote to Pass or Deny grant proposals promptly

4. Election

	The first Grants DAO members are elected by the council or an informal discord vote to address the urgency and are selected for a five-month term. The five-month period ensures that the members are appointed for one whole epoch.
	Hereafter, the grants DAO members are appointed by the Token vote and selected for a three-month term.

	The election process for The GrantsDAO will follow the same rules as that of the Lyra Council election (LEAP-15).

5. Funding

	GrantsDAO proposes a LEAP to request a budget from the LyraDAO; the remaining balance at the end of the term is returned to the treasury.
	Grants DAO position is an incentivized role, and each member will receive $3000 worth of Lyra Tokens each month.

### Configurable Values
<!--Please list all values configurable under this implementation.-->

## Copyright
Copyright and related rights waived via [CC0](https://creativecommons.org/publicdomain/zero/1.0/).
