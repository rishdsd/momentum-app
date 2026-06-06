"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

export async function createTracker(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const unit = String(formData.get("unit") ?? "").trim();
  const weeklyTarget = Number(formData.get("weeklyTarget"));
  const overallWeight = Number(formData.get("overallWeight"));
  const mode = String(formData.get("mode") ?? "count");

  if (!name || !category || !unit || weeklyTarget <= 0 || overallWeight < 1 || overallWeight > 10) {
    throw new Error("Invalid tracker details.");
  }

  const { error } = await supabase.from("trackers").insert({
    user_id: user.id,
    name,
    category,
    unit,
    weekly_target: weeklyTarget,
    overall_weight: overallWeight,
    mode,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/log");
  revalidatePath("/trackers");
  revalidatePath("/progress");
}

export async function createLog(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const trackerId = String(formData.get("trackerId") ?? "");
  const amount = Number(formData.get("amount"));
  const mood = Number(formData.get("mood"));
  const energy = Number(formData.get("energy"));
  const note = String(formData.get("note") ?? "").trim();
  const loggedOn = String(formData.get("loggedOn") ?? new Date().toISOString().slice(0, 10));

  if (!trackerId || amount <= 0 || mood < 1 || mood > 5 || energy < 1 || energy > 5) {
    throw new Error("Invalid log details.");
  }

  const { data: tracker, error: trackerError } = await supabase
    .from("trackers")
    .select("id")
    .eq("id", trackerId)
    .eq("user_id", user.id)
    .single();

  if (trackerError || !tracker) throw new Error("Tracker not found.");

  const { error } = await supabase.from("logs").insert({
    user_id: user.id,
    tracker_id: trackerId,
    amount,
    mood,
    energy,
    note: note || null,
    logged_on: loggedOn,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/log");
  revalidatePath("/progress");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
