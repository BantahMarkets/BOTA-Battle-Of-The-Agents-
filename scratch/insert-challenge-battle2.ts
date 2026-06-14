import fs from "fs";

const content = fs.readFileSync("server/bantahBro/agentBattleService.ts", "utf-8");

const oldFuncRegex = /function buildChallengeBattle[\s\S]*?async function buildBattleFighterPool\(/m;

const newFunc = `function buildChallengeBattle(
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

  const mapTool = (l: any) => ({
    id: l.tool_id,
    name: l.tool_name || l.name,
    imageUrl: l.tool_metadata?.image_url || l.image_url || l.metadata?.image_url,
    type: l.tool_type || "item",
    rarity: String(l.tool_rarity || "COMMON").toUpperCase(),
  });

  const leftTools = leftLoadouts.map(mapTool);
  const rightTools = rightLoadouts.map(mapTool);

  const calculateToolScore = (tools: any[]) => {
    let score = 100;
    for (const tool of tools) {
      if (tool.rarity === "EPIC") score += 30;
      else if (tool.rarity === "RARE") score += 15;
      else if (tool.rarity === "COMMON") score += 5;
      else score += 10;
    }
    return score;
  };

  const leftScore = calculateToolScore(leftTools);
  const rightScore = calculateToolScore(rightTools);
  const totalScore = Math.max(1, leftScore + rightScore);
  const leftConfidence = Math.max(5, Math.min(95, Math.round((leftScore / totalScore) * 100)));
  const rightConfidence = 100 - leftConfidence;

  const buildSide = (agent: any, confidence: number, tools: any[], score: number): BantahBroAgentBattleSide => ({
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
    score,
    confidence,
    status: "attacking",
    loadoutTools: tools,
  });

  const leftSide = buildSide(challenge.challengerAgent, leftConfidence, leftTools, leftScore);
  const rightSide = buildSide(challenge.opponentAgent, rightConfidence, rightTools, rightScore);

  const battleId = normalizeBattleIdentity(\`challenge:\${challenge.challengeCode}\`);

  return {
    id: battleId,
    title: \`\${challenge.challengerAgent.name} vs \${challenge.opponentAgent.name}\`,
    battleType: "agent-battle",
    status: endsAt.getTime() > now.getTime() ? "live" : "expired",
    winnerLogic: "BOTA Challenge Arena Engine: Live 1v1 PvP combat heavily influenced by equipped Gen1 Tools and Packs (EPIC +30, RARE +15, COMMON +5).",
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
    confidenceSpread: Math.abs(leftConfidence - rightConfidence),
    events: [
      {
        id: \`\${battleId}-start\`,
        time: eventTime(now, 5),
        type: "system",
        severity: "hot",
        sideId: null,
        agentName: "Main Event",
        message: \`Main Event PvP Challenge begins! \${challenge.stakeAmount} \${challenge.stakeCurrency} at stake. Win odds shifted by equipped tools!\`,
        metricLabel: "stake",
        metricValue: \`\${challenge.stakeAmount} \${challenge.stakeCurrency}\`,
      }
    ],
    updatedAt: now.toISOString(),
  };
}

async function buildBattleFighterPool(`;

const newContent = content.replace(oldFuncRegex, newFunc);
fs.writeFileSync("server/bantahBro/agentBattleService.ts", newContent, "utf-8");
