#!/usr/bin/env node
import { createWriteStream } from "node:fs";
import { mkdir, stat } from "node:fs/promises";
import { spawn } from "node:child_process";
import { resolve, dirname, relative } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const SOURCE_COMMIT = "11a2b8a141b1a9df9f76efda544287ebf46b206e";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, "..");

const assets = [
  {
    label: "Mesh background",
    repoPath: "frontend/public/background.png",
  },
  {
    label: "Hero demo poster",
    repoPath: "frontend/src/assets/hero-demo-poster.jpg",
  },
  {
    label: "Hero marketing still",
    repoPath: "frontend/public/hero.png",
  },
  {
    label: "Hero demo video",
    repoPath: "frontend/public/hero-demo.webm",
  },
];

async function run() {
  for (const asset of assets) {
    const destination = resolve(rootDir, asset.repoPath);
    await mkdir(dirname(destination), { recursive: true });

    const result = await restoreAsset({ ...asset, destination });
    if (!result) {
      process.exitCode = 1;
    }
  }
}

async function restoreAsset({ label, repoPath, destination }) {
  const rel = relative(rootDir, destination);
  try {
    await stat(destination);
    // Overwrite to guarantee we match the source commit.
  } catch (error) {
    if ((error && typeof error === "object" && "code" in error && error.code !== "ENOENT") || !(error instanceof Error)) {
      console.error(`✖ ${label} (${rel}): ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }

  const git = spawn("git", ["show", `${SOURCE_COMMIT}:${repoPath}`], {
    cwd: rootDir,
    stdio: ["ignore", "pipe", "pipe"],
  });

  const output = createWriteStream(destination);
  const stderrChunks = [];

  git.stderr.on("data", (chunk) => {
    stderrChunks.push(Buffer.from(chunk));
  });

  const completion = new Promise((resolvePromise, rejectPromise) => {
    output.on("error", rejectPromise);
    git.on("error", rejectPromise);
    git.on("close", (code) => {
      if (code !== 0) {
        const errorOutput = Buffer.concat(stderrChunks).toString("utf8").trim();
        rejectPromise(new Error(errorOutput || `git exited with code ${code}`));
      } else {
        resolvePromise();
      }
    });
  });

  git.stdout.pipe(output);

  try {
    await completion;
    console.log(`✔ ${label} restored to ${rel}`);
    return true;
  } catch (error) {
    console.error(`✖ ${label} (${rel}): ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

run().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : String(error));
  process.exitCode = 1;
});
