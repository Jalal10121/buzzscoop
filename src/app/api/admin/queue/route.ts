import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { queue } from "@/lib/autonomous/queue";

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({
    stats: queue.stats(),
    drafts: queue.all().slice(0, 50),
  });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { action, id } = await req.json();

  if (action === "approve" && id) {
    const result = queue.approve(id);
    if (result) {
      revalidatePath("/");
      revalidatePath(`/blog/${result.slug}`);
      return NextResponse.json({ success: true, article: result });
    }
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (action === "reject" && id) {
    queue.reject(id);
    return NextResponse.json({ success: true });
  }

  if (action === "approve-all") {
    const pending = queue.pending();
    const results = [];
    for (const draft of pending) {
      const result = queue.approve(draft.id);
      if (result) results.push(result.slug);
    }
    revalidatePath("/");
    return NextResponse.json({ success: true, published: results.length });
  }

  if (action === "clear") {
    queue.clear();
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (id) {
    queue.reject(id);
  }
  return NextResponse.json({ success: true });
}