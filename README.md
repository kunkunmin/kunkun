# 番茄时钟

一个简单的命令行番茄时钟，到点会用“滴答”文字 + 终端蜂鸣提醒你。

## 运行方式

```bash
python3 pomodoro.py
```

## 可选参数

- `--work`：专注时长（分钟），默认 `25`
- `--break`：休息时长（分钟），默认 `5`
- `--cycles`：循环次数，默认 `4`

示例（1 分钟专注，1 分钟休息，循环 2 次）：

```bash
python3 pomodoro.py --work 1 --break 1 --cycles 2
```
