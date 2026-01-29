package models

import (
	"time"

	"gorm.io/gorm"
)

// Exercise 练习题模型
type Exercise struct {
	ID              uint           `gorm:"primaryKey" json:"id"`
	KnowledgePointID uint           `gorm:"not null;index" json:"knowledge_point_id"`
	Question        string         `gorm:"type:text;not null" json:"question"`
	Options         string         `gorm:"type:jsonb;not null" json:"options"` // JSON array
	Answer          string         `gorm:"type:jsonb;not null" json:"answer"` // JSON array
	Type            string         `gorm:"type:varchar(20);check:type IN ('single_choice','multiple_choice')" json:"type"`
	Explanation     string         `gorm:"type:text" json:"explanation"`
	Difficulty      string         `gorm:"type:varchar(20);check:difficulty IN ('easy','medium','hard')" json:"difficulty"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"-"`
}

// TableName 指定表名
func (Exercise) TableName() string {
	return "exercises"
}

// ExerciseRecord 练习记录模型
type ExerciseRecord struct {
	ID         uint           `gorm:"primaryKey" json:"id"`
	UserID     uint           `gorm:"not null;index" json:"user_id"`
	User       User           `gorm:"foreignKey:UserID" json:"user,omitempty"`
	ExerciseID uint           `gorm:"not null;index" json:"exercise_id"`
	Exercise   Exercise       `gorm:"foreignKey:ExerciseID" json:"exercise,omitempty"`
	UserAnswer string         `gorm:"type:jsonb" json:"user_answer"` // JSON array
	IsCorrect  bool           `json:"is_correct"`
	CreatedAt  time.Time      `json:"created_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
}

// TableName 指定表名
func (ExerciseRecord) TableName() string {
	return "exercise_records"
}
