# 通义千问AI服务配置说明

## 概述

本项目已将AI服务从OpenAI替换为通义千问大模型，提供更稳定、更符合国内使用环境的AI能力。

## 主要变更

### 1. API配置变更

| 配置项 | 原值 (OpenAI) | 新值 (通义千问) |
|--------|---------------|----------------|
| API URL | `https://api.openai.com/v1/chat/completions` | `https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation` |
| 模型 | `gpt-3.5-turbo` | `qwen-turbo` |
| 密钥变量 | `your_ai_api_key_here` | `your_qwen_api_key_here` |

### 2. 请求格式变更

**OpenAI格式：**
```javascript
{
  model: "gpt-3.5-turbo",
  messages: [
    { role: "system", content: "..." },
    { role: "user", content: "..." }
  ],
  temperature: 0.7,
  max_tokens: 2000
}
```

**通义千问格式：**
```javascript
{
  model: "qwen-turbo",
  input: {
    messages: [
      { role: "system", content: "..." },
      { role: "user", content: "..." }
    ]
  },
  parameters: {
    temperature: 0.7,
    max_tokens: 2000,
    result_format: "message"
  }
}
```

### 3. 响应格式变更

**OpenAI响应：**
```javascript
{
  "choices": [
    {
      "message": {
        "content": "AI回复内容"
      }
    }
  ]
}
```

**通义千问响应：**
```javascript
{
  "output": {
    "choices": [
      {
        "message": {
          "content": "AI回复内容"
        }
      }
    ]
  }
}
```

## 获取API密钥

1. 访问 [阿里云百炼控制台](https://dashscope.console.aliyun.com/)
2. 登录或注册阿里云账号
3. 进入"API-KEY管理"页面
4. 创建新的API-KEY
5. 复制API密钥并配置到 `.env` 文件中

## 配置步骤

1. 打开 `.env` 文件
2. 修改以下配置：
   ```env
   AI_API_KEY=sk-your-actual-api-key-here
   AI_API_URL=https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation
   AI_MODEL=qwen-turbo
   ```

## 模型选择

通义千问提供多种模型，可根据需求选择：

| 模型 | 特点 | 适用场景 |
|------|------|----------|
| `qwen-turbo` | 快速响应，成本较低 | 日常对话、简单推荐 |
| `qwen-plus` | 平衡性能和成本 | 通用场景 |
| `qwen-max` | 最强性能，成本较高 | 复杂推理、专业分析 |

## 功能支持

当前支持的AI功能：

- ✅ 智能菜谱推荐
- ✅ 菜谱描述生成
- ✅ 营养成分分析
- ✅ 烹饪步骤生成
- ✅ 智能对话问答

## 错误处理

常见错误及解决方案：

1. **API密钥未配置**
   - 错误：`AI API密钥未配置`
   - 解决：检查 `.env` 文件中的 `AI_API_KEY` 是否正确配置

2. **API调用失败**
   - 错误：`AI服务调用失败`
   - 解决：检查网络连接、API密钥是否有效、余额是否充足

3. **JSON解析失败**
   - 错误：`JSON解析失败`
   - 解决：检查AI返回的格式，可能需要调整提示词

## 测试AI服务

启动后端服务后，可以测试AI服务状态：

```bash
curl http://localhost:3000/api/ai/status
```

正常响应：
```json
{
  "success": true,
  "data": {
    "available": true,
    "message": "AI服务可用"
  }
}
```

## 注意事项

1. 通义千问API有调用频率限制，请合理控制请求频率
2. API调用会产生费用，请注意监控使用量
3. 生产环境建议使用API密钥管理服务存储密钥
4. 建议为AI服务添加缓存机制，减少重复调用

## 回滚到OpenAI

如需回滚到OpenAI，只需修改 `.env` 文件：

```env
AI_API_KEY=sk-your-openai-key-here
AI_API_URL=https://api.openai.com/v1/chat/completions
AI_MODEL=gpt-3.5-turbo
```

然后修改 `src/services/aiService.js` 中的请求和响应处理逻辑。