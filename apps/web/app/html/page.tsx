import Link from "next/link";

export default function HtmlPage({
  searchParams
}: {
  searchParams: { title?: string; video?: string; author?: string };
}) {
  const title = searchParams.title || "抖音短视频";
  const author = searchParams.author || "未知作者";
  const video = searchParams.video || "";

  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl bg-white px-4 py-10 text-slate-900">
      <h1 className="text-2xl font-bold">可点击的 HTML 下载页</h1>
      <p className="mt-2 text-sm text-slate-600">这个页面可以直接部署，并通过链接分享给他人点击下载。</p>

      <section className="mt-6 rounded-xl border border-slate-200 p-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">作者：{author}</p>
        {video ? (
          <a
            href={video}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
          >
            点击下载视频
          </a>
        ) : (
          <p className="mt-3 text-sm text-red-600">缺少视频链接参数，无法下载。</p>
        )}
      </section>

      <Link href="/" className="mt-6 inline-block text-sm text-blue-700 underline">
        返回解析首页
      </Link>
    </main>
  );
}
