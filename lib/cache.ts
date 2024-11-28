import { LRUCache } from 'lru-cache';

const cache = new LRUCache({
  max: 500, // Maximum number of items to store
  ttl: 1000 * 60 * 5, // 5 minutes
  allowStale: false,
  updateAgeOnGet: true,
  updateAgeOnHas: true,
});

export async function withCache<T>(key: string, fn: () => Promise<T>): Promise<T> {
  try {
    // Check cache first
    const cached = cache.get(key);
    if (cached) {
      // Validate cached data
      if (!cached || (typeof cached === 'object' && Object.keys(cached).length === 0)) {
        throw new Error('Invalid cached data');
      }
      return cached as T;
    }

    // If not in cache, execute function
    const result = await fn();
    
    // Validate result before caching
    if (!result || (typeof result === 'object' && Object.keys(result).length === 0)) {
      throw new Error('Invalid result from function');
    }

    // Cache the valid result
    cache.set(key, result);
    return result;
  } catch (error) {
    console.error('Cache error:', error);
    // On cache error, execute function directly
    return await fn();
  }
}