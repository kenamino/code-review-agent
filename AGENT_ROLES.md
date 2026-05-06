# Agent 角色详细介绍

## 系统中的四个专业化 Agent

### 1. 代码分析 Agent 🔍

**职责**: 分析代码结构、风格和最佳实践

**检测能力**:
- **变量命名规范**: 检测使用 `var` 而非 `const`/`let`
- **代码复杂度**: 识别过于复杂的函数或嵌套
- **最佳实践违反**: 检测不符合编程规范的代码模式

**输入**: 源代码字符串 + 编程语言类型
**输出**: 代码结构问题列表（严重等级：错误/警告/建议）

**示例检测**:
```javascript
// ❌ 问题代码
var x = 10;  // 警告：使用 var 而非 const

// ✅ 建议
const x = 10;
```

**当前实现**:
- 基于规则的静态分析
- 支持 8 种编程语言
- 平均处理时间：800-1200ms

---

### 2. 安全检测 Agent 🛡️

**职责**: 识别代码中的安全漏洞和风险

**检测能力**:
- **XSS 攻击**: 检测 `innerHTML` 直接赋值用户输入
- **SQL 注入**: 识别字符串拼接的数据库查询
- **敏感数据泄露**: 检测硬编码的密钥、密码、API 密钥
- **动态代码执行**: 检测 `eval()` 等危险函数

**输入**: 源代码字符串 + 编程语言类型
**输出**: 安全问题列表（严重等级：错误/警告/建议）

**示例检测**:
```javascript
// ❌ XSS 风险
element.innerHTML = userInput;  // 错误：XSS 风险

// ❌ 动态代码执行
eval("malicious code");  // 错误：动态代码执行

// ✅ 安全做法
element.textContent = userInput;
```

**当前实现**:
- 基于规则的静态分析
- 检测常见的 OWASP Top 10 漏洞
- 平均处理时间：1000-1500ms

---

### 3. 性能优化 Agent ⚡

**职责**: 检测性能瓶颈和优化建议

**检测能力**:
- **算法复杂度**: 识别低效的算法实现
- **内存泄漏**: 检测未释放的资源
- **不必要的网络请求**: 识别可以合并或缓存的请求
- **缓存策略**: 建议改进缓存使用

**输入**: 源代码字符串 + 编程语言类型
**输出**: 性能问题列表（严重等级：错误/警告/建议）

**示例检测**:
```javascript
// ❌ 性能问题
for (let i = 0; i < array.length; i++) {
  // 每次循环都计算 array.length
}

// ✅ 优化后
const len = array.length;
for (let i = 0; i < len; i++) {
  // 缓存长度值
}
```

**当前实现**:
- 基于规则的静态分析
- 检测常见的性能反模式
- 平均处理时间：900-1300ms

---

### 4. 文档生成 Agent 📚

**职责**: 评估代码文档的完整性和质量

**检测能力**:
- **注释完整性**: 检测缺少注释的函数和类
- **API 文档缺失**: 识别未文档化的公共接口
- **类型定义不清晰**: 检测缺少类型注解的参数
- **文档格式**: 建议使用标准的文档格式（JSDoc、docstring 等）

**输入**: 源代码字符串 + 编程语言类型
**输出**: 文档问题列表（严重等级：错误/警告/建议）

**示例检测**:
```javascript
// ❌ 缺少文档
function calculateTotal(items, taxRate) {
  return items.reduce((sum, item) => sum + item.price, 0) * (1 + taxRate);
}

// ✅ 完善的文档
/**
 * 计算商品总价（含税）
 * @param {Array<{price: number}>} items - 商品列表
 * @param {number} taxRate - 税率（0-1）
 * @returns {number} 总价
 */
function calculateTotal(items, taxRate) {
  return items.reduce((sum, item) => sum + item.price, 0) * (1 + taxRate);
}
```

**当前实现**:
- 基于规则的静态分析
- 检测常见的文档缺失模式
- 平均处理时间：700-1000ms

---

## Agent 协作流程

### 执行顺序
四个 Agent **并行执行**，不存在依赖关系：

```
提交代码
    ├─ 代码分析 Agent (800-1200ms)
    ├─ 安全检测 Agent (1000-1500ms)
    ├─ 性能优化 Agent (900-1300ms)
    └─ 文档生成 Agent (700-1000ms)
         ↓
    总耗时：1000-1500ms（取最长的 Agent）
```

### 结果聚合
1. **收集**: 从四个 Agent 收集所有问题
2. **去重**: 移除重复的问题
3. **排序**: 按严重等级排序（错误 > 警告 > 建议）
4. **分类**: 按 Agent 类型分组

### 示例输出
```json
{
  "taskId": 123,
  "issuesCount": 5,
  "issues": [
    {
      "agentType": "security_detection",
      "severity": "error",
      "title": "XSS Risk",
      "description": "innerHTML directly assigns user input",
      "lineNumber": 10,
      "suggestion": "Use textContent or DOM methods instead"
    },
    {
      "agentType": "code_analysis",
      "severity": "warning",
      "title": "Use var",
      "description": "Variable declared with var instead of const/let",
      "lineNumber": 5,
      "suggestion": "Use const for immutable variables"
    }
    // ... 更多问题
  ]
}
```

---

## 严重等级定义

| 等级 | 定义 | 示例 |
|------|------|------|
| **错误** | 必须立即修复的严重问题 | XSS 漏洞、SQL 注入、eval() 使用 |
| **警告** | 应该处理的潜在问题 | 使用 var、HTTP 连接、console.log |
| **建议** | 代码质量改进建议 | 缺少注释、算法优化、缓存策略 |

---

## 当前限制与未来改进

### 当前实现的限制
- ✅ 基于规则的静态分析（无 AST 解析）
- ✅ 模拟 Agent 实现（非真实 LLM）
- ✅ 支持 8 种编程语言
- ✅ 最长代码 10,000 行

### 未来改进方向
- 🔄 集成真实 LLM（GPT-4/Claude）
- 🔄 AST 深度分析
- 🔄 支持更多编程语言
- 🔄 自定义规则引擎
- 🔄 上下文感知分析
- 🔄 学习用户反馈优化检测规则

---

## 技术实现细节

### Agent 服务架构
```typescript
interface Agent {
  name: string;           // Agent 名称
  type: string;          // Agent 类型
  analyze: (code: string, language: string) => Promise<ReviewIssueResult[]>;
}

interface ReviewIssueResult {
  agentType: string;     // 检测 Agent 类型
  severity: 'error' | 'warning' | 'suggestion';
  title: string;         // 问题标题
  description: string;   // 问题描述
  lineNumber?: number;   // 代码行号
  suggestion: string;    // 修复建议
}
```

### 并行执行实现
```typescript
async function performCodeReview(code: string, language: string) {
  // 并行执行四个 Agent
  const [codeIssues, securityIssues, perfIssues, docIssues] = await Promise.all([
    codeAnalysisAgent.analyze(code, language),
    securityDetectionAgent.analyze(code, language),
    performanceOptimizationAgent.analyze(code, language),
    documentationGenerationAgent.analyze(code, language),
  ]);
  
  // 聚合结果
  const allIssues = [...codeIssues, ...securityIssues, ...perfIssues, ...docIssues];
  
  // 去重与排序
  return deduplicateAndSort(allIssues);
}
```

---

## 测试验证

所有 Agent 功能都通过了单元测试验证：

```
✓ 代码分析 Agent - 变量命名检查
✓ 安全检测 Agent - XSS 风险检测
✓ 性能优化 Agent - console.log 检测
✓ 文档生成 Agent - 缺少注释检测
✓ 结果排序 - 按严重等级排序
✓ 去重功能 - 移除重复问题
✓ 多语言支持 - 支持 8 种语言
```

**测试通过率**: 100% (15/15 测试通过)

---

**最后更新**: 2026-05-06
**项目版本**: f6d7d78e
