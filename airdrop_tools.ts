import { db } from './server/db';
import { botaToolsCatalog, botaToolInventory } from './shared/schema';
import { sql } from 'drizzle-orm';

async function run() {
  const walletAddress = process.argv[2];
  if (!walletAddress) {
    console.error("Please provide a wallet address as the first argument.");
    process.exit(1);
  }

  try {
    console.log(`Fetching available tools from catalog...`);
    const allTools = await db.select().from(botaToolsCatalog);
    if (allTools.length === 0) {
      console.error("No tools found in catalog. Did you run the seeder?");
      process.exit(1);
    }

    // Select 5 random tools to drop
    const toolsToDrop = [];
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * allTools.length);
      toolsToDrop.push(allTools[randomIndex]);
    }

    console.log(`Dropping ${toolsToDrop.length} tools to wallet ${walletAddress}...`);
    
    for (const tool of toolsToDrop) {
      await db.insert(botaToolInventory).values({
        toolCatalogId: tool.id,
        ownerWallet: walletAddress,
        acquiredFrom: 'debug_airdrop',
      });
      console.log(`- Dropped: ${tool.name} (${tool.tier} ${tool.role})`);
    }

    console.log("Airdrop complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error during airdrop:", error);
    process.exit(1);
  }
}

run();
