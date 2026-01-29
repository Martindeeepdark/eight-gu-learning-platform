package repository

import (
	"eight-gu-learning-platform/internal/models"
	"eight-gu-learning-platform/internal/utils"

	"gorm.io/gorm"
)

// RecordRepository 练习记录仓库
type RecordRepository struct {
	db *gorm.DB
}

// NewRecordRepository 创建练习记录仓库
func NewRecordRepository(db *gorm.DB) *RecordRepository {
	return &RecordRepository{db: db}
}

// Create 创建练习记录
func (r *RecordRepository) Create(record *models.ExerciseRecord) error {
	return r.db.Create(record).Error
}

// GetByID 根据 ID 获取练习记录
func (r *RecordRepository) GetByID(id uint) (*models.ExerciseRecord, error) {
	var record models.ExerciseRecord
	err := r.db.Preload("User").Preload("Exercise").First(&record, id).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, utils.ErrExerciseNotFound
		}
		return nil, err
	}
	return &record, nil
}

// List 获取练习记录列表
func (r *RecordRepository) List(offset, limit int, userID, exerciseID uint) ([]models.ExerciseRecord, int64, error) {
	var records []models.ExerciseRecord
	var total int64

	query := r.db.Model(&models.ExerciseRecord{})

	// 筛选条件
	if userID > 0 {
		query = query.Where("user_id = ?", userID)
	}
	if exerciseID > 0 {
		query = query.Where("exercise_id = ?", exerciseID)
	}

	// 统计总数
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// 分页查询
	err := query.Preload("User").Preload("Exercise").
		Order("id DESC").
		Offset(offset).
		Limit(limit).
		Find(&records).Error

	return records, total, err
}

// GetWrongList 获取错题列表
func (r *RecordRepository) GetWrongList(userID uint, offset, limit int) ([]models.ExerciseRecord, int64, error) {
	var records []models.ExerciseRecord
	var total int64

	query := r.db.Model(&models.ExerciseRecord{}).
		Where("user_id = ? AND is_correct = ?", userID, false)

	// 统计总数
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// 分页查询
	err := query.Preload("Exercise").
		Order("id DESC").
		Offset(offset).
		Limit(limit).
		Find(&records).Error

	return records, total, err
}

// Delete 删除练习记录
func (r *RecordRepository) Delete(id uint) error {
	return r.db.Delete(&models.ExerciseRecord{}, id).Error
}
