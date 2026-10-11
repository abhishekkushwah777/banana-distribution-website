import { getApk } from "@/lib/github";

export async function GET(request: Request) {
  const rawId = new URL(request.url).searchParams.get("assetId");
  if (!rawId || !/^\d+$/.test(rawId)) return Response.json({ error: "Invalid APK asset." }, { status: 400 });
  try {
    const asset = await getApk(Number(rawId));
    if (!asset) return Response.json({ error: "APK asset not found." }, { status: 404 });
    return new Response(asset.body, {
      headers: {
        "Content-Type": "application/vnd.android.package-archive",
        "Content-Disposition": `attachment; filename="${asset.name.replace(/["\\\r\n]/g, "_")}"`,
        "Content-Length": String(asset.size),
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("APK download error:", error);
    return Response.json({ error: "APK download temporarily unavailable." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
