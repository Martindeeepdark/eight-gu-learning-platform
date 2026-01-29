package handler

import (
	"eight-gu-learning-platform/internal/repository"
	"eight-gu-learning-platform/internal/utils"

	"github.com/gin-gonic/gin"
)

// CategoryHandler 分类处理器
type CategoryHandler struct {
	categoryRepo *repository.CategoryRepository
}

// NewCategoryHandler 创建分类处理器
func NewCategoryHandler(categoryRepo *repository.CategoryRepository) *CategoryHandler {
	return &CategoryHandler{
		categoryRepo: categoryRepo,
	}
}

// List 获取分类列表
// @Summary 获取分类列表
// @Tags Category
// @Produce json
// @Success 200 {object} utils.Response
// @Router /api/v1/categories [get]
func (h *CategoryHandler) List(c *gin.Context) {
	categories, err := h.categoryRepo.List()
	if err != nil {
		utils.InternalError(c, err.Error())
		return
	}

	utils.Success(c, categories)
}

// GetByID 获取分类详情
// @Summary 获取分类详情
// @Tags Category
// @Produce json
// @Param id path int true "分类ID"
// @Success 200 {object} utils.Response
// @Router /api/v1/categories/:id [get]
func (h *CategoryHandler) GetByID(c *gin.Context) {
	var uri struct {
		ID uint `uri:"id" binding:"required"`
	}
	if err := c.ShouldBindUri(&uri); err != nil {
		utils.ParamError(c, err.Error())
		return
	}

	category, err := h.categoryRepo.GetByID(uri.ID)
	if err != nil {
		utils.NotFoundError(c, err.Error())
		return
	}

	utils.Success(c, category)
}
