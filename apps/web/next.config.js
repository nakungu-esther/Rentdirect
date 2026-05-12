import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** Monorepo root (…/BACKEND) — avoids Turbopack picking a parent folder with another lockfile. */
const turbopackRoot = path.resolve(__dirname, "..", "..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: turbopackRoot,
  },
};

export default nextConfig;
