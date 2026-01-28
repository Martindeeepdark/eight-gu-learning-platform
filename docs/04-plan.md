# Plan - 技术规划

## 1. 系统架构设计

### 1.1 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                         客户端层                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  浏览器端     │  │   移动端      │  │  (未来扩展)   │      │
│  │ React + TS   │  │ 响应式设计     │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS
┌───────────────────────────▼─────────────────────────────────┐
│                        API 网关层                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Gin Web Server                          │   │
│  │  - 路由分发  - 中间件  - 请求验证  - 响应封装          │   │
│  └─────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼───────┐  ┌────────▼────────┐  ┌───────▼─────────┐
│ 业务逻辑层     │  │   缓存层          │  │   数据库层       │
│ Services      │  │   Redis          │  │   PostgreSQL    │
│               │  │                  │  │                 │
│ - AuthService │  │ - Session 缓存    │  │ - Users         │
│ - UserService │  │ - 知识点缓存      │  │ - Knowledge     │
│ - KnowledgeSvc│  │ - 进度缓存        │  │ - Progress      │
│ - ProgressSvc │  │                  │  │ - Exercises     │
│ - ExerciseSvc │  └──────────────────┘  │                 │
└───────┬───────┘                       └─────────────────┘
        │
┌───────▼────────┐
│ 数据访问层     │
│ DAO/Repository │
│                │
│ - GORM Models  │
│ - Queries      │
└────────────────┘
```

### 1.2 后端分层架构

```
backend/
├── cmd/
│   └── server/
│       └── main.go              # 应用入口
├── internal/
│   ├── config/                   # 配置管理
│   │   └── config.go
│   ├── models/                   # 数据模型
│   │   ├── user.go
│   │   ├── knowledge.go
│   │   ├── progress.go
│   │   ├── exercise.go
│   │   └── relation.go
│   ├── repository/               # 数据访问层
│   │   ├── user_repo.go
│   │   ├── knowledge_repo.go
│   │   ├── progress_repo.go
│   │   ├── exercise_repo.go
│   │   └── relation_repo.go
│   ├── service/                  # 业务逻辑层
│   │   ├── auth_service.go
│   │   ├── user_service.go
│   │   ├── knowledge_service.go
│   │   ├── progress_service.go
│   │   └── exercise_service.go
│   ├── handler/                  # HTTP 处理器
│   │   ├── auth_handler.go
│   │   ├── user_handler.go
│   │   ├── knowledge_handler.go
│   │   ├── progress_handler.go
│   │   └── exercise_handler.go
│   ├── middleware/               # 中间件
│   │   ├── auth.go
│   │   ├── cors.go
│   │   ├── logger.go
│   │   └── recovery.go
│   └── utils/                    # 工具函数
│       ├── jwt.go
│       ├── password.go
│       └── response.go
├── migrations/                   # 数据库迁移
│   ├── 001_init_schema.up.sql
│   ├── 001_init_schema.down.sql
│   └── seed_data.sql
├── configs/                      # 配置文件
│   ├── config.yaml
│   └── config.dev.yaml
├── Dockerfile
└── go.mod
```

### 1.3 前端架构

```
frontend/
├── src/
│   ├── components/               # 公共组件
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Layout.tsx
│   │   ├── knowledge/
│   │   │   ├── KnowledgeCard.tsx
│   │   │   └── KnowledgeGraph.tsx
│   │   ├── learning/
│   │   │   └── ProgressChart.tsx
│   │   └── ui/
│   │       └── MarkdownRenderer.tsx
│   ├── pages/                    # 页面组件
│   │   ├── Home/
│   │   │   └── index.tsx
│   │   ├── Login/
│   │   │   └── index.tsx
│   │   ├── Register/
│   │   │   └── index.tsx
│   │   ├── Knowledge/
│   │   │   ├── List.tsx
│   │   │   └── Detail.tsx
│   │   ├── Learning/
│   │   │   ├── Dashboard.tsx
│   │   │   └── Graph.tsx
│   │   ├── Exercise/
│   │   │   ├── List.tsx
│   │   │   └── Practice.tsx
│   │   └── Profile/
│   │       └── index.tsx
│   ├── router/                   # 路由配置
│   │   └── index.tsx
│   ├── services/                 # API 服务
│   │   ├── api.ts                # Axios 配置
│   │   ├── auth.ts
│   │   ├── knowledge.ts
│   │   ├── progress.ts
│   │   └── exercise.ts
│   ├── store/                    # 状态管理
│   │   ├── auth.ts
│   │   ├── knowledge.ts
│   │   └── index.ts
│   ├── types/                    # TypeScript 类型
│   │   ├── user.ts
│   │   ├── knowledge.ts
│   │   ├── progress.ts
│   │   └── exercise.ts
│   ├── hooks/                    # 自定义 Hooks
│   │   ├── useAuth.ts
│   │   ├── useKnowledge.ts
│   │   └── useProgress.ts
│   ├── utils/                    # 工具函数
│   │   ├── request.ts
│   │   └── format.ts
│   ├── App.tsx                   # 根组件
│   └── main.tsx                  # 入口文件
├── public/
├── vite.config.ts
├── tsconfig.json
├── package.json
└── Dockerfile
```

## 2. 数据模型设计

### 2.1 ER 图

```
┌─────────────┐         ┌──────────────────┐
│   users     │         │   categories     │
├─────────────┤         ├──────────────────┤
│ id (PK)     │         │ id (PK)          │
│ email       │         │ name             │
│ password    │         │ description      │
│ username    │         │ parent_id (FK)   │
│ avatar      │         └──────────────────┘
│ created_at  │                  │
│ updated_at  │                  │
└──────┬──────┘                  │
       │                         │
       │                         │
       │         ┌───────────────▼───────────────┐
       │         │    knowledge_points           │
       │         ├───────────────────────────────┤
       │         │ id (PK)                      │
       │         │ title                        │
       │         │ description                  │
       │         │ content                      │
       │         │ category_id (FK)             │
       │         │ difficulty                   │
       │         │ frequency                    │
       │         │ code_example                 │
       │         │ references                   │
       │         │ created_at                   │
       │         │ updated_at                   │
       │         └───────┬───────────────────────┘
       │                 │
       │                 │
       │         ┌───────┴──────────────┐
       │         │ knowledge_relations  │
       │         ├──────────────────────┤
       │         │ id (PK)              │
       │         │ from_point_id (FK)   │
       │         │ to_point_id (FK)     │
       │         │ relation_type        │
       │         │ created_at           │
       │         └──────────────────────┘
       │
       │
       │         ┌──────────────────────┐
       │         │ learning_progress    │
       │         ├──────────────────────┤
       │         │ id (PK)              │
       │         │ user_id (FK)         │
       │         │ knowledge_point_id  │
       │         │ status               │
       │         │ mastery_level        │
       │         │ last_reviewed_at     │
       │         │ created_at           │
       │         │ updated_at           │
       │         └──────────────────────┘
       │
       │
       │         ┌──────────────────────┐
       │         │    exercises         │
       │         ├──────────────────────┤
       │         │ id (PK)              │
       │         │ knowledge_point_id   │
       │         │ question             │
       │         │ options (JSONB)      │
       │         │ answer (JSONB)       │
       │         │ type                 │
       │         │ explanation          │
       │         │ difficulty           │
       │         │ created_at           │
       │         └───────────┬──────────┘
       │                     │
       │                     │
       │         ┌───────────▼───────────┐
       │         │ exercise_records     │
       │         ├──────────────────────┤
       │         │ id (PK)              │
       │         │ user_id (FK)         │
       │         │ exercise_id (FK)     │
       │         │ user_answer (JSONB)   │
       │         │ is_correct           │
       │         │ created_at           │
       │         └──────────────────────┘
       │
       └────────────────────────────────┘
```

### 2.2 数据模型详细定义

#### User（用户）

```go
type User struct {
    ID        uint      `gorm:"primaryKey" json:"id"`
    Email     string    `gorm:"type:varchar(255);uniqueIndex;not null" json:"email"`
    Password  string    `gorm:"type:varchar(255);not null" json:"-"`
    Username  string    `gorm:"type:varchar(100)" json:"username"`
    Avatar    string    `gorm:"type:varchar(500)" json:"avatar"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}
```

#### Category（分类）

```go
type Category struct {
    ID          uint      `gorm:"primaryKey" json:"id"`
    Name        string    `gorm:"type:varchar(100);not null" json:"name"`
    Description string    `gorm:"type:text" json:"description"`
    ParentID    *uint     `gorm:"index" json:"parent_id"`
    Parent      *Category `gorm:"foreignKey:ParentID" json:"parent,omitempty"`
    SortOrder   int       `gorm:"default:0" json:"sort_order"`
    CreatedAt   time.Time `json:"created_at"`
}
```

#### KnowledgePoint（知识点）

```go
type KnowledgePoint struct {
    ID            uint      `gorm:"primaryKey" json:"id"`
    Title         string    `gorm:"type:varchar(255);not null" json:"title"`
    Description   string    `gorm:"type:text" json:"description"`
    Content       string    `gorm:"type:text" json:"content"`
    CategoryID    uint      `gorm:"not null;index" json:"category_id"`
    Category      Category  `gorm:"foreignKey:CategoryID" json:"category"`
    Difficulty    string    `gorm:"type:varchar(20);check:difficulty IN ('easy','medium','hard')" json:"difficulty"`
    Frequency     string    `gorm:"type:varchar(20);check:frequency IN ('high','medium','low')" json:"frequency"`
    CodeExample   string    `gorm:"type:text" json:"code_example"`
    References    string    `gorm:"type:text" json:"references"` // JSON array stored as text
    CreatedAt     time.Time `json:"created_at"`
    UpdatedAt     time.Time `json:"updated_at"`
}
```

#### KnowledgeRelation（知识关联）

```go
type KnowledgeRelation struct {
    ID           uint   `gorm:"primaryKey" json:"id"`
    FromPointID  uint   `gorm:"not null;index" json:"from_point_id"`
    ToPointID    uint   `gorm:"not null;index" json:"to_point_id"`
    RelationType string `gorm:"type:varchar(50);not null" json:"relation_type"` // prerequisite, related, extended
    CreatedAt    time.Time `json:"created_at"`
}
```

#### LearningProgress（学习进度）

```go
type LearningProgress struct {
    ID               uint      `gorm:"primaryKey" json:"id"`
    UserID           uint      `gorm:"not null;index:idx_user_knowledge" json:"user_id"`
    User             User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
    KnowledgePointID uint      `gorm:"not null;index:idx_user_knowledge" json:"knowledge_point_id"`
    KnowledgePoint   KnowledgePoint `gorm:"foreignKey:KnowledgePointID" json:"knowledge_point,omitempty"`
    Status           string    `gorm:"type:varchar(20);default:'not_started';check:status IN ('not_started','in_progress','completed')" json:"status"`
    MasteryLevel     int       `gorm:"check:mastery_level >= 0 AND mastery_level <= 100;default:0" json:"mastery_level"`
    LastReviewedAt   *time.Time `json:"last_reviewed_at"`
    CreatedAt        time.Time `json:"created_at"`
    UpdatedAt        time.Time `json:"updated_at"`
}
```

#### Exercise（练习题）

```go
type Exercise struct {
    ID              uint   `gorm:"primaryKey" json:"id"`
    KnowledgePointID uint   `gorm:"not null;index" json:"knowledge_point_id"`
    Question        string `gorm:"type:text;not null" json:"question"`
    Options         string `gorm:"type:jsonb;not null" json:"options"` // JSON array
    Answer          string `gorm:"type:jsonb;not null" json:"answer"` // JSON array
    Type            string `gorm:"type:varchar(20);check:type IN ('single_choice','multiple_choice')" json:"type"`
    Explanation     string `gorm:"type:text" json:"explanation"`
    Difficulty      string `gorm:"type:varchar(20);check:difficulty IN ('easy','medium','hard')" json:"difficulty"`
    CreatedAt       time.Time `json:"created_at"`
}
```

#### ExerciseRecord（练习记录）

```go
type ExerciseRecord struct {
    ID         uint      `gorm:"primaryKey" json:"id"`
    UserID     uint      `gorm:"not null;index" json:"user_id"`
    User       User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
    ExerciseID uint      `gorm:"not null;index" json:"exercise_id"`
    Exercise   Exercise  `gorm:"foreignKey:ExerciseID" json:"exercise,omitempty"`
    UserAnswer string    `gorm:"type:jsonb" json:"user_answer"` // JSON array
    IsCorrect  bool      `json:"is_correct"`
    CreatedAt  time.Time `json:"created_at"`
}
```

## 3. API 契约设计

### 3.1 统一响应格式

#### 成功响应
```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

#### 错误响应
```json
{
  "code": 1001,
  "message": "参数错误",
  "details": "email 不能为空"
}
```

#### 错误码定义
| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 1001 | 参数错误 |
| 1002 | 未授权 |
| 1003 | 禁止访问 |
| 1004 | 资源不存在 |
| 1005 | 资源已存在 |
| 2001 | 数据库错误 |
| 2002 | 缓存错误 |
| 3001 | 服务器内部错误 |

### 3.2 API 接口列表

#### 认证模块 (Auth)

**注册用户**
```
POST /api/v1/auth/register
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "password123",
  "username": "张三"
}

Response 200:
{
  "code": 0,
  "message": "注册成功",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "张三",
      "avatar": "",
      "created_at": "2024-01-01T00:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**用户登录**
```
POST /api/v1/auth/login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response 200:
{
  "code": 0,
  "message": "登录成功",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "张三",
      "avatar": ""
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**获取当前用户信息**
```
GET /api/v1/auth/me
Authorization: Bearer {token}

Response 200:
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "张三",
    "avatar": "",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### 用户模块 (User)

**获取用户信息**
```
GET /api/v1/users/:id
Authorization: Bearer {token}

Response 200:
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "张三",
    "avatar": "",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**更新用户信息**
```
PUT /api/v1/users/:id
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "username": "李四",
  "avatar": "https://example.com/avatar.jpg"
}

Response 200:
{
  "code": 0,
  "message": "更新成功",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "李四",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

#### 分类模块 (Category)

**获取分类列表**
```
GET /api/v1/categories

Response 200:
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "Go 语言",
      "description": "Go 语言相关知识点",
      "parent_id": null,
      "sort_order": 1,
      "created_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": 2,
      "name": "基础",
      "description": "Go 基础知识",
      "parent_id": 1,
      "sort_order": 1,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### 知识点模块 (Knowledge)

**获取知识点列表**
```
GET /api/v1/knowledge?page=1&page_size=20&category_id=1&difficulty=medium&search=goroutine
Authorization: Bearer {token}

Query Parameters:
- page: 页码（默认 1）
- page_size: 每页数量（默认 20，最大 100）
- category_id: 分类 ID（可选）
- difficulty: 难度 easy/medium/hard（可选）
- frequency: 频率 high/medium/low（可选）
- search: 搜索关键词（可选）

Response 200:
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 100,
    "page": 1,
    "page_size": 20,
    "items": [
      {
        "id": 1,
        "title": "Go 协程 (Goroutine)",
        "description": "Go 语言的轻量级线程",
        "category_id": 2,
        "difficulty": "medium",
        "frequency": "high",
        "created_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

**获取知识点详情**
```
GET /api/v1/knowledge/:id
Authorization: Bearer {token}

Response 200:
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "title": "Go 协程 (Goroutine)",
    "description": "Go 语言的轻量级线程",
    "content": "## Goroutine 简介\nGoroutine 是 Go 语言的轻量级线程...",
    "category": {
      "id": 2,
      "name": "基础"
    },
    "difficulty": "medium",
    "frequency": "high",
    "code_example": "```go\nfunc main() {\n    go func() {\n        fmt.Println(\"Hello\")\n    }()\n}\n```",
    "references": ["https://go.dev/tour/concurrency/1"],
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**获取知识图谱数据**
```
GET /api/v1/knowledge/graph?category_id=1
Authorization: Bearer {token}

Query Parameters:
- category_id: 分类 ID（可选，不传则返回全部）

Response 200:
{
  "code": 0,
  "message": "success",
  "data": {
    "nodes": [
      {
        "id": "1",
        "label": "Go 协程",
        "data": {
          "id": 1,
          "title": "Go 协程",
          "difficulty": "medium",
          "status": "completed"
        }
      }
    ],
    "edges": [
      {
        "id": "e1",
        "source": "1",
        "target": "2",
        "label": "前置",
        "type": "prerequisite"
      }
    ]
  }
}
```

#### 学习进度模块 (Progress)

**获取学习进度**
```
GET /api/v1/learning/progress?knowledge_id=1&category_id=1
Authorization: Bearer {token}

Query Parameters:
- knowledge_id: 知识点 ID（可选）
- category_id: 分类 ID（可选）

Response 200:
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 100,
    "completed": 30,
    "in_progress": 20,
    "not_started": 50,
    "mastery_avg": 65,
    "items": [
      {
        "id": 1,
        "knowledge_point": {
          "id": 1,
          "title": "Go 协程"
        },
        "status": "completed",
        "mastery_level": 80,
        "last_reviewed_at": "2024-01-01T10:00:00Z"
      }
    ]
  }
}
```

**更新学习进度**
```
POST /api/v1/learning/progress
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "knowledge_point_id": 1,
  "status": "completed",
  "mastery_level": 85
}

Response 200:
{
  "code": 0,
  "message": "更新成功",
  "data": {
    "id": 1,
    "knowledge_point_id": 1,
    "status": "completed",
    "mastery_level": 85,
    "last_reviewed_at": "2024-01-01T10:00:00Z"
  }
}
```

**获取学习统计**
```
GET /api/v1/learning/stats
Authorization: Bearer {token}

Response 200:
{
  "code": 0,
  "message": "success",
  "data": {
    "total_points": 100,
    "completed_points": 30,
    "in_progress_points": 20,
    "not_started_points": 50,
    "total_exercises": 300,
    "completed_exercises": 150,
    "correct_rate": 0.75,
    "study_hours": 12.5,
    "category_stats": [
      {
        "category_id": 1,
        "category_name": "Go 语言",
        "total": 50,
        "completed": 20,
        "mastery_avg": 70
      }
    ]
  }
}
```

#### 练习模块 (Exercise)

**获取练习题列表**
```
GET /api/v1/exercises?page=1&page_size=10&knowledge_id=1&difficulty=medium
Authorization: Bearer {token}

Response 200:
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 100,
    "page": 1,
    "page_size": 10,
    "items": [
      {
        "id": 1,
        "question": "以下关于 Goroutine 的描述，正确的是？",
        "type": "single_choice",
        "difficulty": "medium",
        "created_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

**获取练习题详情**
```
GET /api/v1/exercises/:id
Authorization: Bearer {token}

Response 200:
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "knowledge_point_id": 1,
    "question": "以下关于 Goroutine 的描述，正确的是？",
    "options": [
      "A. Goroutine 是操作系统线程",
      "B. Goroutine 是轻量级线程",
      "C. Goroutine 需要手动管理内存",
      "D. Goroutine 不能并发执行"
    ],
    "type": "single_choice",
    "explanation": "Goroutine 是 Go 语言的轻量级线程，由 Go 运行时管理...",
    "difficulty": "medium"
  }
}
```

**提交答案**
```
POST /api/v1/exercises/:id/submit
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "answer": ["A"]
}

Response 200:
{
  "code": 0,
  "message": "提交成功",
  "data": {
    "is_correct": true,
    "correct_answer": ["A"],
    "explanation": "Goroutine 是 Go 语言的轻量级线程...",
    "record_id": 1
  }
}
```

**获取错题本**
```
GET /api/v1/exercises/wrong?page=1&page_size=10
Authorization: Bearer {token}

Response 200:
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 20,
    "page": 1,
    "page_size": 10,
    "items": [
      {
        "id": 1,
        "exercise_id": 1,
        "question": "以下关于 Goroutine 的描述，正确的是？",
        "user_answer": ["B"],
        "correct_answer": ["A"],
        "explanation": "Goroutine 是 Go 语言的轻量级线程...",
        "wrong_count": 2,
        "created_at": "2024-01-01T10:00:00Z"
      }
    ]
  }
}
```

## 4. 缓存策略设计

### 4.1 缓存层次

```
┌─────────────────┐
│   L1: 内存缓存   │ (Go map, 短期缓存)
│   TTL: 5 min    │
└────────┬────────┘
         │ Miss
┌────────▼────────┐
│   L2: Redis     │ (分布式缓存)
│   TTL: 1 hour   │
└────────┬────────┘
         │ Miss
┌────────▼────────┐
│   L3: Database  │ (持久化存储)
└─────────────────┘
```

### 4.2 缓存 Key 设计

| 数据类型 | Key 格式 | TTL | 说明 |
|---------|---------|-----|------|
| 用户 Session | `session:{user_id}` | 7天 | 用户登录状态 |
| 知识点详情 | `knowledge:{id}` | 1小时 | 知识点内容 |
| 知识点列表 | `knowledge:list:{category_id}:{page}:{page_size}` | 10分钟 | 列表页缓存 |
| 知识图谱 | `knowledge:graph:{category_id}` | 30分钟 | 图谱数据 |
| 学习进度 | `progress:{user_id}:{knowledge_id}` | 10分钟 | 单个进度 |
| 学习统计 | `stats:{user_id}` | 5分钟 | 统计数据 |
| 练习题 | `exercise:{id}` | 1小时 | 题目内容 |
| 错题本 | `exercises:wrong:{user_id}:{page}` | 10分钟 | 错题列表 |

### 4.3 缓存更新策略

- **更新**: 数据修改时删除缓存
- **过期**: TTL 自动过期
- **预热**: 系统启动时预加载热点数据

## 5. 安全设计

### 5.1 认证与授权

- **认证方式**: JWT Token
- **Token 生成**: HS256 算法
- **Token 有效期**: 7 天
- **刷新机制**: 可选 Refresh Token

### 5.2 数据安全

- **密码加密**: bcrypt，cost factor 10
- **SQL 注入防护**: 使用 GORM 参数化查询
- **XSS 防护**: 前端输入转义
- **CORS 配置**: 限制允许的域名

### 5.3 限流策略

- **全局限流**: 100 req/sec
- **IP 限流**: 20 req/sec
- **用户限流**: 10 req/sec

## 6. 部署架构

### 6.1 Docker Compose 服务编排

```yaml
services:
  postgres:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  backend:
    build: ./backend
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./frontend
    depends_on:
      - backend

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
      - frontend
```

### 6.2 网络架构

```
                Internet
                    │
                    ▼
            ┌───────────────┐
            │   Nginx       │ (反向代理 + SSL)
            │   Port 80/443 │
            └───────┬───────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
┌───────────────┐      ┌───────────────┐
│   Frontend    │      │   Backend     │
│   Nginx:80    │      │   Gin:8080    │
└───────────────┘      └───────┬───────┘
                               │
                  ┌────────────┼────────────┐
                  │            │            │
                  ▼            ▼            ▼
          ┌──────────────┐ ┌──────────┐ ┌──────────┐
          │  PostgreSQL  │ │  Redis   │ │ (未来扩展)│
          │  Port 5432   │ │ Port 6379│ │          │
          └──────────────┘ └──────────┘ └──────────┘
```

## 7. 监控与日志

### 7.1 日志级别

- **DEBUG**: 详细调试信息
- **INFO**: 一般信息
- **WARN**: 警告信息
- **ERROR**: 错误信息

### 7.2 日志格式

```json
{
  "timestamp": "2024-01-01T00:00:00Z",
  "level": "INFO",
  "message": "User login",
  "user_id": 1,
  "ip": "127.0.0.1",
  "request_id": "abc123"
}
```

### 7.3 健康检查

```
GET /health
Response 200: {"status": "ok"}
```

## 8. 性能优化策略

### 8.1 数据库优化

- 合理使用索引
- 避免 N+1 查询（使用 Preload）
- 分页查询
- 连接池配置

### 8.2 缓存优化

- 多级缓存
- 缓存预热
- 缓存穿透防护
- 缓存雪崩防护

### 8.3 前端优化

- 代码分割
- 懒加载
- 虚拟滚动（知识图谱）
- 防抖节流
- Memo 优化

## 9. 技术选型总结

| 层级 | 技术选型 | 版本 | 原因 |
|------|---------|------|------|
| 后端语言 | Go | 1.21+ | 高性能、并发友好 |
| Web 框架 | Gin | latest | 轻量、高性能、文档完善 |
| ORM | GORM | latest | 功能完善、易用 |
| 数据库 | PostgreSQL | 15+ | 功能强大、可靠性高 |
| 缓存 | Redis | 7+ | 高性能、功能丰富 |
| 前端框架 | React | 18 | 生态丰富、组件化 |
| 前端语言 | TypeScript | 5+ | 类型安全 |
| 构建工具 | Vite | 5+ | 快速、现代化 |
| UI 组件库 | Ant Design | 5+ | 组件丰富、中文友好 |
| 图谱可视化 | React Flow | latest | React 原生、性能好 |
| HTTP 客户端 | Axios | latest | 功能完善、易用 |
| 容器化 | Docker | 24+ | 标准化部署 |
| 编排工具 | Docker Compose | 2+ | 简单易用 |

## 10. 开发规范

### 10.1 代码规范

- Go: 遵循 `gofmt`、`golint` 规范
- TypeScript: 遵循 ESLint + Prettier 规范
- Git: 遵循 Conventional Commits 规范

### 10.2 API 设计规范

- RESTful 风格
- 统一响应格式
- 版本控制（/api/v1）
- 错误处理完善

### 10.3 数据库规范

- 表名使用复数形式
- 字段名使用蛇形命名
- 必须有主键和创建时间
- 软删除使用 deleted_at

### 10.4 文档规范

- API 文档使用 Swagger/OpenAPI
- 代码注释完整
- README 包含完整的使用说明
- 变更记录维护 CHANGELOG.md
