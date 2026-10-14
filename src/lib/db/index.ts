import { isSupabaseConfigured } from "@/lib/env";
import { localStore } from "./local";
import { supabaseStore } from "./supabase";
import type { DataStore } from "./types";

/**
 * Resolved data store. Supabase is used automatically once
 * `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are present;
 * otherwise the local JSON store keeps everything working end-to-end.
 */
export const db: DataStore = isSupabaseConfigured() ? supabaseStore : localStore;

export * from "./types";
