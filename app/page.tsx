import Image from "next/image";
import { connection } from "next/server";
import { getLatestApkRelease } from "@/lib/github";

function formatSize(bytes: number) {
  return bytes < 1048576
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1048576).toFixed(1)} MB`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

export default async function Home() {
  // Read the runtime environment and release data per request, not during build.
  await connection();
  const release = await getLatestApkRelease();
  return (
    <main className="site-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Banana home">
          <Image src="/app-icon.png" alt="" width={48} height={48} priority />
          <span className="brand-copy"><strong>BANANA</strong><small>CHAT, YOUR WAY</small></span>
        </a>
        <a className="source-link" href="https://github.com/abhishekkushwah777/BANANA_app_reactNative" target="_blank" rel="noreferrer"><span>App repository</span><span aria-hidden="true">↗</span></a>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="status-dot" /> OFFICIAL ANDROID RELEASE</div>
          <h1>Talk more.<br /><span>Scroll less.</span></h1>
          <p className="hero-description">Your conversations, close at hand. Get the latest Banana app for Android and stay in the loop with your people.</p>
          <a className={release?.apk ? "download-button" : "download-button disabled"} href={release?.apk?.downloadUrl ?? "#latest-release"} aria-disabled={!release?.apk}>
            <span className="button-icon" aria-hidden="true">↓</span><span className="button-copy"><strong>Download for Android</strong><small>{release?.apk ? `APK · ${formatSize(release.apk.size)}` : "Release unavailable"}</small></span><span className="button-arrow" aria-hidden="true">↗</span>
          </a>
          <p className="install-note"><span aria-hidden="true">✦</span> Official APK from the Banana team</p>
          <div className="proof-points"><span><b>✓</b> Private conversations</span><span><b>✓</b> Always up to date</span></div>
        </div>

        <div className="preview-stage" aria-label="Preview of Banana chat on Android">
          <div className="stage-orbit orbit-a" /><div className="stage-orbit orbit-b" />
          <div className="preview-label"><Image src="/app-icon.png" alt="" width={32} height={32} /><span><strong>Meet you in Banana</strong><small>Your people are one tap away</small></span><span className="label-spark">✦</span></div>
          <div className="phone screenshot-phone">
            <span className="dynamic-island" aria-hidden="true" />
            <Image className="welcome-screenshot" src="/welcome.png" alt="Banana welcome screen shown on an Android phone" width={393} height={852} priority />
          </div>
          <div className="floating-note note-top"><span className="note-check">✓</span><span><strong>Made for your people</strong><small>Private, personal chats</small></span></div>
          <div className="floating-note note-bottom"><span className="note-bubble">✦</span><span><strong>Fresh from GitHub</strong><small>Official latest build</small></span></div>
        </div>
      </section>

      <section className="release-section" id="latest-release">
        <div className="release-heading"><div><span className="section-kicker">THE LATEST BUILD</span><h2>Ready when you are.</h2></div><span className="live-pill"><i /> LIVE RELEASE</span></div>
        {release ? (
          <div className="release-card">
            <Image className="release-app-icon" src="/app-icon.png" alt="" width={54} height={54} />
            <div className="release-info"><div className="release-title"><h3>{release.name || release.tagName}</h3><span className="latest-badge">LATEST</span></div><p>{release.apk?.name ?? "No APK attached to this release yet."}</p></div>
            <div className="release-meta"><small>Published</small><strong>{formatDate(release.publishedAt)}</strong></div>
            {release.apk && <div className="release-meta file-size"><small>File size</small><strong>{formatSize(release.apk.size)}</strong></div>}
            <a className="release-download" href={release.apk?.downloadUrl ?? release.htmlUrl} aria-label={release.apk ? "Download latest APK" : "View release on GitHub"}>{release.apk ? "↓" : "↗"}</a>
          </div>
        ) : (
            <div className="release-card release-empty"><Image className="release-app-icon" src="/app-icon.png" alt="" width={54} height={54} /><div className="release-info"><h3>Latest release unavailable</h3><p>{process.env.GITHUB_TOKEN ? "Check the GitHub token permissions and repository settings." : "Set GITHUB_TOKEN in your local or deployment environment, then restart or redeploy."}</p></div></div>
        )}
      </section>

      <section className="feature-row" aria-label="App highlights">
        <div><span className="feature-icon">✦</span><span><strong>Stay connected</strong><small>Real-time chats with your people</small></span></div>
        <div><span className="feature-icon">⌑</span><span><strong>Private by design</strong><small>Your conversations stay yours</small></span></div>
        <div><span className="feature-icon">↻</span><span><strong>Always current</strong><small>The latest Android release</small></span></div>
      </section>
      <footer className="site-footer">
        <a className="footer-brand" href="/"><Image src="/app-icon.png" alt="" width={30} height={30} /><strong>BANANA</strong></a>
        <small>© {new Date().getFullYear()} Banana. Made for your people.</small>
        <a href="https://github.com/abhishekkushwah777/BANANA_app_reactNative/releases/latest" target="_blank" rel="noreferrer">View all releases ↗</a>
      </footer>
    </main>
  );
}
