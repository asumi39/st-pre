#!/usr/bin/env node
/* 一次性素材脚本：按 PLAN.md §8 清单生成幻灯片插画（b64 落盘优先）。
 * 用法：node tools/gen-images.mjs
 * 读取 imagegen.txt（baseurl / key / model 三行），Key 不落日志。
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cfg = {};
{
  const lines = readFileSync(join(root, "imagegen.txt"), "utf8").split("\n").map(s => s.trim());
  let k = null;
  for (const line of lines) {
    if (!line) continue;
    if (["baseurl", "key", "model"].includes(line.toLowerCase())) { k = line.toLowerCase(); continue; }
    if (k && !cfg[k]) cfg[k] = line; // 值在 key 的下一非空行
  }
}
const { baseurl, key, model } = cfg;
if (!baseurl || !key || !model) { console.error("imagegen.txt 缺配置"); process.exit(1); }

const OUT = join(root, "slides", "assets", "gen");
mkdirSync(OUT, { recursive: true });

const IMAGES = [
  { name: "cover-hero.png", size: "1536x1024", prompt:
    "Cozy dark fantasy tavern interior at midnight, seen from inside. One warm candle flame on a long wooden counter, amber glow pooling on polished wood, deep brown-black shadows, faint window lattice silhouettes. Cinematic painterly illustration, empty centered composition reserved for typography, no people, no text, no letters." },
  { name: "divider-warm.png", size: "1536x1024", prompt:
    "Minimal abstract background texture: very dark warm brown wood grain, subtle amber candlelight bokeh drifting at the far edges, large empty dark center area, moody and quiet, painterly, no text, no objects." },
  { name: "divider-ink.png", size: "1536x1024", prompt:
    "Minimal abstract background texture: near-black charcoal paper with faint ember-orange sparks and thin smoke wisps at the corners, vast empty dark center, restrained and quiet, painterly, no text, no objects." },
  { name: "play-rpg.png", size: "1024x1024", prompt:
    "Small vignette illustration: a glowing amber d20 die on a dark tavern table beside parchment maps and a candle, warm rim light, dark fantasy painterly style, cozy and adventurous, no text, no letters on the map." },
  { name: "play-tutor.png", size: "1024x1024", prompt:
    "Small vignette illustration: an open language notebook with softly glowing pages on a warm study desk, a small candle lamp, steam from a cup, warm amber tones over dark background, painterly, no readable text, no letters." },
  { name: "play-coauthor.png", size: "1024x1024", prompt:
    "Small vignette illustration: an antique open book with pages glowing faint gold, ink mist rising and swirling into tiny fantasy shapes, a quill at rest, candlelit dark warm background, painterly, no readable text." },
  { name: "demo-card.png", size: "1024x1024", prompt:
    "Character portrait bust for a game card: a friendly tavern keeper with a warm gentle smile, apron and rolled sleeves, holding a small lantern, warm lantern light on the face, dark fantasy painterly style, centered composition, clean very dark background, no text." },
];

async function genOne({ name, size, prompt }, i) {
  const res = await fetch(`${baseurl}/images/generations`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, prompt, size, quality: "low", n: 1 }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`#${i} ${res.status}: ${t.slice(0, 160)}`);
  }
  const data = await res.json();
  const item = data.data?.[0] ?? {};
  if (item.b64_json) {
    writeFileSync(join(OUT, name), Buffer.from(item.b64_json, "base64"));
    return `${name}: b64 saved (${item.b64_json.length} b64 chars)`;
  }
  if (item.url) {
    const img = await fetch(item.url);
    const buf = Buffer.from(await img.arrayBuffer());
    writeFileSync(join(OUT, name), buf);
    return `${name}: url fallback saved (${buf.length} bytes)`;
  }
  throw new Error(`#${i} 响应既无 b64_json 也无 url`);
}

const results = await Promise.allSettled(IMAGES.map(genOne));
let failed = 0;
results.forEach((r, i) => {
  if (r.status === "fulfilled") console.log("ok ", r.value);
  else { failed++; console.error("ERR", IMAGES[i].name, "-", String(r.reason).slice(0, 200)); }
});
console.log(failed ? `DONE with ${failed} failures` : "DONE all ok");
process.exit(failed ? 2 : 0);
