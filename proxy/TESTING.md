# proxy 验证记录（PLAN §4 验收口径）

日期：2026-10-30 · 环境：macOS，node v22.23.1，零外部依赖 · 服务：`node proxy/server.mjs`（端口 3011）
所有真实 Key 均由服务端从仓库根 `deepseek-key.txt` 读取，测试命令与输出中不含 Key。mock 文件位于系统临时目录（`…/T/opencode/proxy-test/mock-deepseek.mjs`），不进仓库。

## 1. 真实调用跑通 ≥1 次 ✅

服务不带环境变量启动（`key loaded: yes`，从 key 文件读取），真实调用一次：

```bash
curl -s -N -X POST http://127.0.0.1:3011/live/chat \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"用一句话欢迎来到深夜酒馆"}]}'
```

关键输出（共 25 个 delta 事件，节选）：

```
event: delta
data: {"t":"欢迎"}
…
event: delta
data: {"t":"着。”"}

event: done
data: {"usage":{"prompt_tokens":11,"completion_tokens":25,"total_tokens":36,"prompt_tokens_details":{"cached_tokens":0},"prompt_cache_hit_tokens":0,"prompt_cache_miss_tokens":11}}
```

- ✅ 收到 ≥1 个 `delta`（25 个）与 `done.usage`（usage 搭在最后一个内容 chunk 上，无独立 usage chunk，与 PLAN §4 一致）
- 服务端日志：`chat ip=127.0.0.1 ok in=11 out=25`（成本观测日志，约 0.002 元/次的口径）
- 响应体经 grep 审计不含 Key（见第 6 项）

## 2. 401 注入 ✅

```bash
DEEPSEEK_KEY=sk-wrong node proxy/server.mjs   # 假 Key 覆盖
curl -s -N -X POST http://127.0.0.1:3011/live/chat -H 'Content-Type: application/json' -d '{"messages":[{"role":"user","content":"hi"}]}'
```

```
event: error
data: {"code":401}
```

✅ 收到 `error 401` 事件（`sk-wrong` 为测试假 Key）。

## 3. 429 注入（本地 mock 上游） ✅

mock（临时文件 `mock-deepseek.mjs 429 4398`，立即返回 HTTP 429），服务指向上游 mock：

```bash
node mock-deepseek.mjs 429 4398
DEEPSEEK_BASE_URL=http://127.0.0.1:4398 node proxy/server.mjs
curl -s -N -X POST http://127.0.0.1:3011/live/chat -H 'Content-Type: application/json' -d '{"messages":[{"role":"user","content":"hi"}]}'
```

```
event: error
data: {"code":429}
```

✅ 上游 429 转成 `error {"code":429}` SSE 事件。

## 4. 断网回退 ✅

```bash
DEEPSEEK_BASE_URL=http://127.0.0.1:9/v1 node proxy/server.mjs   # 不存在的端口
curl -s -N -X POST …/live/chat …
curl -s http://127.0.0.1:3011/live/health
```

```
event: error
data: {"code":"network"}
{"ok":true}          ← 失败后服务存活
event: error
data: {"code":"network"}   ← 第二次请求同样正常回错
```

✅ `error network`，服务不崩、可继续服务。

## 5. 首包超时 ✅

mock（`mock-deepseek.mjs slow 4399`）接受连接后睡 8s 才响应；服务指向该 mock：

```bash
time curl -s -N --max-time 15 -X POST http://127.0.0.1:3011/live/chat -H 'Content-Type: application/json' -d '{"messages":[{"role":"user","content":"hi"}]}'
curl -s http://127.0.0.1:3011/live/health
```

```
event: error
data: {"code":"timeout"}
curl … 0% cpu 6.039 total        ← 6s 准时触发
{"ok":true}                      ← 超时后服务存活
```

✅ 6.04s 触发 `error timeout` 并中止上游（mock 8s 才响应，证明是代理主动切断），服务不崩。

## 6. Key 零暴露审计 ✅

```bash
key=$(cat deepseek-key.txt)
grep -rc "$key" proxy/                                                # 预期全 0
grep -c  "$key" …/proxy-test/t1-response.txt                          # 预期 0（真实调用响应体）
cat …/proxy-test/server-t*.log | grep -c "$key"                       # 预期 0（全部服务端日志）
git grep -l "$key" | wc -l                                            # 预期 0（已跟踪文件）
grep -n 'sk-' proxy/server.mjs                                        # 预期无匹配（无硬编码）
```

结果：`proxy/server.mjs:0`、响应体 `0`、服务端日志 `0`、git 已跟踪文件 `0`、源码无任何 `sk-` 形态字符串。
✅ Key 只存在于 `DEEPSEEK_KEY` 环境变量与 `deepseek-key.txt`（均已 gitignore / 不落日志）；启动日志仅 `key loaded: yes/no`。

## 7. 限流 ✅

上游指向 429 mock（避免真实调用），同一 IP 连发 11 次：

```bash
for i in $(seq 1 11); do curl -s -o /dev/null -w '%{http_code}\n' -X POST http://127.0.0.1:3011/live/chat \
  -H 'Content-Type: application/json' -d '{"messages":[{"role":"user","content":"hi"}]}'; done
```

```
200 200 200 200 200 200 200 200 200 200 429
```

✅ 前 10 次放行（HTTP 200，流内为 mock 的 SSE error 429），第 11 次普通 HTTP `429`（响应体 `{"error":"rate_limited"}`，带 `Retry-After: 60`）。限流窗口内再次 POST 也会被拒（实测复现），窗口过期自动恢复。

## 附加契约验证（非 PLAN 必测项）

| 请求 | 预期 | 实际 |
|---|---|---|
| POST messages×5 | 400 | ✅ `{"error":"bad_messages","message":"messages 超过 4 条上限"}` |
| POST 非法 JSON | 400 | ✅ `{"error":"invalid_json"}` |
| POST 空 messages | 400 | ✅ `{"error":"bad_messages","message":"messages 必须是非空数组"}` |
| OPTIONS /live/chat | 204 + CORS | ✅ 204，`Access-Control-Allow-Origin: *` 等 4 个头 |
| GET /live/chat | 405 | ✅ 405 |
| GET /live/health（各故障场景后） | 200 | ✅ 多次确认 `{"ok":true}` |

## 结论

PLAN §4 验证口径全部满足：真实调用跑通 ✅ · 401/429 注入 ✅ · 断网回退 ✅ · 首包超时 ✅ · Key 零暴露 ✅ · 限流 ✅。
真实上游调用共 1 次（36 tokens，成本 ≈0.002 元）；其余均为 mock/注入。残项：无。
