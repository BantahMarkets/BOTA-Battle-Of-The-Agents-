import { seedGen1SeasonOneTools, ensureGen1EconomyTables } from './server/bantahBro/gen1EconomyService'; 
ensureGen1EconomyTables().then(() => seedGen1SeasonOneTools()).then(() => console.log('Done')).catch(console.error);
