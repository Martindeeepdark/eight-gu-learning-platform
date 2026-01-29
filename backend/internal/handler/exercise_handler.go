package handler

import (
	"eight-gu-learning-platform/internal/middleware"
	"eight-gu-learning-platform/internal/service"
	"eight-gu-learning-platform/internal/utils"

	"github.com/gin-gonic/gin"
)

// ExerciseHandler 练习题处理器
type ExerciseHandler struct {
	exerciseService *service.ExerciseService
}

// NewExerciseHandler 创建练习题处理器
func NewExerciseHandler(exerciseService *service.ExerciseService) *ExerciseHandler {
	return &ExerciseHandler{
		exerciseService: exerciseService,
	}
}

// List 获取练习题列表
// @Summary 获取练习题列表
// @Tags Exercise
// @Produce json
// @Security Bearer
// @Param page query int false "页码" default(1)
// @Param page_size query int false "每页数量" default(10)
// @Param knowledge_id query int false "知识点ID"
// @Param difficulty query string false "难度"
// @Success 200 {object} utils.Response
// @Router /api/v1/exercises [get]
func (h *ExerciseHandler) List(c *gin.Context) {
	var req service.ExerciseListRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		utils.ParamError(c, err.Error())
		return
	}

	// 设置默认值
	if req.Page == 0 {
		req.Page = 1
	}
	if req.PageSize == 0 {
		req.PageSize = 10
	}

	items, total, err := h.exerciseService.List(&req)
	if err != nil {
		utils.InternalError(c, err.Error())
		return
	}

	utils.PageSuccess(c, int(total), req.Page, req.PageSize, items)
}

// GetByID 获取练习题详情
// @Summary 获取练习题详情
// @Tags Exercise
// @Produce json
// @Security Bearer
// @Param id path int true "练习题ID"
// @Success 200 {object} utils.Response
// @Router /api/v1/exercises/:id [get]
func (h *ExerciseHandler) GetByID(c *gin.Context) {
	var uri struct {
		ID uint `uri:"id" binding:"required"`
	}
	if err := c.ShouldBindUri(&uri); err != nil {
		utils.ParamError(c, err.Error())
		return
	}

	exercise, err := h.exerciseService.GetByID(uri.ID)
	if err != nil {
		utils.NotFoundError(c, err.Error())
		return
	}

	utils.Success(c, exercise)
}

// SubmitAnswer 提交答案
// @Summary 提交答案
// @Tags Exercise
// @Accept json
// @Produce json
// @Security Bearer
// @Param id path int true "练习题ID"
// @Param request body service.SubmitAnswerRequest true "答案"
// @Success 200 {object} utils.Response
// @Router /api/v1/exercises/:id/submit [post]
func (h *ExerciseHandler) SubmitAnswer(c *gin.Context) {
	var uri struct {
		ID uint `uri:"id" binding:"required"`
	}
	if err := c.ShouldBindUri(&uri); err != nil {
		utils.ParamError(c, err.Error())
		return
	}

	userID := middleware.GetUserID(c)
	if userID == 0 {
		utils.UnauthorizedError(c)
		return
	}

	var req service.SubmitAnswerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ParamError(c, err.Error())
		return
	}

	result, err := h.exerciseService.SubmitAnswer(userID, uri.ID, &req)
	if err != nil {
		utils.InternalError(c, err.Error())
		return
	}

	utils.SuccessWithMessage(c, "提交成功", result)
}

// GetWrongList 获取错题列表
// @Summary 获取错题列表
// @Tags Exercise
// @Produce json
// @Security Bearer
// @Param page query int false "页码" default(1)
// @Param page_size query int false "每页数量" default(10)
// @Success 200 {object} utils.Response
// @Router /api/v1/exercises/wrong [get]
func (h *ExerciseHandler) GetWrongList(c *gin.Context) {
	var query struct {
		Page     int `form:"page" binding:"min=1"`
		PageSize int `form:"page_size" binding:"min=1,max=100"`
	}
	if err := c.ShouldBindQuery(&query); err != nil {
		utils.ParamError(c, err.Error())
		return
	}

	// 设置默认值
	if query.Page == 0 {
		query.Page = 1
	}
	if query.PageSize == 0 {
		query.PageSize = 10
	}

	userID := middleware.GetUserID(c)
	if userID == 0 {
		utils.UnauthorizedError(c)
		return
	}

	items, total, err := h.exerciseService.GetWrongList(userID, query.Page, query.PageSize)
	if err != nil {
		utils.InternalError(c, err.Error())
		return
	}

	utils.PageSuccess(c, int(total), query.Page, query.PageSize, items)
}
