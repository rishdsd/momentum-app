"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { journalPrompts, smartSets, trackers } from "@/lib/seed-data";
import type { JournalPeriod } from "@/types/domain";

export async function seedAccount() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const { count } = await supabase
    .from("trackers")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (count && count > 0) {
    revalidatePath("/");
    return;
  }

  const { data: insertedTrackers, error: trackerError } = await supabase
    .from("trackers")
    .insert(
      trackers.map((tracker) => ({
        user_id: user.id,
        name: tracker.name,
        category: tracker.category,
        unit: tracker.unit,
        weekly_target: tracker.weeklyTarget,
        overall_weight: tracker.weight,
        mode: tracker.mode ?? "count",
      })),
    )
    .select("id, name");

  if (trackerError) throw new Error(trackerError.message);

  const trackerIdByName = new Map((insertedTrackers ?? []).map((tracker) => [tracker.name, tracker.id]));
  const trackerIdBySeedId = new Map(trackers.map((tracker) => [tracker.id, trackerIdByName.get(tracker.name)]));

  const { data: insertedSmartSets, error: smartSetError } = await supabase
    .from("smart_sets")
    .insert(
      smartSets.map((set) => ({
        user_id: user.id,
        name: set.name,
        description: set.description,
      })),
    )
    .select("id, name");

  if (smartSetError) throw new Error(smartSetError.message);

  const smartSetIdByName = new Map((insertedSmartSets ?? []).map((set) => [set.name, set.id]));
  const smartSetItems = smartSets.flatMap((set) =>
    set.items
      .map((item) => ({
        smart_set_id: smartSetIdByName.get(set.name),
        tracker_id: trackerIdBySeedId.get(item.trackerId),
        amount: item.amount,
      }))
      .filter((item) => item.smart_set_id && item.tracker_id),
  );

  if (smartSetItems.length) {
    const { error } = await supabase.from("smart_set_items").insert(smartSetItems);
    if (error) throw new Error(error.message);
  }

  const promptRows = (Object.entries(journalPrompts) as Array<[JournalPeriod, string[]]>).flatMap(([period, prompts]) =>
    prompts.map((prompt, index) => ({
      user_id: user.id,
      period,
      prompt,
      sort_order: index,
    })),
  );
  const { error: promptError } = await supabase.from("journal_prompts").insert(promptRows);
  if (promptError) throw new Error(promptError.message);

  revalidatePath("/");
  revalidatePath("/log");
  revalidatePath("/journal");
  revalidatePath("/trackers");
  revalidatePath("/progress");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
