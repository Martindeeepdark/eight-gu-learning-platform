package handler

import (
	"eight-gu-learning-platform/internal/middleware"
	"eight-gu-learning-platform/internal/service"
	"eight-gu-learning-platform/internal/utils"

	"github.com/gin-gonic/gin"
)

// UserHandler 用户处理器
type UserHandler struct {
	userService *service.UserService
}

// NewUserHandler 创建用户处理器
func NewUserHandler(userService *service.UserService) *UserHandler {
	return &UserHandler{
		userService: userService,
	}
}

// GetByID 获取用户信息
// @Summary 获取用户信息
// @Tags User
// @Produce json
// @Param id path int true "用户ID"
// @Success 200 {object} utils.Response
// @Router /api/v1/users/:id [get]
func (h *UserHandler) GetByID(c *gin.Context) {
	var uri struct {
		ID uint `uri:"id" binding:"required"`
	}
	if err := c.ShouldBindUri(&uri); err != nil {
		utils.ParamError(c, err.Error())
		return
	}

	user, err := h.userService.GetByID(uri.ID)
	if err != nil {
		utils.NotFoundError(c, err.Error())
		return
	}

	utils.Success(c, user)
}

// Update 更新用户信息
// @Summary 更新用户信息
// @Tags User
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path int true "用户ID"
// @Param request body service.UpdateUserRequest true "更新信息"
// @Success 200 {object} utils.Response
// @Router /api/v1/users/:id [put]
func (h *UserHandler) Update(c *gin.Context) {
	var uri struct {
		ID uint `uri:"id" binding:"required"`
	}
	if err := c.ShouldBindUri(&uri); err != nil {
		utils.ParamError(c, err.Error())
		return
	}

	// 检查权限
	userID := middleware.GetUserID(c)
	if userID != uri.ID {
		utils.ForbiddenError(c)
		return
	}

	var req service.UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ParamError(c, err.Error())
		return
	}

	user, err := h.userService.Update(uri.ID, &req)
	if err != nil {
		utils.InternalError(c, err.Error())
		return
	}

	utils.SuccessWithMessage(c, "更新成功", user)
}
