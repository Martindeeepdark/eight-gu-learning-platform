package repository

import (
	"eight-gu-learning-platform/internal/models"
	"eight-gu-learning-platform/internal/utils"

	"gorm.io/gorm"
)

// ExerciseRepository 练习题仓库
type ExerciseRepository struct {
	db *gorm.DB
}

// NewExerciseRepository 创建练习题仓库
func NewExerciseRepository(db *gorm.DB) *ExerciseRepository {
	return &ExerciseRepository{db: db}
}

// Create 创建练习题
func (r *ExerciseRepository) Create(exercise *models.Exercise) error {
	return r.db.Create(exercise).Error
}

// GetByID 根据 ID 获取练习题
func (r *ExerciseRepository) GetByID(id uint) (*models.Exercise, error) {
	var exercise models.Exercise
	err := r.db.First(&exercise, id).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, utils.ErrExerciseNotFound
		}
		return nil, err
	}
	return &exercise, nil
}

// List 获取练习题列表
func (r *ExerciseRepository) List(offset, limit int, knowledgeID uint, difficulty string) ([]models.Exercise, int64, error) {
	var exercises []models.Exercise
	var total int64

	query := r.db.Model(&models.Exercise{})

	// 筛选条件
	if knowledgeID > 0 {
		query = query.Where("knowledge_point_id = ?", knowledgeID)
	}
	if difficulty != "" {
		query = query.Where("difficulty = ?", difficulty)
	}

	// 统计总数
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// 分页查询
	err := query.Order("id DESC").
		Offset(offset).
		Limit(limit).
		Find(&exercises).Error

	return exercises, total, err
}

// Update 更新练习题
func (r *ExerciseRepository) Update(exercise *models.Exercise) error {
	return r.db.Save(exercise).Error
}

// Delete 删除练习题
func (r *ExerciseRepository) Delete(id uint) error {
	return r.db.Delete(&models.Exercise{}, id).Error
}
