package middleware

import (
	"sync"
	"time"

	"eight-gu-learning-platform/internal/utils"

	"github.com/gin-gonic/gin"
)

// RateLimiter 限流器
type RateLimiter struct {
	mu       sync.Mutex
	clients  map[string]*ClientInfo
	interval time.Duration
	limit    int
}

// ClientInfo 客户端信息
type ClientInfo struct {
	Requests int
	LastSeen time.Time
}

// NewRateLimiter 创建限流器
func NewRateLimiter(interval time.Duration, limit int) *RateLimiter {
	rl := &RateLimiter{
		clients:  make(map[string]*ClientInfo),
		interval: interval,
		limit:    limit,
	}

	// 定期清理过期客户端
	go rl.cleanup()

	return rl
}

// Allow 检查是否允许请求
func (rl *RateLimiter) Allow(clientID string) bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	now := time.Now()
	client, exists := rl.clients[clientID]

	// 如果不存在或者已过期，重置
	if !exists || now.Sub(client.LastSeen) >= rl.interval {
		rl.clients[clientID] = &ClientInfo{
			Requests: 1,
			LastSeen: now,
		}
		return true
	}

	// 检查是否超过限制
	if client.Requests >= rl.limit {
		return false
	}

	client.Requests++
	client.LastSeen = now
	return true
}

// cleanup 清理过期客户端
func (rl *RateLimiter) cleanup() {
	ticker := time.NewTicker(time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		rl.mu.Lock()
		now := time.Now()
		for id, client := range rl.clients {
			if now.Sub(client.LastSeen) >= rl.interval {
				delete(rl.clients, id)
			}
		}
		rl.mu.Unlock()
	}
}

// RateLimitMiddleware 限流中间件
func RateLimitMiddleware(rl *RateLimiter) gin.HandlerFunc {
	return func(c *gin.Context) {
		clientID := c.ClientIP()

		if !rl.Allow(clientID) {
			utils.Error(c, utils.CodeErrorInternal, "请求过于频繁，请稍后再试")
			c.Abort()
			return
		}

		c.Next()
	}
}
