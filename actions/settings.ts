"use server";

import { revalidatePath } from "next/cache";
import Settings from "@/models/Settings";
import connectDB from "@/lib/dbConnect";

// Get a setting by key
export async function getSetting(key: string) {
  try {
    await connectDB();
    const setting = await Settings.findOne({ key });
    return setting ? JSON.parse(JSON.stringify(setting.value)) : null;
  } catch (error) {
    console.error(`Error fetching setting ${key}:`, error);
    return null;
  }
}

// Set a setting value
export async function setSetting(key: string, value: any) {
  try {
    await connectDB();
    const setting = await Settings.findOneAndUpdate(
      { key },
      { key, value },
      { upsert: true, new: true }
    );
    revalidatePath("/admin/settings");
    return JSON.parse(JSON.stringify(setting));
  } catch (error) {
    console.error(`Error setting ${key}:`, error);
    throw new Error(`Failed to set ${key}`);
  }
}

// Get active seasons (seasons that should be visible on public site)
export async function getActiveSeasons(): Promise<string[]> {
  try {
    await connectDB();
    const setting = await Settings.findOne({ key: "activeSeasons" });
    return setting ? setting.value : [];
  } catch (error) {
    console.error("Error fetching active seasons:", error);
    return [];
  }
}

// Set active seasons
export async function setActiveSeasons(seasons: string[]) {
  try {
    await connectDB();
    await Settings.findOneAndUpdate(
      { key: "activeSeasons" },
      { key: "activeSeasons", value: seasons },
      { upsert: true, new: true }
    );
    revalidatePath("/admin/settings");
    revalidatePath("/fixtures");
    revalidatePath("/results");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error setting active seasons:", error);
    throw new Error("Failed to set active seasons");
  }
}

// Get all settings
export async function getAllSettings() {
  try {
    await connectDB();
    const settings = await Settings.find({});
    return JSON.parse(JSON.stringify(settings));
  } catch (error) {
    console.error("Error fetching all settings:", error);
    return [];
  }
}
