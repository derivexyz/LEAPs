---
leap: 32
title: Standardizing LEAP Discourse
status: Draft
author: Lochcrest (@Lochcrest), Sean (@SeanDaws)
created: 2022-09-05
---

<!--You can leave these HTML comments in your merged LEAP and delete the visible duplicate text guides, they will not appear and may be helpful to refer to if you edit it again. This is the suggested template for new LEAPs. Note that a LEAP number will be assigned by an editor. When opening a pull request to submit your LEAP, please use an abbreviated title in the filename, `leap-draft_title_abbrev.md`. The title should be 44 characters or less.-->

## Simple Summary
<!--"If you can't explain it simply, you don't understand it well enough." Simply describe the outcome the proposed changes intends to achieve. This should be non-technical and accessible to a casual community member.-->
We propose a new 3 phase system detailing how LEAPs are proposed, discussed and eventually voted on.

## Abstract
<!--A short (~200 word) description of the proposed change, the abstract should clearly describe the proposed change. This is what *will* be done if the LEAP is implemented, not *why* it should be done or *how* it will be done. If the LEAP proposes deploying a new contract, write, "we propose to deploy a new contract that will do x".-->

LEAPs are a critical component to LYRA’s decentralized governance. Recently, we’ve seen some LEAPs stall for months on end, while others lack focused discourse in threads like #dao-chat. This is an efficiency that must be rectified.

This LEAP introduces a new 3 phase system which aims to streamline the LEAP decision making process. This will substantially improve the effectiveness of Lyra’s decentralized governance.

We also propose two new LEAP specific Discord channels: #dao-public-comment (where community, CCs and Council discuss proposals) and #council-floor (a publicly viewable channel where only the Council and CCs can post their thoughts).


## Motivation
<!--This is the problem statement. This is the *why* of the LEAP. It should clearly explain *why* the current state of the protocol is inadequate.  It is critical that you explain *why* the change is needed, if the LEAP proposes changing how something is calculated, you must address *why* the current calculation is inaccurate or wrong. This is not the place to describe how the LEAP will address the issue!-->
The following are observations made by the authors:
1. There is no clear timeframe for passing a LEAP. Many LEAPs often have stagnant threads but no resolution to central problems. Consequently, these proposals exist in limbo until eventually pushed to a vote.
2. Discussion in #dao-chat can often become unfocused, especially for contentious and broad LEAPs.
3. There is a lack of formal structure to the discussion that surrounds the LEAP


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
As is currently the case, anyone at any time will be able to propose a LEAP. The change we propose is a simple 3 phase process by which LEAPs are introduced, debated and eventually accepted or rejected.

The phases are as follows:

1) Preliminary Phase:

This occurs just after the LEAP is proposed. Anyone (community, CCs, Council, etc) can comment and discuss the LEAP during this period. Debate during this phase will occur in a dedicated Discord thread called #dao-public-comment with a sub-thread for each LEAP (as is the case for #dao-chat currently).

Changes to the LEAP can be made (add/remove in new sections, change parameters, etc) during this phase.

When proposed, the LEAP author decides the length of the preliminary phase (capped at 14 days).

At the end of the preliminary phase, the Council (with a simple majority via a Discord emoji vote) can move the proposal onto the next phase (Debate).

If the proposal does not receive a simple majority, it is automatically rejected and a new LEAP must be re-introduced.

If the vote passes, the author decides the length of the Debate phase (capped at 14 days).

2) Debate Phase:

This is where the LEAP begins to fully form. Here, the Council and community continue to discuss the LEAP in #dao-public comment.

Council and CCs have the right but not obligation to post their official opinions in #council-floor (with a thread dedicated to each LEAP). Note that only Council members and CC can comment in this channel. CC discussion should be focused on the LEAP’s implementation timelines, engineering resources needed and technical feasibility. CCs in particular should refine the proposal with respect to these goals.

More amendments can be proposed in this phase.

All LEAPs automatically progress to the next phase; the Council Phase.

At the end of the Debate phase, the author decides the length of the Council Phase (capped at 7 days).

3) Council Phase:

Council communication and debate will continue to occur in #council-floor when deemed appropriate by Council members.

Amendments can still be made to the LEAP during this time.

At the end of the Council phase, the LEAP is put to a vote on snapshot.

If the vote fails to gain the votes required for approval, then it must repeat steps 1) through 3) again as a new LEAP.

In all 3 phases, the Council is responsible for enforcing the timelines specified by the LEAP author.



### Rationale
<!--This is where you explain the reasoning behind how you propose to solve the problem. Why did you propose to implement the change in this way, what were the considerations and trade-offs. The rationale fleshes out what motivated the design and why particular design decisions were made. It should describe alternate designs that were considered and related work. The rationale may also provide evidence of consensus within the community, and should discuss important objections or concerns raised during discussion.-->
As explained earlier, this proposal will streamline the process of governance and help the Lyra ecosystem to flourish.

### Technical Specification
<!--The technical specification should outline the public API of the changes proposed. That is, changes to any of the interfaces Lyra currently exposes or the creations of new ones.-->

N/A


### Configurable Values
<!--Please list all values configurable under this implementation.-->
```
Maximum Preliminary Phase Length - 14 days
Maximum Debate Phase Length - 14 days
Maximum Council Phase Length - 7 days

```

## Copyright
Copyright and related rights waived via [CC0](https://creativecommons.org/publicdomain/zero/1.0/).
