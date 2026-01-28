# Specify - 规格定义

## 功能规格

### 1. 核心功能模块

#### 1.1 用户管理模块
- **用户注册/登录**
  - 邮箱注册
  - 密码登录
  - JWT Token 认证

- **用户信息管理**
  - 个人资料编辑
  - 头像上传
  - 学习偏好设置

#### 1.2 知识库管理模块
- **知识点分类**
  - 按技术栈分类（Go、Java、前端、数据库等）
  - 按难度分类（基础、进阶、高级）
  - 按面试频率分类

- **知识点内容**
  - 标题、描述、详细内容
  - 示例代码
  - 相关资源链接
  - 知识点关联

#### 1.3 学习路径模块
- **可视化知识图谱**
  - 节点式展示知识点
  - 连接线展示知识关联
  - 缩放、拖拽交互

- **学习路径推荐**
  - 基于技术栈的推荐路径
  - 基于难度的循序渐进
  - 个性化定制路径

#### 1.4 学习进度模块
- **进度追踪**
  - 已学习/未学习状态
  - 掌握程度评分
  - 学习时间记录

- **统计报表**
  - 学习进度可视化
  - 知识点覆盖度
  - 学习效率分析

#### 1.5 练习测试模块
- **选择题练习**
  - 单选题
  - 多选题
  - 即时反馈

- **错题本**
  - 错题记录
  - 错题重练
  - 错题分析

#### 1.6 数据可视化模块
- **学习仪表盘**
  - 总体进度
  - 最近学习
  - 推荐内容

- **知识图谱可视化**
  - D3.js 或 React Flow 实现交互式图谱
  - 支持节点筛选、搜索
  - 支持路径高亮

### 2. 非功能性需求

#### 2.1 性能需求
- API 响应时间 < 300ms
- 页面首次加载 < 2s
- 支持 1000+ 并发用户
- 缓存命中率 > 80%

#### 2.2 安全需求
- 密码加密存储（bcrypt）
- JWT Token 过期机制
- SQL 注入防护
- XSS 攻击防护
- CORS 策略配置

#### 2.3 可用性需求
- 系统可用性 > 99.9%
- 错误提示友好
- 响应式设计（支持移动端）

#### 2.4 可维护性需求
- 代码注释完整
- 模块化设计
- API 文档自动生成

## 技术规格

### 3. 后端技术栈

#### 3.1 核心框架
- **语言**: Go 1.21+
- **Web 框架**: Gin
- **数据库驱动**: pgx (PostgreSQL)
- **缓存驱动**: go-redis

#### 3.2 数据库设计
- **表结构**
  - users (用户表)
  - knowledge_points (知识点表)
  - categories (分类表)
  - learning_progress (学习进度表)
  - exercises (练习题表)
  - exercise_records (练习记录表)

- **索引设计**
  - 用户邮箱唯一索引
  - 知识点分类索引
  - 学习进度联合索引

#### 3.3 API 设计
- **RESTful 风格**
  - GET /api/v1/users/:id - 获取用户信息
  - POST /api/v1/auth/login - 用户登录
  - GET /api/v1/knowledge - 获取知识点列表
  - GET /api/v1/learning/progress - 获取学习进度

- **响应格式**
  ```json
  {
    "code": 0,
    "message": "success",
    "data": {}
  }
  ```

- **错误处理**
  ```json
  {
    "code": 1001,
    "message": "参数错误",
    "details": "email 不能为空"
  }
  ```

#### 3.4 缓存策略
- **Redis 缓存**
  - 热点知识点缓存（TTL: 1小时）
  - 用户 Session 缓存（TTL: 7天）
  - 学习进度缓存（TTL: 10分钟）

### 4. 前端技术栈

#### 4.1 核心框架
- **框架**: React 18
- **语言**: TypeScript
- **构建工具**: Vite
- **状态管理**: React Context + Hooks
- **路由**: React Router v6
- **UI 组件库**: Ant Design
- **图表库**: ECharts 或 Recharts
- **图谱可视化**: React Flow

#### 4.2 页面结构
```
src/
├── components/          # 公共组件
│   ├── Layout/         # 布局组件
│   ├── KnowledgeCard/  # 知识点卡片
│   ├── KnowledgeGraph/ # 知识图谱
│   └── ProgressChart/  # 进度图表
├── pages/              # 页面
│   ├── Home/           # 首页
│   ├── Learning/       # 学习页
│   ├── Knowledge/      # 知识库
│   ├── Profile/        # 个人中心
│   └── Login/          # 登录页
├── hooks/              # 自定义 Hooks
├── services/           # API 服务
├── store/              # 状态管理
├── types/              # TypeScript 类型定义
├── utils/              # 工具函数
└── App.tsx
```

#### 4.3 响应式设计
- 桌面端: >= 1200px
- 平板端: 768px - 1199px
- 移动端: < 768px

### 5. 数据库规格

#### 5.1 PostgreSQL 版本
- **版本**: PostgreSQL 15+
- **字符集**: UTF-8

#### 5.2 核心表结构

**users 表**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(100),
  avatar VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**categories 表**
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  parent_id INTEGER REFERENCES categories(id),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**knowledge_points 表**
```sql
CREATE TABLE knowledge_points (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  category_id INTEGER REFERENCES categories(id),
  difficulty VARCHAR(20), -- easy, medium, hard
  frequency VARCHAR(20), -- high, medium, low
  code_example TEXT,
  references TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**knowledge_relations 表**
```sql
CREATE TABLE knowledge_relations (
  id SERIAL PRIMARY KEY,
  from_point_id INTEGER REFERENCES knowledge_points(id),
  to_point_id INTEGER REFERENCES knowledge_points(id),
  relation_type VARCHAR(50), -- prerequisite, related, extended
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**learning_progress 表**
```sql
CREATE TABLE learning_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  knowledge_point_id INTEGER REFERENCES knowledge_points(id),
  status VARCHAR(20) DEFAULT 'not_started', -- not_started, in_progress, completed
  mastery_level INTEGER CHECK (mastery_level >= 0 AND mastery_level <= 100),
  last_reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, knowledge_point_id)
);
```

**exercises 表**
```sql
CREATE TABLE exercises (
  id SERIAL PRIMARY KEY,
  knowledge_point_id INTEGER REFERENCES knowledge_points(id),
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  answer JSONB NOT NULL,
  type VARCHAR(20), -- single_choice, multiple_choice
  explanation TEXT,
  difficulty VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**exercise_records 表**
```sql
CREATE TABLE exercise_records (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  exercise_id INTEGER REFERENCES exercises(id),
  user_answer JSONB,
  is_correct BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. 部署规格

#### 6.1 Docker Compose 配置
```yaml
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: eightgu
      POSTGRES_USER: eightgu
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
```

#### 6.2 环境变量
```env
# 后端
DB_HOST=postgres
DB_PORT=5432
DB_NAME=eightgu
DB_USER=eightgu
DB_PASSWORD=password
REDIS_HOST=redis
REDIS_PORT=6379
JWT_SECRET=your-secret-key
```

## 接口规格

### 7. API 列表

#### 认证相关
- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 用户登录
- `GET /api/v1/auth/me` - 获取当前用户信息

#### 知识库相关
- `GET /api/v1/knowledge` - 获取知识点列表
- `GET /api/v1/knowledge/:id` - 获取知识点详情
- `GET /api/v1/categories` - 获取分类列表
- `GET /api/v1/knowledge/graph` - 获取知识图谱数据

#### 学习进度相关
- `GET /api/v1/learning/progress` - 获取学习进度
- `POST /api/v1/learning/progress` - 更新学习进度
- `GET /api/v1/learning/stats` - 获取学习统计

#### 练习相关
- `GET /api/v1/exercises` - 获取练习题列表
- `GET /api/v1/exercises/:id` - 获取练习题详情
- `POST /api/v1/exercises/:id/submit` - 提交答案
- `GET /api/v1/exercises/wrong` - 获取错题本

#### 用户相关
- `GET /api/v1/users/:id` - 获取用户信息
- `PUT /api/v1/users/:id` - 更新用户信息

## 验收标准

### 8. 功能验收
- [ ] 用户可以注册和登录
- [ ] 可以浏览知识点库
- [ ] 可以查看知识图谱
- [ ] 可以记录学习进度
- [ ] 可以进行练习并查看结果
- [ ] 可以查看学习统计

### 9. 性能验收
- [ ] API 响应时间符合要求
- [ ] 页面加载速度符合要求
- [ ] 缓存机制有效工作

### 10. 质量验收
- [ ] 代码符合规范
- [ ] 文档完整
- [ ] 可以通过 Docker Compose 一键启动
- [ ] 所有功能正常运行
