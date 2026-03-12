#!/usr/bin/env python3
"""简单的命令行番茄时钟。"""

from __future__ import annotations

import argparse
import time


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="命令行番茄时钟")
    parser.add_argument("--work", type=int, default=25, help="专注时长（分钟），默认 25")
    parser.add_argument("--break", dest="break_minutes", type=int, default=5, help="休息时长（分钟），默认 5")
    parser.add_argument("--cycles", type=int, default=4, help="循环次数，默认 4")
    return parser.parse_args()


def countdown(total_seconds: int, label: str) -> None:
    print(f"\n{label} 开始！")
    for remaining in range(total_seconds, 0, -1):
        minutes, seconds = divmod(remaining, 60)
        print(f"\r{label} 剩余 {minutes:02d}:{seconds:02d}", end="", flush=True)
        time.sleep(1)
    print("\r" + " " * 40, end="\r", flush=True)


def tick_alert(repeat: int = 6) -> None:
    for i in range(repeat):
        print(f"\a滴答！时间到啦（提醒 {i + 1}/{repeat}）")
        time.sleep(1)


def main() -> None:
    args = parse_args()
    work_seconds = args.work * 60
    break_seconds = args.break_minutes * 60

    if args.work <= 0 or args.break_minutes <= 0 or args.cycles <= 0:
        raise SystemExit("work、break、cycles 都必须是正整数。")

    print("番茄时钟已启动。按 Ctrl+C 可随时停止。")
    try:
        for cycle in range(1, args.cycles + 1):
            print(f"\n===== 第 {cycle}/{args.cycles} 个番茄 =====")
            countdown(work_seconds, "专注")
            tick_alert()

            if cycle < args.cycles:
                countdown(break_seconds, "休息")
                tick_alert(3)

        print("\n恭喜你，所有番茄周期完成！")
    except KeyboardInterrupt:
        print("\n已停止番茄时钟。")


if __name__ == "__main__":
    main()
