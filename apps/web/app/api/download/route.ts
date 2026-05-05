import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { url?: string };
    const url = body.url?.trim();

    if (!url) {
      return NextResponse.json({ error: "请提供抖音链接" }, { status: 400 });
    }

    const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;
    const response = await fetch(api, { cache: "no-store" });
    const json = (await response.json()) as {
      code?: number;
      msg?: string;
      data?: {
        title?: string;
        author?: { nickname?: string };
        cover?: string;
        play?: string;
        hdplay?: string;
      };
    };

    if (!response.ok || json.code !== 0 || !json.data?.play) {
      return NextResponse.json({ error: json.msg || "解析失败，请检查链接是否可用" }, { status: 400 });
    }

    return NextResponse.json({
      data: {
        title: json.data.title || "",
        author: json.data.author?.nickname || "",
        cover: json.data.cover || "",
        play: json.data.play,
        hdplay: json.data.hdplay || ""
      }
    });
  } catch {
    return NextResponse.json({ error: "服务异常，请稍后再试" }, { status: 500 });
  }
}
