package middleware

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// LoggerMiddleware 日志中间件
func LoggerMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 生成请求 ID
		requestID := c.GetHeader("X-Request-ID")
		if requestID == "" {
			requestID = uuid.New().String()
		}
		c.Set("request_id", requestID)
		c.Writer.Header().Set("X-Request-ID", requestID)

		// 记录开始时间
		start := time.Now()
		path := c.Request.URL.Path
		query := c.Request.URL.RawQuery

		// 处理请求
		c.Next()

		// 记录日志
		latency := time.Since(start)
		statusCode := c.Writer.Status()
		clientIP := c.ClientIP()
		method := c.Request.Method
		userAgent := c.Request.UserAgent()

		// 构建日志
		latencyStr := latency.String()
		if query != "" {
			path = path + "?" + query
		}

		// 可以在这里替换为真实的日志库（如 logrus、zap）
		gin.DefaultWriter.Write([]byte(fmt.Sprintf(
			"[GIN] %s | %3d | %13v | %15s | %-7s %s | %s\n",
			time.Now().Format("2006-01-02 15:04:05"),
			statusCode,
			latencyStr,
			clientIP,
			method,
			path,
			userAgent,
		)))
	}
}

// RecoveryMiddleware 恢复中间件（捕获 panic）
func RecoveryMiddleware() gin.HandlerFunc {
	return gin.Recovery()
}
