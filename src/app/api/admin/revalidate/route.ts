import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  revalidatePath("/");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/category/[category]", "page");
  revalidatePath("/tag/[tag]", "page");
  revalidatePath("/archive/[year]/[month]", "page");

  return NextResponse.json({ success: true, revalidated: new Date().toISOString() });
}