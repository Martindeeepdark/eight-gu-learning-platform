package cache

import (
	"context"
	"fmt"
	"time"

	"eight-gu-learning-platform/internal/config"

	"github.com/redis/go-redis/v9"
)

// Cache Redis 缓存客户端
type Cache struct {
	client *redis.Client
	ctx    context.Context
}

// NewCache 创建 Redis 缓存客户端
func NewCache(cfg *config.RedisConfig) (*Cache, error) {
	client := redis.NewClient(&redis.Options{
		Addr:     cfg.GetRedisAddr(),
		Password: cfg.Password,
		DB:       cfg.DB,
		PoolSize: cfg.PoolSize,
	})

	ctx := context.Background()
	cache := &Cache{
		client: client,
		ctx:    ctx,
	}

	// 测试连接
	if err := client.Ping(ctx).Err(); err != nil {
		return nil, fmt.Errorf("failed to connect to redis: %w", err)
	}

	return cache, nil
}

// Set 设置缓存
func (c *Cache) Set(key string, value interface{}, ttl time.Duration) error {
	return c.client.Set(c.ctx, key, value, ttl).Err()
}

// Get 获取缓存
func (c *Cache) Get(key string) (string, error) {
	return c.client.Get(c.ctx, key).Result()
}

// Delete 删除缓存
func (c *Cache) Delete(key string) error {
	return c.client.Del(c.ctx, key).Err()
}

// Exists 检查键是否存在
func (c *Cache) Exists(key string) (bool, error) {
	n, err := c.client.Exists(c.ctx, key).Result()
	if err != nil {
		return false, err
	}
	return n > 0, nil
}

// SetJSON 设置 JSON 缓存
func (c *Cache) SetJSON(key string, value interface{}, ttl time.Duration) error {
	return c.client.JSONSet(c.ctx, key, "$", value).Err()
}

// GetJSON 获取 JSON 缓存
func (c *Cache) GetJSON(key string) (string, error) {
	return c.client.JSONGet(c.ctx, key, "$").Result()
}

// DeletePattern 删除匹配模式的键
func (c *Cache) DeletePattern(pattern string) error {
	iter := c.client.Scan(c.ctx, 0, pattern, 0).Iterator()
	for iter.Next(c.ctx) {
		if err := c.client.Del(c.ctx, iter.Val()).Err(); err != nil {
			return err
		}
	}
	return iter.Err()
}

// Close 关闭连接
func (c *Cache) Close() error {
	return c.client.Close()
}

// GetClient 获取原生 Redis 客户端
func (c *Cache) GetClient() *redis.Client {
	return c.client
}
