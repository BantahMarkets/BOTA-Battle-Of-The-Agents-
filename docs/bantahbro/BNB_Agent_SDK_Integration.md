# BOTA BNB Agent SDK Integration

## Purpose

BOTA will pilot the next game-system upgrade on BNB Chain first, then extend the proven pieces to Base and other chains.

The BNB upgrade is not just another battle recorder. It adds a BNB-native agent identity and challenge-commerce layer around BOTA fighters.

Primary references:

- BNB Agent SDK announcement: https://www.bnbchain.org/en/blog/bnbagent-sdk-is-now-live-on-bnb-chain-mainnet-the-modular-standard-for-identity-commerce-payment-and-memory-in-ai-agents
- SDK repository: https://github.com/bnb-chain/bnbagent-sdk
- BNB community wishlist: https://github.com/bnb-chain/community-contributions/blob/main/2025/2025h2.md

## Phase 1: BNB Agent Identity

Use the BNB Agent SDK / ERC-8004 identity direction for BOTA fighters.

Each eligible BOTA fighter gets:

- BOTA fighter id
- BNB Chain id
- metadata URI
- profile endpoint
- stats endpoint
- battle-history endpoint
- challenge endpoint
- source community
- owner wallet when known
- registration tx and BNB agent id only after real SDK registration

Important rule: do not mark a fighter as registered until a real BNB registration tx or SDK agent id exists.

Current platform endpoints:

- `GET /api/bantahbro/bnb/agents/:agentId/context`
- `GET /api/bantahbro/bnb/agents/:agentId/metadata`
- `GET /api/bantahbro/bnb/agents/:agentId/battles`
- `POST /api/bantahbro/admin/bnb/agents/:agentId/registration`

The admin registration endpoint stores real registration data after registration happens. It does not perform fake registration.

## Phase 2: Challenge Commerce

Use ERC-8183-style task/commerce flow only where it fits naturally:

- user challenges a graduated admin agent
- user starts a paid BNB challenge
- challenge fee is escrowed
- result is submitted
- settlement/refund/dispute flow can be represented as an agent commerce job

Do not force ERC-8183 onto every simulator battle. Simulator battles are high-frequency game events; challenge jobs are intentional user/admin-agent actions.

## Phase 3: Gen 1 Economy On BNB

After identity and challenge rails are stable, add the new Gen 1 economy:

- BC reward earning
- Common tools through grindable BC
- Rare/Epic tools through paid/purchased BC
- seasonal tool supply
- tool inventory
- marketplace listing rules
- fighter history and value score

Keep token meanings separate:

- BC/BantCredit: in-game utility and reputation points
- BANTC: onchain claimable BantCredit representation
- BOTA: separate reward/community token

## Simulator And Challenge Roles

Simulator mode remains a 24/7 autonomous battle engine. It is not only a tutorial.

Admin-seeded agents keep fights running even when user PvP is quiet. Strong simulator agents can graduate into Challenge Mode, where users can challenge them on BNB Chain.

This solves:

- empty PvP queue
- low-content moments
- lack of BNB-native AI-agent actions

## Grant Fit

The BNB version should emphasize:

- AI agent identity and reputation
- agent registration/discovery
- AI-native payment/challenge flows
- gamified agent competition
- leaderboards, quests, and social participation
- onchain activity from real challenge and reward actions

## Implementation Guardrails

- No mocks, fake agent ids, or fake registration status.
- BNB identity metadata may be generated before registration, but status must remain `ready_to_register` or `registry_not_configured`.
- Simulator recording and Challenge Mode settlement stay separate.
- Use BNB Agent SDK for identity/challenge rails after the registry contract and gas wallet are confirmed.
- Prove on BNB first, then mirror the successful pattern to Base.
