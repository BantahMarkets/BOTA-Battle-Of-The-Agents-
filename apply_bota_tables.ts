import { db } from './server/db';
import { sql } from 'drizzle-orm';

async function run() {
  try {
    console.log("Creating bota_tools_catalog table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "bota_tools_catalog" (
        "id" text PRIMARY KEY NOT NULL,
        "name" text NOT NULL,
        "tier" text NOT NULL,
        "role" text NOT NULL,
        "compatible_trait" text NOT NULL,
        "trigger_condition_desc" text,
        "trigger_condition_json" jsonb,
        "effect_desc" text NOT NULL,
        "effect_json" jsonb NOT NULL,
        "cooldown_rounds" integer DEFAULT 0,
        "soul_drain_enabled" boolean DEFAULT false,
        "once_per_battle" boolean DEFAULT false,
        "power_rating" integer NOT NULL
      );
    `);

    console.log("Creating bota_tool_inventory table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "bota_tool_inventory" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "tool_catalog_id" text NOT NULL,
        "owner_wallet" text NOT NULL,
        "acquired_from" text,
        "acquired_at" timestamp DEFAULT now(),
        "equipped_to_fighter_id" text,
        "equipped_at" timestamp
      );
    `);

    console.log("Creating bota_fighter_loadout table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "bota_fighter_loadout" (
        "fighter_id" text PRIMARY KEY NOT NULL,
        "owner_wallet" text NOT NULL,
        "primary_tool_id" uuid,
        "secondary_tool_id" uuid,
        "passive_tool_id" uuid,
        "effective_tier" text DEFAULT 'none' NOT NULL,
        "soul_drain_active" boolean DEFAULT false,
        "last_updated" timestamp DEFAULT now()
      );
    `);

    console.log("Creating bota_fighter_combat_profiles table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "bota_fighter_combat_profiles" (
        "fighter_id" text PRIMARY KEY NOT NULL,
        "source" text NOT NULL,
        "aggression" integer NOT NULL,
        "defense" integer NOT NULL,
        "intelligence" integer NOT NULL,
        "speed" integer NOT NULL,
        "luck" integer NOT NULL,
        "hp" integer NOT NULL,
        "generation_bonus" integer DEFAULT 0,
        "profile_generated_at" timestamp DEFAULT now(),
        "profile_version" integer DEFAULT 1
      );
    `);

    console.log("Creating bota_arena_battle_records table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "bota_arena_battle_records" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "record_key" varchar(360) NOT NULL,
        "battle_id" varchar(255) NOT NULL,
        "source_battle_id" varchar(255),
        "title" varchar(255) NOT NULL,
        "arena_id" varchar(120),
        "status" varchar(24) DEFAULT 'resolved' NOT NULL,
        "winner_agent_id" varchar(180),
        "winner_side_id" varchar(180),
        "loser_agent_id" varchar(180),
        "loser_side_id" varchar(180),
        "provider" varchar(40) NOT NULL,
        "adapter_version" varchar(40) NOT NULL,
        "engine_version" varchar(40) NOT NULL,
        "seed" varchar(255) NOT NULL,
        "rounds" integer DEFAULT 0 NOT NULL,
        "spectators" integer DEFAULT 0 NOT NULL,
        "fighters" jsonb DEFAULT '[]'::jsonb NOT NULL,
        "round_log" jsonb DEFAULT '[]'::jsonb NOT NULL,
        "simulation" jsonb NOT NULL,
        "battle_snapshot" jsonb DEFAULT '{}'::jsonb NOT NULL,
        "metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
        "started_at" timestamp,
        "ended_at" timestamp,
        "resolved_at" timestamp DEFAULT now(),
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "bota_arena_battle_records_record_key_unique" UNIQUE("record_key")
      );
    `);

    console.log("Creating bota_battle_round_log table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "bota_battle_round_log" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "battle_id" uuid NOT NULL,
        "round_number" integer NOT NULL,
        "fighter_id" text NOT NULL,
        "action_taken" text NOT NULL,
        "tool_used_id" text,
        "damage_dealt" integer,
        "hp_after" integer,
        "win_probability_before" numeric(5, 2),
        "rng_seed" text,
        "created_at" timestamp DEFAULT now()
      );
    `);

    console.log("Creating soul_drain_cooldowns table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "soul_drain_cooldowns" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "winner_wallet" text NOT NULL,
        "loser_wallet" text NOT NULL,
        "drained_at" timestamp DEFAULT now()
      );
    `);

    console.log("Creating bantcredit_balances table...");
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "bantcredit_balances" (
        "wallet_address" text PRIMARY KEY NOT NULL,
        "balance" numeric(20, 8) DEFAULT '0' NOT NULL,
        "last_updated" timestamp DEFAULT now()
      );
    `);

    console.log("Successfully created all required BOTA V2 tables.");
    process.exit(0);
  } catch (error) {
    console.error("Error creating tables:", error);
    process.exit(1);
  }
}

run();
