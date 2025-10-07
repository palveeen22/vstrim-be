import { createClient } from 'redis';

// Create Redis client singleton
class RedisClient {
  private static instance: ReturnType<typeof createClient>;
  private static isConnecting: boolean = false;
  private static connectionPromise: Promise<ReturnType<typeof createClient>> | null = null;
  
  private constructor() {}
  
  public static async getInstance() {
    // If we already have an instance and it's connected, return it
    if (RedisClient.instance?.isOpen) {
      return RedisClient.instance;
    }
    
    // If we're in the process of connecting, wait for that to complete
    if (RedisClient.isConnecting && RedisClient.connectionPromise) {
      return RedisClient.connectionPromise;
    }
    
    // Start a new connection process
    RedisClient.isConnecting = true;
    RedisClient.connectionPromise = (async () => {
      try {
        // Close any existing connection that might be in a bad state
        if (RedisClient.instance) {
          try {
            await RedisClient.instance.quit();
          } catch (err) {
            console.warn('Error closing previous Redis connection:', err);
          }
        }
        
        // Determine Redis URL - with fallbacks
        let redisUrl = process.env.REDIS_URL;
        if (!redisUrl) {
          console.warn('REDIS_URL not set, falling back to default localhost URL');
          redisUrl = 'redis://localhost:6379';
        }
        
        console.log('Connecting to Redis at:', redisUrl);
        
        // Initialize Redis client with more options
        RedisClient.instance = createClient({
          url: redisUrl,
          socket: {
            reconnectStrategy: (retries) => {
              // Maximum retry delay is 5 seconds
              const delay = Math.min(retries * 100, 5000);
              console.log(`Redis reconnect attempt ${retries} in ${delay}ms`);
              return delay;
            },
            connectTimeout: 10000, // 10 seconds
          }
        });
        
        // Add event handlers
        RedisClient.instance.on('error', (err) => {
          console.error('Redis error:', err);
        });
        
        RedisClient.instance.on('connect', () => {
          console.log('Redis connected');
        });
        
        RedisClient.instance.on('reconnecting', () => {
          console.log('Redis reconnecting...');
        });
        
        RedisClient.instance.on('end', () => {
          console.log('Redis connection closed');
        });
        
        // Connect to Redis
        await RedisClient.instance.connect();
        
        // Test connection with a ping
        const pingResult = await RedisClient.instance.ping();
        console.log('Redis ping result:', pingResult);
        
        return RedisClient.instance;
      } catch (error) {
        console.error('Failed to connect to Redis:', error);
        throw error;
      } finally {
        RedisClient.isConnecting = false;
        RedisClient.connectionPromise = null;
      }
    })();
    
    return RedisClient.connectionPromise;
  }
  
  // Helper method to check Redis connection
  public static async testConnection(): Promise<boolean> {
    try {
      const client = await RedisClient.getInstance();
      const testKey = 'connection-test';
      await client.set(testKey, 'connected');
      const testValue = await client.get(testKey);
      await client.del(testKey);
      return testValue === 'connected';
    } catch (error) {
      console.error('Redis connection test failed:', error);
      return false;
    }
  }
}

export default RedisClient;