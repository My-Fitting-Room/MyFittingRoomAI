import { decode } from "base64-arraybuffer";
import { supabase } from "../App";
import { monthRange } from "./date";

// Planner uploads are plain images stored as-is: straight to Supabase Storage
// plus a direct outfit_plans insert, never through the Render backend (which
// would run background removal / classification).

const BUCKET = "outfit_plans";

const PLAN_SELECT = "*, tryon_images(id, url, status), avatar_tryon_images(id, url, status)";

export type OutfitPlan = {
  id: string;
  profiles_id: string;
  outfit_date: string;
  source_type: "tryon" | "avatar_tryon" | "upload";
  tryon_images_id: number | null;
  avatar_tryon_images_id: number | null;
  image_url: string | null;
  storage_path: string | null;
  tryon_images?: { id: string; url: string; status: string } | null;
  avatar_tryon_images?: { id: string; url: string; status: string } | null;
};

export const thumbnailUrl = (plan: OutfitPlan): string | null => {
  if (plan.source_type === "tryon") return plan.tryon_images?.url ?? null;
  if (plan.source_type === "avatar_tryon") return plan.avatar_tryon_images?.url ?? null;
  return plan.image_url;
};

export const fetchMonth = async (
  profileId: string,
  year: number,
  month: number,
): Promise<Record<string, OutfitPlan>> => {
  const { start, end } = monthRange(year, month);
  const { data, error } = await supabase
    .from("outfit_plans")
    .select(PLAN_SELECT)
    .eq("profiles_id", profileId)
    .gte("outfit_date", start)
    .lte("outfit_date", end);

  if (error) throw error;

  const byDate: Record<string, OutfitPlan> = {};
  for (const plan of data ?? []) {
    byDate[plan.outfit_date] = plan;
  }
  return byDate;
};

const removeStorageObject = async (storagePath: string | null) => {
  if (!storagePath) return;
  // Best-effort: an orphaned object is harmless and user-scoped
  try {
    await supabase.storage.from(BUCKET).remove([storagePath]);
  } catch (e) {}
};

// The unique(profiles_id, outfit_date) constraint is deferrable (for atomic
// swaps), which Postgres upserts can't target — so occupied dates update the
// existing row in place and empty dates insert.
const savePlan = async (
  profileId: string,
  dateStr: string,
  sourceColumns: Partial<OutfitPlan>,
  existing: OutfitPlan | null,
): Promise<OutfitPlan> => {
  const row = {
    source_type: null as any,
    tryon_images_id: null,
    avatar_tryon_images_id: null,
    image_url: null,
    storage_path: null,
    ...sourceColumns,
  };

  const query = existing
    ? supabase.from("outfit_plans").update(row).eq("id", existing.id)
    : supabase.from("outfit_plans").insert({ ...row, profiles_id: profileId, outfit_date: dateStr });

  const { data, error } = await query.select(PLAN_SELECT).single();
  if (error) throw error;

  if (existing) {
    await removeStorageObject(existing.storage_path);
  }
  return data;
};

export const createFromLook = (
  profileId: string,
  dateStr: string,
  sourceType: "tryon" | "avatar_tryon",
  sourceId: string,
  existing: OutfitPlan | null = null,
): Promise<OutfitPlan> =>
  savePlan(
    profileId,
    dateStr,
    sourceType === "tryon"
      ? { source_type: "tryon", tryon_images_id: sourceId }
      : { source_type: "avatar_tryon", avatar_tryon_images_id: sourceId },
    existing,
  );

// asset is a react-native-image-picker asset picked with includeBase64: true
export const createFromUpload = async (
  profileId: string,
  dateStr: string,
  asset: { base64?: string; type?: string },
  existing: OutfitPlan | null = null,
): Promise<OutfitPlan> => {
  if (!asset.base64) {
    throw new Error("Image data missing");
  }

  const contentType = asset.type || "image/jpeg";
  const ext = contentType.split("/")[1] === "png" ? "png" : "jpg";
  const storagePath = `${profileId}/${Date.now()}_${Math.random().toString(36).slice(2, 10)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, decode(asset.base64), { contentType });
  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

  try {
    return await savePlan(
      profileId,
      dateStr,
      { source_type: "upload", image_url: publicUrl, storage_path: storagePath },
      existing,
    );
  } catch (error) {
    // Row never landed, so don't leave the fresh object behind
    await removeStorageObject(storagePath);
    throw error;
  }
};

export const removePlan = async (plan: OutfitPlan): Promise<void> => {
  const { error } = await supabase.from("outfit_plans").delete().eq("id", plan.id);
  if (error) throw error;
  await removeStorageObject(plan.storage_path);
};

// Atomic move/swap via RPC; a client-side date shuffle can't be atomic over
// PostgREST with the unique constraint in place
export const movePlan = async (fromDateStr: string, toDateStr: string): Promise<void> => {
  const { error } = await supabase.rpc("move_outfit_plan", {
    p_from: fromDateStr,
    p_to: toDateStr,
  });
  if (error) throw error;
};
