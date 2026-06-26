# HomePlate-AI 前端

基于 React + Vite + Tailwind CSS 的智能菜谱管理前端应用。

## 技术栈

- **框架**: React 18
- **构建工具**: Vite 5
- **样式**: Tailwind CSS
- **路由**: React Router v6
- **状态管理**: Zustand
- **HTTP请求**: Axios
- **通知**: React Hot Toast
- **图标**: Lucide React
- **AI服务**: 通义千问大模型（后端集成）

## 项目结构

```
frontend/
├── src/
│   ├── components/       # 公共组件
│   │   ├── BottomNav.jsx      # 底部导航栏
│   │   ├── ProtectedRoute.jsx # 路由保护
│   │   ├── RecipeCard.jsx     # 菜谱卡片
│   │   ├── CategoryTabs.jsx   # 分类标签
│   │   ├── Modal.jsx          # 弹窗组件
│   │   ├── SearchBar.jsx      # 搜索栏
│   │   ├── LoadingSpinner.jsx # 加载动画
│   │   └── EmptyState.jsx     # 空状态组件
│   ├── pages/           # 页面组件
│   │   ├── Login.jsx          # 登录注册页
│   │   ├── Home.jsx           # 首页AI推荐
│   │   ├── Fridge.jsx         # 冰箱库存管理
│   │   ├── Shopping.jsx       # 采购清单
│   │   ├── RecipeDetail.jsx   # 菜谱详情
│   │   ├── Profile.jsx        # 个人中心
│   │   └── Stats.jsx          # 每周统计
│   ├── stores/          # 状态管理
│   │   └── index.js           # Zustand stores
│   ├── utils/           # 工具函数
│   │   ├── api.js             # Axios配置
│   │   └── apiServices.js     # API服务
│   ├── App.jsx          # 应用入口
│   ├── main.jsx         # React入口
│   └── index.css        # 全局样式
├── index.html           # HTML模板
├── package.json         # 项目配置
├── vite.config.js       # Vite配置
├── tailwind.config.js   # Tailwind配置
└── postcss.config.js    # PostCSS配置
```

## 快速开始

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

前端将在 http://localhost:5173 启动。

### 3. 配置后端API

确保后端服务已启动（默认 http://localhost:3000），前端通过Vite代理自动转发API请求。

## 功能页面

### 登录注册页 `/login`
- 用户登录/注册表单
- JWT认证
- 自动跳转

### 首页 `/`
- AI智能推荐菜谱（基于库存）
- 今日推荐菜谱
- 分类浏览
- 搜索功能

### 冰箱库存 `/fridge`
- 食材列表展示
- 临期/过期高亮显示
- 新增/编辑/删除食材
- 库存统计

### 采购清单 `/shopping`
- 根据菜谱自动生成清单
- 对比库存计算缺少食材
- 勾选完成采购
- 清空已购买项

### 菜谱详情 `/recipe/:id`
- 用料展示
- 烹饪步骤
- 收藏功能
- 生成采购清单

### 个人中心 `/profile`
- 用户信息展示
- 我的收藏列表
- 偏好设置
- 退出登录

### 每周统计 `/stats`
- 烹饪次数统计
- 菜谱分类分布
- 冰箱库存状态
- 健康饮食建议

## 设计规范

### 主色调
- **暖橙色**: `#FF8C38` (primary)
- **健康绿色**: `#2E7D32` (secondary)

### 组件规范
- 卡片圆角: `16px`
- 阴影: `card-shadow`
- 动画: `animate-fadeIn`

### 移动端适配
- 底部Tab导航
- 响应式布局
- 触摸优化

## API对接

所有数据请求后端API，无本地硬编码数据：

- 认证: `/api/auth/*`
- 菜谱: `/api/recipes/*`
- 冰箱: `/api/fridge/*`
- 采购: `/api/shopping/*`
- AI: `/api/ai/*`

## 构建部署

```bash
npm run build
npm run preview
```

## 许可证

MIT License