/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';

// Simple persistent JSON file cache.
// Stores entries under .data/cache as individual JSON files, keyed by a hashed key.
// Each entry has: { value: any, timestamp: number }

const CACHE_DIR = path.join(process.cwd(), 'data', 'cache');

function ensureDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function safeKey(key: string) {
  // Create a filesystem-safe key
  const hash = Buffer.from(key).toString('base64').replace(/[/+=]/g, '');
  return hash.slice(0, 64); // limit length
}

export async function getCached<T = any>(key: string, ttlMs: number): Promise<T | null> {
  try {
    ensureDir();
    const file = path.join(CACHE_DIR, safeKey(key) + '.json');
    if (!fs.existsSync(file)) return null;

    const content = await fs.promises.readFile(file, 'utf8');
    const parsed = JSON.parse(content) as { value: T; timestamp: number };

    if (!parsed || typeof parsed.timestamp !== 'number') return null;
    const isExpired = Date.now() - parsed.timestamp > ttlMs;
    if (isExpired) return null;

    return parsed.value;
  } catch {
    return null;
  }
}

export async function setCached<T = any>(key: string, value: T): Promise<void> {
  ensureDir();
  const file = path.join(CACHE_DIR, safeKey(key) + '.json');
  const payload = JSON.stringify({ value, timestamp: Date.now() });
  await fs.promises.writeFile(file, payload, 'utf8');
}
