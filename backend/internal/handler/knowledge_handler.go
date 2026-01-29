package handler

import (
	"eight-gu-learning-platform/internal/middleware"
	"eight-gu-learning-platform/internal/service"
	"eight-gu-learning-platform/internal/utils"

	"github.com/gin-gonic/gin"
)

// KnowledgeHandler 知识点处理器
type KnowledgeHandler struct {
	knowledgeService *service.KnowledgeService
}

// NewKnowledgeHandler 创建知识点处理器
func NewKnowledgeHandler(knowledgeService *service.KnowledgeService) *KnowledgeHandler {
	return &KnowledgeHandler{
		knowledgeService: knowledgeService,
	}
}

// List 获取知识点列表
// @Summary 获取知识点列表
// @Tags Knowledge
// @Produce json
// @Security Bearer
// @Param page query int false "页码" default(1)
// @Param page_size query int false "每页数量" default(20)
// @Param category_id query int false "分类ID"
// @Param difficulty query string false "难度"
// @Param frequency query string false "频率"
// @Param search query string false "搜索关键词"
// @Success 200 {object} utils.Response
// @Router /api/v1/knowledge [get]
func (h *KnowledgeHandler) List(c *gin.Context) {
	var req service.ListRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		utils.ParamError(c, err.Error())
		return
	}

	// 设置默认值
	if req.Page == 0 {
		req.Page = 1
	}
	if req.PageSize == 0 {
		req.PageSize = 20
	}

	items, total, err := h.knowledgeService.List(&req)
	if err != nil {
		utils.InternalError(c, err.Error())
		return
	}

	utils.PageSuccess(c, int(total), req.Page, req.PageSize, items)
}

// GetByID 获取知识点详情
// @Summary 获取知识点详情
// @Tags Knowledge
// @Produce json
// @Security Bearer
// @Param id path int true "知识点ID"
// @Success 200 {object} utils.Response
// @Router /api/v1/knowledge/:id [get]
func (h *KnowledgeHandler) GetByID(c *gin.Context) {
	var uri struct {
		ID uint `uri:"id" binding:"required"`
	}
	if err := c.ShouldBindUri(&uri); err != nil {
		utils.ParamError(c, err.Error())
		return
	}

	knowledge, err := h.knowledgeService.GetByID(uri.ID)
	if err != nil {
		utils.NotFoundError(c, err.Error())
		return
	}

	utils.Success(c, knowledge)
}

// GetGraph 获取知识图谱数据
// @Summary 获取知识图谱数据
// @Tags Knowledge
// @Produce json
// @Security Bearer
// @Param category_id query int false "分类ID"
// @Success 200 {object} utils.Response
// @Router /api/v1/knowledge/graph [get]
func (h *KnowledgeHandler) GetGraph(c *gin.Context) {
	userID := middleware.GetUserID(c)
	if userID == 0 {
		utils.UnauthorizedError(c)
		return
	}

	var query struct {
		CategoryID uint `form:"category_id"`
	}
	c.ShouldBindQuery(&query)

	graph, err := h.knowledgeService.GetGraph(query.CategoryID)
	if err != nil {
		utils.InternalError(c, err.Error())
		return
	}

	utils.Success(c, graph)
}
