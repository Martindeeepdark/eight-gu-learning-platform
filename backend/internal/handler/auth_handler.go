package handler

import (
	"eight-gu-learning-platform/internal/middleware"
	"eight-gu-learning-platform/internal/service"
	"eight-gu-learning-platform/internal/utils"

	"github.com/gin-gonic/gin"
)

// AuthHandler 认证处理器
type AuthHandler struct {
	authService *service.AuthService
}

// NewAuthHandler 创建认证处理器
func NewAuthHandler(authService *service.AuthService) *AuthHandler {
	return &AuthHandler{
		authService: authService,
	}
}

// Register 用户注册
// @Summary 用户注册
// @Tags Auth
// @Accept json
// @Produce json
// @Param request body service.RegisterRequest true "注册信息"
// @Success 200 {object} utils.Response
// @Router /api/v1/auth/register [post]
func (h *AuthHandler) Register(c *gin.Context) {
	var req service.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ParamError(c, err.Error())
		return
	}

	result, err := h.authService.Register(&req)
	if err != nil {
		utils.Error(c, utils.CodeErrorConflict, err.Error())
		return
	}

	utils.SuccessWithMessage(c, "注册成功", result)
}

// Login 用户登录
// @Summary 用户登录
// @Tags Auth
// @Accept json
// @Produce json
// @Param request body service.LoginRequest true "登录信息"
// @Success 200 {object} utils.Response
// @Router /api/v1/auth/login [post]
func (h *AuthHandler) Login(c *gin.Context) {
	var req service.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ParamError(c, err.Error())
		return
	}

	result, err := h.authService.Login(&req)
	if err != nil {
		utils.Error(c, utils.CodeErrorUnauthorized, err.Error())
		return
	}

	utils.SuccessWithMessage(c, "登录成功", result)
}

// GetMe 获取当前用户信息
// @Summary 获取当前用户信息
// @Tags Auth
// @Produce json
// @Security Bearer
// @Success 200 {object} utils.Response
// @Router /api/v1/auth/me [get]
func (h *AuthHandler) GetMe(c *gin.Context) {
	userID := middleware.GetUserID(c)
	if userID == 0 {
		utils.UnauthorizedError(c)
		return
	}

	user, err := h.authService.GetMe(userID)
	if err != nil {
		utils.NotFoundError(c, err.Error())
		return
	}

	utils.Success(c, user)
}
