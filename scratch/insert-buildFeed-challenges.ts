import fs from "fs";

const content = fs.readFileSync("server/bantahBro/agentBattleService.ts", "utf-8");

const oldBuildFeed = `async function buildFeed(limit: number): Promise<BantahBroAgentBattlesFeed> {
  const requestedBattles = clamp(Math.round(limit || 3), 1, 50);
  const now = new Date();
  pruneExpiredBattleSnapshots(now);
  lockedRoundBattleSnapshots = lockedRoundBattleSnapshots.filter((battle) =>
    battle.sides.some((side) => side.dataSource === "fighter-profile" || side.dataSource === "ens-subgraph"),
  );
  if (lockedRoundBattleSnapshots.length >= requestedBattles) {
    return buildLockedRoundFeed(now, requestedBattles);
  }
  const fighterPool = await buildBattleFighterPool(requestedBattles);
  const pairs = pairProfilesForRound(fighterPool, requestedBattles, now);
  const battles = pairs.map(([left, right], index) =>
    buildFighterProfileBattle(left, right, index, now),
  );
  lockedRoundBattleSnapshots = battles;
  lockedRoundBattleIds = battles.map((battle) => battle.id);
  lockedRoundCandidateSnapshots = [];

  return buildLockedRoundFeed(now, requestedBattles);
}`;

const newBuildFeed = `async function buildFeed(limit: number): Promise<BantahBroAgentBattlesFeed> {
  const requestedBattles = clamp(Math.round(limit || 3), 1, 50);
  const now = new Date();
  pruneExpiredBattleSnapshots(now);
  lockedRoundBattleSnapshots = lockedRoundBattleSnapshots.filter((battle) =>
    battle.isChallenge || battle.sides.some((side) => side.dataSource === "fighter-profile" || side.dataSource === "ens-subgraph"),
  );
  
  if (lockedRoundBattleSnapshots.length >= requestedBattles) {
    return buildLockedRoundFeed(now, requestedBattles);
  }

  // 1. Fetch pending User Challenges
  const pendingChallenges = await listBotaAgentChallenges({ limit: 5, status: "all" });
  const activeChallenges = pendingChallenges.filter(c => c.status !== "resolved" && c.status !== "cancelled" && c.status !== "expired");

  const loadoutMap = new Map<string, any[]>();
  if (activeChallenges.length > 0) {
    const agentIds = activeChallenges.flatMap(c => [c.challengerAgent.id, c.opponentAgent.id]);
    const map = await getFighterToolLoadoutMap(agentIds);
    map.forEach((value, key) => loadoutMap.set(key, value));
  }

  const challengeBattles = activeChallenges.map(challenge => buildChallengeBattle(challenge, now, loadoutMap));

  const fighterPool = await buildBattleFighterPool(requestedBattles);
  const pairs = pairProfilesForRound(fighterPool, requestedBattles, now);
  const autoBattles = pairs.map(([left, right], index) =>
    buildFighterProfileBattle(left, right, index, now),
  );
  
  const battles = [...challengeBattles, ...autoBattles];
  lockedRoundBattleSnapshots = battles;
  lockedRoundBattleIds = battles.map((battle) => battle.id);
  lockedRoundCandidateSnapshots = [];

  return buildLockedRoundFeed(now, requestedBattles);
}`;

const newContent = content.replace(oldBuildFeed, newBuildFeed);
fs.writeFileSync("server/bantahBro/agentBattleService.ts", newContent, "utf-8");
