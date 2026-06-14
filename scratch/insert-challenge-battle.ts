import fs from "fs";

const content = fs.readFileSync("server/bantahBro/agentBattleService.ts", "utf-8");

const challengeBattleFunc = `
function buildChallengeBattle(
  challenge: BotaAgentChallenge,
  now: Date,
  loadoutMap: Map<string, any[]>
): BantahBroAgentBattle {
  const battleWindowMs = getBattleWindowMs();
  const startsAtMs = challenge.scheduledAt ? new Date(challenge.scheduledAt).getTime() : now.getTime();
  const startsAt = new Date(startsAtMs);
  const endsAt = new Date(startsAt.getTime() + battleWindowMs);
  
  const leftId = challenge.challengerAgent.id;
  const rightId = challenge.opponentAgent.id;
  const leftLoadouts = loadoutMap.get(leftId) || [];
  const rightLoadouts = loadoutMap.get(rightId) || [];

  const leftTools = leftLoadouts.map(l => ({ id: l.tool_id, name: l.name, imageUrl: l.image_url, type: l.tool_type }));
  const rightTools = rightLoadouts.map(l => ({ id: l.tool_id, name: l.name, imageUrl: l.image_url, type: l.tool_type }));

  const leftConfidence = 50;
  const rightConfidence = 50;

  const buildSide = (agent: any, confidence: number, tools: any[]): BantahBroAgentBattleSide => ({
    id: agent.id,
    label: agent.name,
    agentName: agent.name,
    tokenSymbol: "BOTA",
    tokenName: agent.name,
    emoji: "⚔️",
    logoUrl: normalizeStoredAvatarUrl(agent.avatarUrl, agent.id),
    chainId: null,
    chainLabel: "BOTA",
    tokenAddress: null,
    pairAddress: null,
    pairUrl: null,
    dexId: null,
    priceUsd: null,
    priceDisplay: "Challenger",
    priceChangeM5: 0,
    priceChangeH1: 0,
    priceChangeH24: 0,
    change: formatPercent(0),
    direction: "flat",
    volumeM5: 0,
    volumeH1: 0,
    volumeH24: 0,
    liquidityUsd: null,
    marketCap: null,
    buysM5: 0,
    sellsM5: 0,
    buysH1: 0,
    sellsH1: 0,
    buysH24: 0,
    sellsH24: 0,
    pairAgeMinutes: null,
    dataSource: "fighter-profile",
    dataUpdatedAt: now.toISOString(),
    score: 100,
    confidence,
    status: "attacking",
    loadoutTools: tools,
  });

  const leftSide = buildSide(challenge.challengerAgent, leftConfidence, leftTools);
  const rightSide = buildSide(challenge.opponentAgent, rightConfidence, rightTools);

  const battleId = normalizeBattleIdentity(\`challenge:\${challenge.challengeCode}\`);

  return {
    id: battleId,
    title: \`\${challenge.challengerAgent.name} vs \${challenge.opponentAgent.name}\`,
    battleType: "agent-battle",
    status: endsAt.getTime() > now.getTime() ? "live" : "expired",
    winnerLogic: "BOTA Challenge Arena Engine: Live 1v1 PvP combat with equipped Gen1 Tools and Packs.",
    startsAt: startsAt.toISOString(),
    endsAt: endsAt.toISOString(),
    timeRemainingSeconds: Math.max(0, Math.ceil((endsAt.getTime() - now.getTime()) / 1000)),
    spectators: 1500,
    spectatorBantCredits: 0,
    rewardClaimBantCredits: 0,
    bantCreditsEarned: 0,
    isChallenge: true,
    challengeCode: challenge.challengeCode,
    sides: [leftSide, rightSide],
    leadingSideId: leftSide.id,
    confidenceSpread: 0,
    events: [
      {
        id: \`\${battleId}-start\`,
        time: eventTime(now, 5),
        type: "system",
        severity: "hot",
        sideId: null,
        agentName: "Main Event",
        message: \`Main Event PvP Challenge begins! \${challenge.stakeAmount} \${challenge.stakeCurrency} at stake.\`,
        metricLabel: "stake",
        metricValue: \`\${challenge.stakeAmount} \${challenge.stakeCurrency}\`,
      }
    ],
    updatedAt: now.toISOString(),
  };
}

async function buildBattleFighterPool(`;

const newContent = content.replace("async function buildBattleFighterPool(", challengeBattleFunc);

fs.writeFileSync("server/bantahBro/agentBattleService.ts", newContent, "utf-8");
