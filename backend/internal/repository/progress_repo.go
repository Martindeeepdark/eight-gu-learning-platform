package repository

import (
	"eight-gu-learning-platform/internal/models"
	"eight-gu-learning-platform/internal/utils"

	"gorm.io/gorm"
)

// ProgressRepository 学习进度仓库
type ProgressRepository struct {
	db *gorm.DB
}

// NewProgressRepository 创建学习进度仓库
func NewProgressRepository(db *gorm.DB) *ProgressRepository {
	return &ProgressRepository{db: db}
}

// Create 创建学习进度
func (r *ProgressRepository) Create(progress *models.LearningProgress) error {
	return r.db.Create(progress).Error
}

// GetByID 根据 ID 获取学习进度
func (r *ProgressRepository) GetByID(id uint) (*models.LearningProgress, error) {
	var progress models.LearningProgress
	err := r.db.Preload("KnowledgePoint.Category").First(&progress, id).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, utils.ErrProgressNotFound
		}
		return nil, err
	}
	return &progress, nil
}

// GetByUserAndKnowledge 获取用户对某个知识点的进度
func (r *ProgressRepository) GetByUserAndKnowledge(userID, knowledgePointID uint) (*models.LearningProgress, error) {
	var progress models.LearningProgress
	err := r.db.Where("user_id = ? AND knowledge_point_id = ?", userID, knowledgePointID).
		First(&progress).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, utils.ErrProgressNotFound
		}
		return nil, err
	}
	return &progress, nil
}

// GetByUser 获取用户所有学习进度
func (r *ProgressRepository) GetByUser(userID uint, knowledgeID uint, categoryID uint) ([]models.LearningProgress, error) {
	var progresses []models.LearningProgress

	query := r.db.Where("user_id = ?", userID)

	if knowledgeID > 0 {
		query = query.Where("knowledge_point_id = ?", knowledgeID)
	}
	if categoryID > 0 {
		query = query.Joins("JOIN knowledge_points ON knowledge_points.id = learning_progress.knowledge_point_id").
			Where("knowledge_points.category_id = ?", categoryID)
	}

	err := query.Preload("KnowledgePoint.Category").
		Preload("KnowledgePoint").
		Find(&progresses).Error

	return progresses, err
}

// Update 更新学习进度
func (r *ProgressRepository) Update(progress *models.LearningProgress) error {
	return r.db.Save(progress).Error
}

// Delete 删除学习进度
func (r *ProgressRepository) Delete(id uint) error {
	return r.db.Delete(&models.LearningProgress{}, id).Error
}

// GetStats 获取用户学习统计
func (r *ProgressRepository) GetStats(userID uint) (map[string]interface{}, error) {
	var stats struct {
		Total       int64 `json:"total"`
		Completed   int64 `json:"completed"`
		InProgress  int64 `json:"in_progress"`
		NotStarted  int64 `json:"not_started"`
		MasteryAvg  float64 `json:"mastery_avg"`
	}

	// 总数
	r.db.Model(&models.LearningProgress{}).Where("user_id = ?", userID).Count(&stats.Total)

	// 各状态数量
	r.db.Model(&models.LearningProgress{}).
		Where("user_id = ? AND status = ?", userID, "completed").
		Count(&stats.Completed)
	r.db.Model(&models.LearningProgress{}).
		Where("user_id = ? AND status = ?", userID, "in_progress").
		Count(&stats.InProgress)
	r.db.Model(&models.LearningProgress{}).
		Where("user_id = ? AND status = ?", userID, "not_started").
		Count(&stats.NotStarted)

	// 平均掌握度
	r.db.Model(&models.LearningProgress{}).
		Where("user_id = ?", userID).
		Select("AVG(mastery_level)").
		Scan(&stats.MasteryAvg)

	return map[string]interface{}{
		"total":        stats.Total,
		"completed":    stats.Completed,
		"in_progress":  stats.InProgress,
		"not_started":  stats.NotStarted,
		"mastery_avg":  stats.MasteryAvg,
	}, nil
}
