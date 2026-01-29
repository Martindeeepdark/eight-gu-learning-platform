package service

import (
	"encoding/json"

	"eight-gu-learning-platform/internal/models"
	"eight-gu-learning-platform/internal/repository"
)

// ExerciseService 练习题服务
type ExerciseService struct {
	exerciseRepo *repository.ExerciseRepository
	recordRepo   *repository.RecordRepository
}

// NewExerciseService 创建练习题服务
func NewExerciseService(
	exerciseRepo *repository.ExerciseRepository,
	recordRepo *repository.RecordRepository,
) *ExerciseService {
	return &ExerciseService{
		exerciseRepo: exerciseRepo,
		recordRepo:   recordRepo,
	}
}

// ListRequest 列表请求
type ExerciseListRequest struct {
	Page         int    `form:"page" binding:"min=1"`
	PageSize     int    `form:"page_size" binding:"min=1,max=100"`
	KnowledgeID  uint   `form:"knowledge_id"`
	Difficulty   string `form:"difficulty"`
}

// SubmitAnswerRequest 提交答案请求
type SubmitAnswerRequest struct {
	Answer []string `json:"answer" binding:"required"`
}

// SubmitAnswerResponse 提交答案响应
type SubmitAnswerResponse struct {
	IsCorrect    bool   `json:"is_correct"`
	CorrectAnswer string `json:"correct_answer"`
	Explanation  string `json:"explanation"`
	RecordID     uint   `json:"record_id"`
}

// WrongExercise 错题
type WrongExercise struct {
	ID           uint   `json:"id"`
	Question     string `json:"question"`
	UserAnswer   string `json:"user_answer"`
	CorrectAnswer string `json:"correct_answer"`
	Explanation  string `json:"explanation"`
	WrongCount   int    `json:"wrong_count"`
}

// List 获取练习题列表
func (s *ExerciseService) List(req *ExerciseListRequest) ([]models.Exercise, int64, error) {
	offset := (req.Page - 1) * req.PageSize
	return s.exerciseRepo.List(offset, req.PageSize, req.KnowledgeID, req.Difficulty)
}

// GetByID 根据 ID 获取练习题详情
func (s *ExerciseService) GetByID(id uint) (*models.Exercise, error) {
	return s.exerciseRepo.GetByID(id)
}

// SubmitAnswer 提交答案
func (s *ExerciseService) SubmitAnswer(userID, exerciseID uint, req *SubmitAnswerRequest) (*SubmitAnswerResponse, error) {
	// 获取练习题
	exercise, err := s.exerciseRepo.GetByID(exerciseID)
	if err != nil {
		return nil, err
	}

	// 解析正确答案
	var correctAnswer []string
	if err := json.Unmarshal([]byte(exercise.Answer), &correctAnswer); err != nil {
		return nil, err
	}

	// 比较答案
	isCorrect := compareAnswers(req.Answer, correctAnswer)

	// 序列化用户答案
	userAnswerJSON, _ := json.Marshal(req.Answer)

	// 创建练习记录
	record := &models.ExerciseRecord{
		UserID:     userID,
		ExerciseID: exerciseID,
		UserAnswer: string(userAnswerJSON),
		IsCorrect:  isCorrect,
	}

	if err := s.recordRepo.Create(record); err != nil {
		return nil, err
	}

	return &SubmitAnswerResponse{
		IsCorrect:    isCorrect,
		CorrectAnswer: exercise.Answer,
		Explanation:  exercise.Explanation,
		RecordID:     record.ID,
	}, nil
}

// compareAnswers 比较答案
func compareAnswers(userAnswer, correctAnswer []string) bool {
	if len(userAnswer) != len(correctAnswer) {
		return false
	}

	for i, a := range userAnswer {
		if a != correctAnswer[i] {
			return false
		}
	}

	return true
}

// GetWrongList 获取错题列表
func (s *ExerciseService) GetWrongList(userID uint, page, pageSize int) ([]WrongExercise, int64, error) {
	offset := (page - 1) * pageSize
	records, total, err := s.recordRepo.GetWrongList(userID, offset, pageSize)
	if err != nil {
		return nil, 0, err
	}

	wrongExercises := make([]WrongExercise, 0, len(records))
	for _, r := range records {
		wrongExercises = append(wrongExercises, WrongExercise{
			ID:           r.ID,
			Question:     r.Exercise.Question,
			UserAnswer:   r.UserAnswer,
			CorrectAnswer: r.Exercise.Answer,
			Explanation:  r.Exercise.Explanation,
			WrongCount:   1, // TODO: 统计错误次数
		})
	}

	return wrongExercises, total, nil
}
