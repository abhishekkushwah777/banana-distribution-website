import "server-only";

const api = "https://api.github.com";
const owner = process.env.GITHUB_OWNER || "abhishekkushwah777";
const repo = process.env.GITHUB_REPO || "BANANA_app_reactNative";

export type LatestRelease = {
  name: string;
  tagName: string;
  publishedAt: string;
  htmlUrl: string;
  apk: { id: number; name: string; size: number; downloadUrl: string } | null;
};
type GitHubRelease = {
  name: string | null;
  tag_name: string;
  published_at: string | null;
  html_url: string;
  assets: Array<{ id: number; name: string; size: number; state: string }>;
};

async function githubFetch(path: string, accept = "application/vnd.github+json") {
  return fetch(`${api}${path}`, {
    headers: {
      Accept: accept,
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "banana-distribution-website",
    },
    next: { revalidate: 300 },
  });
}

export async function getLatestApkRelease(): Promise<LatestRelease | null> {
  if (!process.env.GITHUB_TOKEN) return null;
  const response = await githubFetch(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/releases/latest`);
  if (!response.ok) {
    const details = await response.json().catch(() => null) as { message?: string } | null;
    console.error("GitHub latest release request failed:", {
      status: response.status,
      message: details?.message ?? "No response details",
      repository: `${owner}/${repo}`,
    });
    return null;
  }
  const release = (await response.json()) as GitHubRelease;
  const apk = release.assets
    .filter((asset) => asset.state === "uploaded" && asset.name.toLowerCase().endsWith(".apk"))
    .sort((a, b) => Number(b.name.toLowerCase().includes("universal")) - Number(a.name.toLowerCase().includes("universal")))[0];
  return {
    name: release.name || release.tag_name,
    tagName: release.tag_name,
    publishedAt: release.published_at || new Date().toISOString(),
    htmlUrl: release.html_url,
    apk: apk ? { id: apk.id, name: apk.name, size: apk.size, downloadUrl: `/api/download?assetId=${apk.id}` } : null,
  };
}

export async function getApk(assetId: number) {
  const release = await getLatestApkRelease();
  if (!release?.apk || release.apk.id !== assetId) return null;
  const response = await githubFetch(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/releases/assets/${assetId}`,
    "application/octet-stream",
  );
  if (!response.ok || !response.body) {
    console.error("GitHub asset request failed:", response.status);
    return null;
  }
  return { body: response.body, size: release.apk.size, name: release.apk.name };
}
