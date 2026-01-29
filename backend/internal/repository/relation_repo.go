package repository

import (
	"eight-gu-learning-platform/internal/models"
	"eight-gu-learning-platform/internal/utils"

	"gorm.io/gorm"
)

// RelationRepository 知识关联仓库
type RelationRepository struct {
	db *gorm.DB
}

// NewRelationRepository 创建知识关联仓库
func NewRelationRepository(db *gorm.DB) *RelationRepository {
	return &RelationRepository{db: db}
}

// Create 创建知识关联
func (r *RelationRepository) Create(relation *models.KnowledgeRelation) error {
	return r.db.Create(relation).Error
}

// GetByID 根据 ID 获取知识关联
func (r *RelationRepository) GetByID(id uint) (*models.KnowledgeRelation, error) {
	var relation models.KnowledgeRelation
	err := r.db.First(&relation, id).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, utils.ErrKnowledgeNotFound
		}
		return nil, err
	}
	return &relation, nil
}

// List 获取知识关联列表
func (r *RelationRepository) List(fromPointID, toPointID uint, relationType string) ([]models.KnowledgeRelation, error) {
	var relations []models.KnowledgeRelation

	query := r.db.Model(&models.KnowledgeRelation{})

	// 筛选条件
	if fromPointID > 0 {
		query = query.Where("from_point_id = ?", fromPointID)
	}
	if toPointID > 0 {
		query = query.Where("to_point_id = ?", toPointID)
	}
	if relationType != "" {
		query = query.Where("relation_type = ?", relationType)
	}

	err := query.Order("id DESC").Find(&relations).Error
	return relations, err
}

// Delete 删除知识关联
func (r *RelationRepository) Delete(id uint) error {
	return r.db.Delete(&models.KnowledgeRelation{}, id).Error
}
