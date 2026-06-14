import fs from "fs";

const file = "client/public/2dgame/engine/GameEngine.js";
let content = fs.readFileSync(file, "utf8");

// 1. Tool check helper
if (!content.includes("hasGrenadeTool(actor)")) {
  content = content.replace(
    "  getOpponent(fighter) {",
    `  hasGrenadeTool(actor) {
    if (!this.arenaState) return false;
    const sideState = this.fighters.indexOf(actor) === 0 ? this.arenaState.left : this.arenaState.right;
    if (!sideState || !sideState.loadoutTools) return false;
    return sideState.loadoutTools.some(t => String(t.name || "").toLowerCase().includes("grenade") || String(t.rarity || "").toUpperCase() === "EPIC");
  }

  getOpponent(fighter) {`
  );
}

// 2. Action choice
if (!content.includes("return \"grenade\";")) {
  content = content.replace(
    "    if (healthRatio < 0.3 && energy >= 4 && !cooldowns.heavy && roll < 0.42) return heavyAttack;",
    `    if (this.hasGrenadeTool(actor) && energy >= 3 && !cooldowns.grenade && roll < 0.25) return "grenade";
    if (healthRatio < 0.3 && energy >= 4 && !cooldowns.heavy && roll < 0.42) return heavyAttack;`
  );
}

// 3. Action delay
if (!content.includes("grenade: 800,")) {
  content = content.replace(
    "      charge: 520,",
    `      charge: 520,
      grenade: 800,`
  );
}

// 4. Perform action
if (!content.includes("case \"grenade\":")) {
  content = content.replace(
    "      case \"repair\":",
    `      case "grenade":
        actor.energy = Math.max(0, (actor.energy || 0) - 3);
        actor.cooldowns.grenade = 4;
        this.spawnProjectile(actor, defender, {
          kind: action,
          damage: 35,
          color: "#4ade80",
          radius: 12,
          duration: 620,
        });
        this.updateEnergyHud(actor);
        this.playSfx("hit", actor);
        return;

      case "repair":`
  );
}

// 5. Arc rendering
content = content.replace(
  "Math.sin(progress * Math.PI) * 34;",
  "Math.sin(progress * Math.PI) * (projectile.kind === \"grenade\" ? 80 : 34);"
);

// 6. Draw grenade
if (!content.includes("drawGrenadeProjectile(")) {
  content = content.replace(
    "  drawProjectile(projectile, x, y, progress) {",
    `  drawGrenadeProjectile(projectile, x, y, progress) {
    const context = this.context;
    context.save();
    context.translate(x, y);
    context.rotate(progress * Math.PI * 12);
    context.fillStyle = "#3f3f46";
    context.shadowColor = "#4ade80";
    context.shadowBlur = 10;
    context.beginPath();
    context.roundRect(-8, -12, 16, 24, 4);
    context.fill();
    context.fillStyle = "#22c55e";
    context.fillRect(-8, -2, 16, 4);
    context.fillStyle = "#dc2626";
    context.beginPath();
    context.arc(0, -12, 3, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }

  drawProjectile(projectile, x, y, progress) {
    if (projectile.kind === "grenade") {
      this.drawGrenadeProjectile(projectile, x, y, progress);
      return;
    }`
  );
}

// 7. Impact
content = content.replace(
  "    const isFire = projectile.kind === \"volley\" || projectile.kind === \"fireball\" || projectile.kind === \"fireSlash\";",
  `    const isFire = projectile.kind === "volley" || projectile.kind === "fireball" || projectile.kind === "fireSlash";
    const isGrenade = projectile.kind === "grenade";`
);

content = content.replace(
  "this.spawnSpriteFx(isFire ? \"flame\" : \"water\", center.x, center.y + 8, {",
  `this.spawnSpriteFx(isFire || isGrenade ? "flame" : "water", center.x, center.y + 8, {`
);

content = content.replace(
  "scale: projectile.kind === \"fireball\" ? 0.92 : isFire ? 0.78 : 0.66,",
  `scale: projectile.kind === "fireball" ? 0.92 : isGrenade ? 1.5 : isFire ? 0.78 : 0.66,`
);

content = content.replace(
  "        : isFire",
  `        : isFire || isGrenade`
);

fs.writeFileSync(file, content, "utf8");
console.log("Patched GameEngine.js with Grenade mechanics.");
