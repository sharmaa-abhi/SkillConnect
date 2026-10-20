/**
 * Server-side non-personal Cache for Live Local Price Intelligence
 *
 * Configurable TTL (default 24h) guarantees we avoid redundant calls to
 * TinyFish Free Tier Search and Fetch APIs.
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export class MemoryCache<T> {
  private store = new Map<string, CacheEntry<T>>();
  private readonly defaultTtlMs: number;
  private readonly maxEntries: number;

  constructor(defaultTtlMs: number = 24 * 60 * 60 * 1000, maxEntries: number = 500) {
    this.defaultTtlMs = defaultTtlMs;
    this.maxEntries = maxEntries;
  }

  public get(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.data;
  }

  public set(key: string, data: T, ttlMs?: number): void {
    const ttl = ttlMs !== undefined ? ttlMs : this.defaultTtlMs;
    const now = Date.now();

    // Evict oldest if limit reached
    if (this.store.size >= this.maxEntries) {
      const oldestKey = this.store.keys().next().value;
      if (oldestKey) this.store.delete(oldestKey);
    }

    this.store.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl,
    });
  }

  public has(key: string): boolean {
    return this.get(key) !== null;
  }

  public delete(key: string): boolean {
    return this.store.delete(key);
  }

  public clear(): void {
    this.store.clear();
  }

  public size(): number {
    return this.store.size;
  }
}

// Global singletons for Search and Fetch results
export const priceSearchCache = new MemoryCache<unknown>(24 * 60 * 60 * 1000, 300);
export const priceFetchCache = new MemoryCache<unknown>(24 * 60 * 60 * 1000, 500);
export const priceComparisonCache = new MemoryCache<unknown>(24 * 60 * 60 * 1000, 300);
