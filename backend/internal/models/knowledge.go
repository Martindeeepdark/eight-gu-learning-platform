package models

import (
	"time"

	"gorm.io/gorm"
)

// KnowledgePoint 知识点模型
type KnowledgePoint struct {
	ID            uint           `gorm:"primaryKey" json:"id"`
	Title         string         `gorm:"type:varchar(255);not null" json:"title"`
	Description   string         `gorm:"type:text" json:"description"`
	Content       string         `gorm:"type:text" json:"content"`
	CategoryID    uint           `gorm:"not null;index" json:"category_id"`
	Category      Category       `gorm:"foreignKey:CategoryID" json:"category"`
	Difficulty    string         `gorm:"type:varchar(20);check:difficulty IN ('easy','medium','hard')" json:"difficulty"`
	Frequency     string         `gorm:"type:varchar(20);check:frequency IN ('high','medium','low')" json:"frequency"`
	CodeExample   string         `gorm:"type:text" json:"code_example"`
	References    string         `gorm:"type:text" json:"references"` // JSON array stored as text
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
}

// TableName 指定表名
func (KnowledgePoint) TableName() string {
	return "knowledge_points"
}

// KnowledgeRelation 知识关联模型
type KnowledgeRelation struct {
	ID           uint           `gorm:"primaryKey" json:"id"`
	FromPointID  uint           `gorm:"not null;index" json:"from_point_id"`
	ToPointID    uint           `gorm:"not null;index" json:"to_point_id"`
	RelationType string         `gorm:"type:varchar(50);not null" json:"relation_type"` // prerequisite, related, extended
	CreatedAt    time.Time      `json:"created_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}

// TableName 指定表名
func (KnowledgeRelation) TableName() string {
	return "knowledge_relations"
}
