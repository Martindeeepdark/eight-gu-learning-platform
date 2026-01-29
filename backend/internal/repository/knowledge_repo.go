package repository

import (
	"eight-gu-learning-platform/internal/models"
	"eight-gu-learning-platform/internal/utils"

	"gorm.io/gorm"
)

// KnowledgeRepository 知识点仓库
type KnowledgeRepository struct {
	db *gorm.DB
}

// NewKnowledgeRepository 创建知识点仓库
func NewKnowledgeRepository(db *gorm.DB) *KnowledgeRepository {
	return &KnowledgeRepository{db: db}
}

// Create 创建知识点
func (r *KnowledgeRepository) Create(knowledge *models.KnowledgePoint) error {
	return r.db.Create(knowledge).Error
}

// GetByID 根据 ID 获取知识点
func (r *KnowledgeRepository) GetByID(id uint) (*models.KnowledgePoint, error) {
	var knowledge models.KnowledgePoint
	err := r.db.Preload("Category").First(&knowledge, id).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, utils.ErrKnowledgeNotFound
		}
		return nil, err
	}
	return &knowledge, nil
}

// List 获取知识点列表
func (r *KnowledgeRepository) List(offset, limit int, categoryID uint, difficulty, frequency, search string) ([]models.KnowledgePoint, int64, error) {
	var knowledges []models.KnowledgePoint
	var total int64

	query := r.db.Model(&models.KnowledgePoint{})

	// 筛选条件
	if categoryID > 0 {
		query = query.Where("category_id = ?", categoryID)
	}
	if difficulty != "" {
		query = query.Where("difficulty = ?", difficulty)
	}
	if frequency != "" {
		query = query.Where("frequency = ?", frequency)
	}
	if search != "" {
		query = query.Where("title LIKE ? OR description LIKE ?", "%"+search+"%", "%"+search+"%")
	}

	// 统计总数
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// 分页查询
	err := query.Preload("Category").
		Order("id DESC").
		Offset(offset).
		Limit(limit).
		Find(&knowledges).Error

	return knowledges, total, err
}

// Update 更新知识点
func (r *KnowledgeRepository) Update(knowledge *models.KnowledgePoint) error {
	return r.db.Save(knowledge).Error
}

// Delete 删除知识点
func (r *KnowledgeRepository) Delete(id uint) error {
	return r.db.Delete(&models.KnowledgePoint{}, id).Error
}

// GetGraphData 获取知识图谱数据
func (r *KnowledgeRepository) GetGraphData(categoryID uint) ([]models.KnowledgePoint, []models.KnowledgeRelation, error) {
	var knowledges []models.KnowledgePoint
	var relations []models.KnowledgeRelation

	query := r.db.Model(&models.KnowledgePoint{})
	if categoryID > 0 {
		query = query.Where("category_id = ?", categoryID)
	}

	if err := query.Preload("Category").Find(&knowledges).Error; err != nil {
		return nil, nil, err
	}

	// 获取关联关系
	if err := r.db.Find(&relations).Error; err != nil {
		return nil, nil, err
	}

	return knowledges, relations, nil
}
