import { getLatestApkRelease } from "@/lib/github";

export async function GET() {
  try {
    const release = await getLatestApkRelease();
    if (!release) return Response.json({ error: "Release unavailable." }, {
      status: process.env.GITHUB_TOKEN ? 404 : 503,
      headers: { "Cache-Control": "no-store" },
    });
    return Response.json(release, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" },
    });
  } catch (error) {
    console.error("Release API error:", error);
    return Response.json({ error: "Release service unavailable." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
