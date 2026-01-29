package service

import (
	"eight-gu-learning-platform/internal/models"
	"eight-gu-learning-platform/internal/repository"
)

// KnowledgeService 知识点服务
type KnowledgeService struct {
	knowledgeRepo *repository.KnowledgeRepository
	categoryRepo  *repository.CategoryRepository
	relationRepo  *repository.RelationRepository
}

// NewKnowledgeService 创建知识点服务
func NewKnowledgeService(
	knowledgeRepo *repository.KnowledgeRepository,
	categoryRepo *repository.CategoryRepository,
	relationRepo *repository.RelationRepository,
) *KnowledgeService {
	return &KnowledgeService{
		knowledgeRepo: knowledgeRepo,
		categoryRepo:  categoryRepo,
		relationRepo:  relationRepo,
	}
}

// ListRequest 列表请求
type ListRequest struct {
	Page        int    `form:"page" binding:"min=1"`
	PageSize    int    `form:"page_size" binding:"min=1,max=100"`
	CategoryID  uint   `form:"category_id"`
	Difficulty  string `form:"difficulty"`
	Frequency   string `form:"frequency"`
	Search      string `form:"search"`
}

// GraphNode 图谱节点
type GraphNode struct {
	ID   string                 `json:"id"`
	Label string                 `json:"label"`
	Data map[string]interface{} `json:"data"`
}

// GraphEdge 图谱边
type GraphEdge struct {
	ID    string `json:"id"`
	Source string `json:"source"`
	Target string `json:"target"`
	Label  string `json:"label"`
	Type   string `json:"type"`
}

// GraphData 图谱数据
type GraphData struct {
	Nodes []GraphNode `json:"nodes"`
	Edges []GraphEdge `json:"edges"`
}

// List 获取知识点列表
func (s *KnowledgeService) List(req *ListRequest) ([]models.KnowledgePoint, int64, error) {
	offset := (req.Page - 1) * req.PageSize
	return s.knowledgeRepo.List(offset, req.PageSize, req.CategoryID, req.Difficulty, req.Frequency, req.Search)
}

// GetByID 根据 ID 获取知识点详情
func (s *KnowledgeService) GetByID(id uint) (*models.KnowledgePoint, error) {
	return s.knowledgeRepo.GetByID(id)
}

// GetGraph 获取知识图谱数据
func (s *KnowledgeService) GetGraph(categoryID uint) (*GraphData, error) {
	knowledges, relations, err := s.knowledgeRepo.GetGraphData(categoryID)
	if err != nil {
		return nil, err
	}

	// 构建节点
	nodes := make([]GraphNode, 0, len(knowledges))
	for _, k := range knowledges {
		nodes = append(nodes, GraphNode{
			ID:   string(rune(k.ID)),
			Label: k.Title,
			Data: map[string]interface{}{
				"id":         k.ID,
				"title":      k.Title,
				"difficulty": k.Difficulty,
			},
		})
	}

	// 构建边
	edges := make([]GraphEdge, 0, len(relations))
	for _, r := range relations {
		var label string
		switch r.RelationType {
		case "prerequisite":
			label = "前置"
		case "related":
			label = "相关"
		case "extended":
			label = "扩展"
		}

		edges = append(edges, GraphEdge{
			ID:    string(rune(r.ID)),
			Source: string(rune(r.FromPointID)),
			Target: string(rune(r.ToPointID)),
			Label:  label,
			Type:   r.RelationType,
		})
	}

	return &GraphData{
		Nodes: nodes,
		Edges: edges,
	}, nil
}
