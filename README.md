# AI家庭菜谱管理与食材采购助手 - 后端服务

基于 Node.js + Express + MySQL 的完整后端服务，支持用户管理、菜谱查询、冰箱库存管理、智能采购清单生成和AI智能推荐功能。

## 功能特性

- **用户管理**: 注册、登录、密码修改、个人信息管理
- **菜谱管理**: 菜谱查询、分类浏览、推荐菜谱、收藏功能
- **冰箱库存**: 食材增删改查、临期提醒、库存统计
- **智能采购**: 根据菜谱自动生成采购清单、智能推荐采购
- **AI服务**: 智能推荐菜谱、营养分析、烹饪步骤生成、对话功能（基于通义千问）

## 技术栈

- **运行环境**: Node.js 18+
- **Web框架**: Express.js
- **数据库**: MySQL 8.0+
- **ORM**: Sequelize
- **认证**: JWT (JSON Web Token)
- **验证**: Express-validator
- **AI服务**: 通义千问大模型

## 项目结构

```
backend/
├── src/
│   ├── config/          # 配置文件
│   │   └── database.js  # 数据库配置
│   ├── controllers/     # 控制器
│   │   ├── authController.js      # 认证控制器
│   │   ├── recipeController.js    # 菜谱控制器
│   │   ├── fridgeController.js    # 冰箱控制器
│   │   ├── shoppingController.js  # 采购控制器
│   │   ├── favoriteController.js  # 收藏控制器
│   │   └── aiController.js        # AI控制器
│   ├── middlewares/      # 中间件
│   │   ├── auth.js      # 认证中间件
│   │   └── responseHandler.js  # 响应处理中间件
│   ├── models/          # 数据模型
│   │   ├── User.js      # 用户模型
│   │   ├── Recipe.js    # 菜谱模型
│   │   ├── FridgeItem.js    # 冰箱食材模型
│   │   ├── Favorite.js     # 收藏模型
│   │   ├── ShoppingItem.js # 采购清单模型
│   │   └── index.js     # 模型关联
│   ├── routes/          # 路由
│   │   ├── auth.js      # 认证路由
│   │   ├── recipe.js    # 菜谱路由
│   │   ├── fridge.js    # 冰箱路由
│   │   ├── shopping.js  # 采购路由
│   │   └── ai.js        # AI路由
│   ├── services/        # 服务层
│   │   └── aiService.js # AI服务封装
│   ├── utils/           # 工具函数
│   │   └── helpers.js   # 通用工具函数
│   ├── scripts/         # 脚本
│   │   └── initDatabase.js  # 数据库初始化脚本
│   └── server.js        # 应用入口
├── .env                 # 环境变量文件
├── .env.example         # 环境变量示例
├── .gitignore           # Git忽略文件
└── package.json         # 项目配置文件
```

## 快速开始

### 1. 环境要求

- Node.js 18.x 或更高版本
- MySQL 8.0 或更高版本

### 2. 安装MySQL

如果本地没有安装MySQL，请先安装并启动服务。

### 3. 安装依赖

```bash
cd backend
npm install
```

### 4. 配置环境变量

创建 `.env` 文件并配置数据库连接：

```env
NODE_ENV=development
PORT=3000

# 数据库配置（请根据实际情况修改）
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=recipe_assistant

# JWT配置
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# AI服务配置（通义千问）
# 获取API密钥：https://dashscope.console.aliyun.com/
AI_API_KEY=your_qwen_api_key_here
AI_API_URL=https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation
AI_MODEL=qwen-turbo

# CORS配置
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 5. 初始化数据库

```bash
npm run db:init
```

这将创建所有数据表并插入示例数据。

### 6. 启动服务器

开发模式（支持热重载）：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

服务器将在 http://localhost:3000 启动。

## API接口

### 认证接口 `/api/auth`

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| POST | /register | 用户注册 | 否 |
| POST | /login | 用户登录 | 否 |
| GET | /profile | 获取个人信息 | 是 |
| PUT | /profile | 更新个人信息 | 是 |
| PUT | /password | 修改密码 | 是 |

### 菜谱接口 `/api/recipes`

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | / | 获取菜谱列表 | 否 |
| GET | /recommended | 获取推荐菜谱 | 否 |
| GET | /hot | 获取热门菜谱 | 否 |
| GET | /categories | 获取分类列表 | 否 |
| GET | /:id | 获取菜谱详情 | 可选 |
| POST | /:id/favorite | 添加收藏 | 是 |
| DELETE | /:id/favorite | 取消收藏 | 是 |

### 冰箱接口 `/api/fridge`

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | / | 获取食材列表 | 是 |
| GET | /expiring | 获取临期食材 | 是 |
| GET | /stats | 获取库存统计 | 是 |
| POST | / | 添加食材 | 是 |
| POST | /batch | 批量添加食材 | 是 |
| PUT | /:id | 更新食材 | 是 |
| DELETE | /:id | 删除食材 | 是 |

### 采购接口 `/api/shopping`

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | / | 获取采购清单 | 是 |
| GET | /suggestions | 获取采购建议 | 是 |
| POST | /generate/:recipeId | 根据菜谱生成 | 是 |
| POST | /generate-multiple | 根据多菜谱生成 | 是 |
| POST | / | 添加采购项 | 是 |
| PUT | /:id/status | 更新状态 | 是 |
| DELETE | /:id | 删除采购项 | 是 |

### AI接口 `/api/ai`

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | /status | 检查AI服务状态 | 否 |
| POST | /recommend | 智能推荐菜谱 | 是 |
| POST | /nutrition | 营养分析 | 是 |
| POST | /steps | 生成烹饪步骤 | 是 |
| POST | /conversation | 智能对话 | 是 |

## API使用示例

### 注册用户

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "password123"
  }'
```

### 登录

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

### 获取菜谱列表

```bash
curl http://localhost:3000/api/recipes
```

### 添加冰箱食材

```bash
curl -X POST http://localhost:3000/api/fridge \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "番茄",
    "quantity": 3,
    "unit": "个",
    "category": "vegetable",
    "expiryDate": "2026-05-15"
  }'
```

### 根据菜谱生成采购清单

```bash
curl -X POST http://localhost:3000/api/shopping/generate/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 默认账户

初始化数据库后会自动创建以下账户：

| 类型 | 邮箱 | 密码 |
|------|------|------|
| 管理员 | admin@example.com | admin123 |
| 测试用户 | test@example.com | test123 |

## 数据表说明

### users 用户表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| username | VARCHAR(50) | 用户名 |
| email | VARCHAR(100) | 邮箱 |
| password | VARCHAR(255) | 密码（加密） |
| nickname | VARCHAR(50) | 昵称 |
| avatar | VARCHAR(255) | 头像URL |
| isActive | BOOLEAN | 是否启用 |
| lastLoginAt | DATETIME | 最后登录时间 |

### recipes 菜谱表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| name | VARCHAR(100) | 菜谱名称 |
| category | ENUM | 分类 |
| description | TEXT | 描述 |
| image | VARCHAR(500) | 图片URL |
| duration | INT | 时长（分钟） |
| difficulty | ENUM | 难度 |
| servings | INT | 份数 |
| ingredients | JSON | 食材列表 |
| steps | JSON | 步骤列表 |
| nutrition | JSON | 营养成分 |
| isRecommended | BOOLEAN | 是否推荐 |
| viewCount | INT | 浏览次数 |
| collectCount | INT | 收藏次数 |

### fridge_items 冰箱食材表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| userId | INT | 用户ID |
| name | VARCHAR(100) | 食材名称 |
| quantity | DECIMAL | 数量 |
| unit | VARCHAR(20) | 单位 |
| category | ENUM | 分类 |
| expiryDate | DATE | 过期日期 |
| purchaseDate | DATE | 购买日期 |

### favorites 收藏表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| userId | INT | 用户ID |
| recipeId | INT | 菜谱ID |

### shopping_items 采购清单表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| userId | INT | 用户ID |
| name | VARCHAR(100) | 食材名称 |
| quantity | VARCHAR(50) | 需要数量 |
| status | ENUM | 状态 |
| recipeId | INT | 来源菜谱ID |

## 部署建议

1. **生产环境**: 设置 `NODE_ENV=production`
2. **数据库**: 使用云数据库服务（如阿里云RDS）
3. **安全**: 修改默认JWT密钥，使用HTTPS
4. **AI服务**: 建议使用API密钥管理服务

## 许可证

MIT License
