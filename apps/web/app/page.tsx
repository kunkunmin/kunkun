"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type DownloadResult = {
  title: string;
  author: string;
  cover: string;
  play: string;
  hdplay?: string;
};

export default function Page() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<DownloadResult | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "解析失败");
      setResult(data.data as DownloadResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "请求失败");
    } finally {
      setLoading(false);
    }
  }

  const videoUrl = result?.hdplay || result?.play;
  const htmlShareLink = useMemo(() => {
    if (!result || !videoUrl) return "";
    const params = new URLSearchParams({
      title: result.title || "抖音短视频",
      author: result.author || "未知作者",
      video: videoUrl
    });
    return `/html?${params.toString()}`;
  }, [result, videoUrl]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl bg-slate-950 px-4 py-10 text-slate-100">
      <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6 shadow-2xl">
        <h1 className="text-2xl font-bold">抖音短视频下载 Web</h1>
        <p className="mt-2 text-sm text-slate-400">粘贴抖音分享链接，自动解析无水印直链（仅供学习交流）。</p>

        <form className="mt-6 space-y-3" onSubmit={onSubmit}>
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://v.douyin.com/xxxxxx/"
            className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 outline-none ring-indigo-500 placeholder:text-slate-500 focus:ring"
          />
          <button
            disabled={loading}
            className="w-full rounded-xl bg-indigo-500 px-4 py-3 font-medium text-white transition hover:bg-indigo-400 disabled:opacity-60"
          >
            {loading ? "解析中..." : "开始解析"}
          </button>
        </form>

        {error && <p className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}

        {result && videoUrl && (
          <section className="mt-6 rounded-xl border border-slate-700 bg-slate-800/60 p-4">
            <h2 className="text-lg font-semibold">{result.title || "未获取到标题"}</h2>
            <p className="mt-1 text-sm text-slate-400">作者：{result.author || "未知"}</p>
            {result.cover && (
              <img src={result.cover} alt={result.title} className="mt-3 max-h-80 w-full rounded-lg object-cover" />
            )}
            <div className="mt-4 flex gap-3">
              <a
                href={videoUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-400"
              >
                打开视频链接
              </a>
              <a
                href={videoUrl}
                download
                className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-400"
              >
                下载视频
              </a>
            </div>
            {htmlShareLink && (
              <div className="mt-4 rounded-lg border border-slate-600 bg-slate-900 p-3">
                <p className="text-xs text-slate-400">部署后可直接点击的 HTML 链接：</p>
                <Link href={htmlShareLink} target="_blank" className="mt-2 block break-all text-sm text-cyan-300 underline">
                  {htmlShareLink}
                </Link>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
