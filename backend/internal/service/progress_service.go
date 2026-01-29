package service

import (
	"time"

	"eight-gu-learning-platform/internal/models"
	"eight-gu-learning-platform/internal/repository"
	"eight-gu-learning-platform/internal/utils"
)

// ProgressService 学习进度服务
type ProgressService struct {
	progressRepo *repository.ProgressRepository
}

// NewProgressService 创建学习进度服务
func NewProgressService(progressRepo *repository.ProgressRepository) *ProgressService {
	return &ProgressService{
		progressRepo: progressRepo,
	}
}

// UpdateProgressRequest 更新进度请求
type UpdateProgressRequest struct {
	KnowledgePointID uint   `json:"knowledge_point_id" binding:"required"`
	Status           string `json:"status" binding:"required,oneof=not_started in_progress completed"`
	MasteryLevel     int    `json:"mastery_level" binding:"min=0,max=100"`
}

// GetProgressRequest 获取进度请求
type GetProgressRequest struct {
	UserID       uint `form:"user_id"`
	KnowledgeID  uint `form:"knowledge_id"`
	CategoryID   uint `form:"category_id"`
}

// GetByUser 获取用户学习进度
func (s *ProgressService) GetByUser(req *GetProgressRequest) ([]models.LearningProgress, error) {
	return s.progressRepo.GetByUser(req.UserID, req.KnowledgeID, req.CategoryID)
}

// Update 更新学习进度
func (s *ProgressService) Update(userID uint, req *UpdateProgressRequest) (*models.LearningProgress, error) {
	// 检查是否已存在进度
	progress, err := s.progressRepo.GetByUserAndKnowledge(userID, req.KnowledgePointID)
	if err == utils.ErrProgressNotFound {
		// 创建新进度
		now := time.Now()
		progress = &models.LearningProgress{
			UserID:           userID,
			KnowledgePointID: req.KnowledgePointID,
			Status:           req.Status,
			MasteryLevel:     req.MasteryLevel,
			LastReviewedAt:   &now,
		}
		if err := s.progressRepo.Create(progress); err != nil {
			return nil, err
		}
		return progress, nil
	}

	if err != nil {
		return nil, err
	}

	// 更新现有进度
	progress.Status = req.Status
	progress.MasteryLevel = req.MasteryLevel
	now := time.Now()
	progress.LastReviewedAt = &now

	if err := s.progressRepo.Update(progress); err != nil {
		return nil, err
	}

	return progress, nil
}

// GetStats 获取学习统计
func (s *ProgressService) GetStats(userID uint) (map[string]interface{}, error) {
	return s.progressRepo.GetStats(userID)
}
