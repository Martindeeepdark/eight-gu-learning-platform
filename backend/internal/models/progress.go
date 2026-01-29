package models

import (
	"time"

	"gorm.io/gorm"
)

// LearningProgress 学习进度模型
type LearningProgress struct {
	ID               uint           `gorm:"primaryKey" json:"id"`
	UserID           uint           `gorm:"not null;index:idx_user_knowledge" json:"user_id"`
	User             User           `gorm:"foreignKey:UserID" json:"user,omitempty"`
	KnowledgePointID uint           `gorm:"not null;index:idx_user_knowledge" json:"knowledge_point_id"`
	KnowledgePoint   KnowledgePoint `gorm:"foreignKey:KnowledgePointID" json:"knowledge_point,omitempty"`
	Status           string         `gorm:"type:varchar(20);default:'not_started';check:status IN ('not_started','in_progress','completed')" json:"status"`
	MasteryLevel     int            `gorm:"check:mastery_level >= 0 AND mastery_level <= 100;default:0" json:"mastery_level"`
	LastReviewedAt   *time.Time     `json:"last_reviewed_at"`
	CreatedAt        time.Time      `json:"created_at"`
	UpdatedAt        time.Time      `json:"updated_at"`
	DeletedAt        gorm.DeletedAt `gorm:"index" json:"-"`
}

// TableName 指定表名
func (LearningProgress) TableName() string {
	return "learning_progress"
}
