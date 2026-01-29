package handler

import (
	"eight-gu-learning-platform/internal/middleware"
	"eight-gu-learning-platform/internal/service"
	"eight-gu-learning-platform/internal/utils"

	"github.com/gin-gonic/gin"
)

// ProgressHandler 学习进度处理器
type ProgressHandler struct {
	progressService *service.ProgressService
}

// NewProgressHandler 创建学习进度处理器
func NewProgressHandler(progressService *service.ProgressService) *ProgressHandler {
	return &ProgressHandler{
		progressService: progressService,
	}
}

// GetProgress 获取学习进度
// @Summary 获取学习进度
// @Tags Progress
// @Produce json
// @Security Bearer
// @Param user_id query int false "用户ID"
// @Param knowledge_id query int false "知识点ID"
// @Param category_id query int false "分类ID"
// @Success 200 {object} utils.Response
// @Router /api/v1/learning/progress [get]
func (h *ProgressHandler) GetProgress(c *gin.Context) {
	var req service.GetProgressRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		utils.ParamError(c, err.Error())
		return
	}

	// 如果没有指定用户ID，使用当前用户
	if req.UserID == 0 {
		req.UserID = middleware.GetUserID(c)
	}

	progresses, err := h.progressService.GetByUser(&req)
	if err != nil {
		utils.InternalError(c, err.Error())
		return
	}

	utils.Success(c, progresses)
}

// UpdateProgress 更新学习进度
// @Summary 更新学习进度
// @Tags Progress
// @Accept json
// @Produce json
// @Security Bearer
// @Param request body service.UpdateProgressRequest true "进度信息"
// @Success 200 {object} utils.Response
// @Router /api/v1/learning/progress [post]
func (h *ProgressHandler) UpdateProgress(c *gin.Context) {
	userID := middleware.GetUserID(c)
	if userID == 0 {
		utils.UnauthorizedError(c)
		return
	}

	var req service.UpdateProgressRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ParamError(c, err.Error())
		return
	}

	progress, err := h.progressService.Update(userID, &req)
	if err != nil {
		utils.InternalError(c, err.Error())
		return
	}

	utils.SuccessWithMessage(c, "更新成功", progress)
}

// GetStats 获取学习统计
// @Summary 获取学习统计
// @Tags Progress
// @Produce json
// @Security Bearer
// @Success 200 {object} utils.Response
// @Router /api/v1/learning/stats [get]
func (h *ProgressHandler) GetStats(c *gin.Context) {
	userID := middleware.GetUserID(c)
	if userID == 0 {
		utils.UnauthorizedError(c)
		return
	}

	stats, err := h.progressService.GetStats(userID)
	if err != nil {
		utils.InternalError(c, err.Error())
		return
	}

	utils.Success(c, stats)
}
