#!/usr/bin/env node
import { stat } from "node:fs/promises";
import { resolve, relative } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, "..");
const rootDir = resolve(__dirname, "..");

const budgets = [
  {
    label: "Hero WebM",
    path: resolve(rootDir, "frontend/public/hero-demo.webm"),
    limitBytes: Math.round(1.2 * 1024 * 1024),
  },
  {
    label: "Hero poster source",
    path: resolve(rootDir, "frontend/src/assets/hero-demo-poster.jpg"),
    limitBytes: 200 * 1024,
  },
];

async function run() {
  let failures = 0;

  for (const item of budgets) {
    try {
      const info = await stat(item.path);
      if (!info.isFile()) {
        logFailure(item, `Missing file — run \`npm run restore:hero-media\` before checking budgets.`);
        failures += 1;
        continue;
      }

      if (info.size > item.limitBytes) {
        logFailure(
          item,
          `File size ${formatBytes(info.size)} exceeds budget ${formatBytes(item.limitBytes)}`,
        );
        failures += 1;
      } else {
        logSuccess(
          item,
          `File size ${formatBytes(info.size)} within budget ${formatBytes(item.limitBytes)}`,
        );
      }
    } catch (error) {
      const message =
        error instanceof Error && error.code === "ENOENT"
          ? `Missing file — run \`npm run restore:hero-media\` before checking budgets.`
          : error instanceof Error
            ? error.message
            : String(error);
      logFailure(item, message);
      failures += 1;
    }
  }

  if (failures > 0) {
    process.exitCode = 1;
  }
}

function logSuccess(item, message) {
  const rel = relative(rootDir, item.path);
  console.log(`✔ ${item.label} (${rel}): ${message}`);
}

function logFailure(item, message) {
  const rel = relative(rootDir, item.path);
  console.error(`✖ ${item.label} (${rel}): ${message}`);
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

run();
