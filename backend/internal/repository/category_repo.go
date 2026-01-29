package repository

import (
	"eight-gu-learning-platform/internal/models"
	"eight-gu-learning-platform/internal/utils"

	"gorm.io/gorm"
)

// CategoryRepository 分类仓库
type CategoryRepository struct {
	db *gorm.DB
}

// NewCategoryRepository 创建分类仓库
func NewCategoryRepository(db *gorm.DB) *CategoryRepository {
	return &CategoryRepository{db: db}
}

// Create 创建分类
func (r *CategoryRepository) Create(category *models.Category) error {
	return r.db.Create(category).Error
}

// GetByID 根据 ID 获取分类
func (r *CategoryRepository) GetByID(id uint) (*models.Category, error) {
	var category models.Category
	err := r.db.First(&category, id).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, utils.ErrCategoryNotFound
		}
		return nil, err
	}
	return &category, nil
}

// List 获取分类列表
func (r *CategoryRepository) List() ([]models.Category, error) {
	var categories []models.Category
	err := r.db.Order("sort_order ASC, id ASC").Find(&categories).Error
	if err != nil {
		return nil, err
	}
	return categories, nil
}

// Update 更新分类
func (r *CategoryRepository) Update(category *models.Category) error {
	return r.db.Save(category).Error
}

// Delete 删除分类
func (r *CategoryRepository) Delete(id uint) error {
	return r.db.Delete(&models.Category{}, id).Error
}

// GetTree 获取分类树
func (r *CategoryRepository) GetTree() ([]models.Category, error) {
	var categories []models.Category
	err := r.db.Order("sort_order ASC, id ASC").Find(&categories).Error
	if err != nil {
		return nil, err
	}
	return categories, nil
}
