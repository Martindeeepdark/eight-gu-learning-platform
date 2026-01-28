# 八股文可视化学习平台 (Eight-Gu Learning Platform)

> 通过可视化、交互式的方式，帮助开发者系统化学习技术面试中的"八股文"知识

## 项目简介

这是一个完整的全栈项目，采用 Spec-Driven Development (SDD) 方法论开发。项目旨在帮助开发者系统地准备技术面试，通过可视化知识图谱、学习进度追踪、互动练习等方式提升学习效率。

## 技术栈

### 后端
- Go 1.21+
- Gin Web Framework
- PostgreSQL 15+
- Redis 7+
- GORM
- JWT 认证

### 前端
- React 18
- TypeScript
- Vite
- Ant Design
- React Flow (知识图谱可视化)
- ECharts (数据图表)

### 部署
- Docker
- Docker Compose

## 项目结构

```
eight-gu-learning-platform/
├── docs/                 # SDD 规范文档
│   ├── 01-constitution.md
│   ├── 02-specify.md
│   ├── 03-clarify.md
│   ├── 04-plan.md        # 待生成
│   ├── 05-tasks.md       # 待生成
│   └── README.md
├── backend/              # Go 后端
├── frontend/             # React 前端
├── docker/               # Docker 配置
└── README.md             # 本文件
```

## 开发状态

### 已完成
- ✅ Constitution（项目立宪）
- ✅ Specify（规格定义）
- ✅ Clarify（需求澄清）

### 进行中
- 🔄 Plan（技术规划）
- ⏳ Tasks（任务分解）
- ⏳ Implement（实现）

## 快速开始

### 前置要求
- Docker 20.10+
- Docker Compose 2.0+
- Go 1.21+ (开发环境)
- Node.js 18+ (开发环境)

### 使用 Docker Compose 启动

```bash
# 克隆项目
git clone <repository-url>
cd eight-gu-learning-platform

# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 访问应用

- 前端: http://localhost:3000
- 后端 API: http://localhost:8080
- API 文档: http://localhost:8080/swagger/index.html

## 本地开发

### 后端开发

```bash
cd backend

# 安装依赖
go mod download

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 运行
go run main.go

# 运行测试
go test ./...
```

### 前端开发

```bash
cd frontend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 启动开发服务器
npm run dev
```

## 核心功能

### 1. 用户系统
- 用户注册/登录
- JWT 认证
- 个人资料管理

### 2. 知识库管理
- 知识点 CRUD
- 分类管理
- 知识点关联

### 3. 知识图谱
- 可视化展示知识关系
- 交互式浏览
- 路径追踪

### 4. 学习进度
- 学习状态追踪
- 掌握程度评估
- 学习统计

### 5. 练习系统
- 选择题练习
- 错题本
- 答案解析

## API 接口

### 认证相关
- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 用户登录
- `GET /api/v1/auth/me` - 获取当前用户信息

### 知识库相关
- `GET /api/v1/knowledge` - 获取知识点列表
- `GET /api/v1/knowledge/:id` - 获取知识点详情
- `GET /api/v1/knowledge/graph` - 获取知识图谱数据

### 学习进度相关
- `GET /api/v1/learning/progress` - 获取学习进度
- `POST /api/v1/learning/progress` - 更新学习进度

完整 API 文档请查看 Swagger：http://localhost:8080/swagger/index.html

## 环境变量

### 后端 (.env)
```env
DB_HOST=postgres
DB_PORT=5432
DB_NAME=eightgu
DB_USER=eightgu
DB_PASSWORD=password
REDIS_HOST=redis
REDIS_PORT=6379
JWT_SECRET=your-secret-key
```

### 前端 (.env)
```env
VITE_API_BASE_URL=http://localhost:8080
```

## 数据库

### 表结构
- `users` - 用户表
- `categories` - 分类表
- `knowledge_points` - 知识点表
- `knowledge_relations` - 知识点关联表
- `learning_progress` - 学习进度表
- `exercises` - 练习题表
- `exercise_records` - 练习记录表

### 初始化
```bash
# 运行迁移
docker-compose exec backend go run cmd/migrate/main.go

# 导入种子数据
docker-compose exec backend go run cmd/seed/main.go
```

## 测试

### 后端测试
```bash
cd backend
go test ./...
```

### 前端测试
```bash
cd frontend
npm run test
```

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

## 作者

Martin Wen (@Martindeeepdark)

## 致谢

- Spec Kit - SDD 方法论和工具
- Ant Design - UI 组件库
- React Flow - 知识图谱可视化
