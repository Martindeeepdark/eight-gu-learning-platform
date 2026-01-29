package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// HealthHandler 健康检查处理器
type HealthHandler struct {
	dbStatus bool
	redisStatus bool
}

// NewHealthHandler 创建健康检查处理器
func NewHealthHandler() *HealthHandler {
	return &HealthHandler{
		dbStatus: true,
		redisStatus: true,
	}
}

// SetDBStatus 设置数据库状态
func (h *HealthHandler) SetDBStatus(status bool) {
	h.dbStatus = status
}

// SetRedisStatus 设置 Redis 状态
func (h *HealthHandler) SetRedisStatus(status bool) {
	h.redisStatus = status
}

// Health 健康检查
// @Summary 健康检查
// @Tags System
// @Accept json
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Router /health [get]
func (h *HealthHandler) Health(c *gin.Context) {
	status := http.StatusOK
	if !h.dbStatus || !h.redisStatus {
		status = http.StatusServiceUnavailable
	}

	c.JSON(status, gin.H{
		"status":    "ok",
		"database":  h.getStatus(h.dbStatus),
		"cache":     h.getStatus(h.redisStatus),
	})
}

func (h *HealthHandler) getStatus(healthy bool) string {
	if healthy {
		return "healthy"
	}
	return "unhealthy"
}
