# 系统架构图

## 整体架构

```mermaid
graph TB
    User["👤 用户"]
    UI["🎨 前端 UI<br/>React 19 + Tailwind"]
    API["🔌 tRPC API<br/>Express.js"]
    Queue["📋 任务处理<br/>Agent 调度"]
    
    Agent1["🔍 代码分析 Agent"]
    Agent2["🛡️ 安全检测 Agent"]
    Agent3["⚡ 性能优化 Agent"]
    Agent4["📚 文档生成 Agent"]
    
    DB["💾 数据库<br/>MySQL/TiDB"]
    
    User -->|提交代码| UI
    UI -->|调用 tRPC| API
    API -->|分发任务| Queue
    
    Queue -->|并行执行| Agent1
    Queue -->|并行执行| Agent2
    Queue -->|并行执行| Agent3
    Queue -->|并行执行| Agent4
    
    Agent1 -->|返回结果| API
    Agent2 -->|返回结果| API
    Agent3 -->|返回结果| API
    Agent4 -->|返回结果| API
    
    API -->|存储| DB
    DB -->|查询| API
    API -->|返回结果| UI
    UI -->|展示| User
```

## 数据流架构

```mermaid
graph LR
    Input["📝 代码输入<br/>- 粘贴<br/>- 上传"]
    
    Parse["🔄 代码解析<br/>- 语言识别<br/>- 格式化"]
    
    Dispatch["📤 任务分发"]
    
    CA["代码分析<br/>Agent"]
    SD["安全检测<br/>Agent"]
    PO["性能优化<br/>Agent"]
    DG["文档生成<br/>Agent"]
    
    Aggregate["🔀 结果聚合<br/>- 去重<br/>- 排序<br/>- 分类"]
    
    Store["💾 结果存储<br/>- 问题记录<br/>- 统计更新"]
    
    Display["📊 结果展示<br/>- 问题卡片<br/>- 统计图表"]
    
    Input --> Parse
    Parse --> Dispatch
    Dispatch --> CA
    Dispatch --> SD
    Dispatch --> PO
    Dispatch --> DG
    
    CA --> Aggregate
    SD --> Aggregate
    PO --> Aggregate
    DG --> Aggregate
    
    Aggregate --> Store
    Store --> Display
```

## 前端架构

```mermaid
graph TB
    App["App.tsx<br/>路由与主布局"]
    
    Home["📄 Home.tsx<br/>首页"]
    Workbench["🔧 ReviewWorkbench.tsx<br/>审查工作台"]
    About["ℹ️ About.tsx<br/>项目介绍"]
    
    CodeEditor["📝 CodeEditor<br/>代码编辑器"]
    AgentPanel["🤖 AgentCollaborationPanel<br/>Agent 协作展示"]
    ResultCard["🎯 ReviewResultCard<br/>问题卡片"]
    Dashboard["📊 StatisticsDashboard<br/>统计仪表盘"]
    
    App --> Home
    App --> Workbench
    App --> About
    
    Workbench --> CodeEditor
    Workbench --> AgentPanel
    Workbench --> ResultCard
    Workbench --> Dashboard
    
    style App fill:#3b82f6,stroke:#1e40af,color:#fff
    style Home fill:#10b981,stroke:#047857,color:#fff
    style Workbench fill:#8b5cf6,stroke:#6d28d9,color:#fff
    style About fill:#f59e0b,stroke:#d97706,color:#fff
```

## 后端架构

```mermaid
graph TB
    Router["server/routers.ts<br/>tRPC 路由"]
    
    ReviewRouter["review.submit<br/>review.getTask<br/>review.listTasks<br/>review.getStatistics<br/>review.getAgents"]
    
    AgentService["server/agentService.ts<br/>Agent 核心逻辑"]
    
    CodeAnalysis["代码分析 Agent<br/>- 变量命名检查<br/>- 复杂度分析<br/>- 最佳实践"]
    
    SecurityDetection["安全检测 Agent<br/>- XSS 检测<br/>- 注入攻击<br/>- 敏感数据"]
    
    PerformanceOpt["性能优化 Agent<br/>- 算法复杂度<br/>- 内存泄漏<br/>- 缓存策略"]
    
    DocGeneration["文档生成 Agent<br/>- 注释完整性<br/>- API 文档<br/>- 类型定义"]
    
    DB["server/db.ts<br/>数据库操作"]
    
    Router --> ReviewRouter
    ReviewRouter --> AgentService
    
    AgentService --> CodeAnalysis
    AgentService --> SecurityDetection
    AgentService --> PerformanceOpt
    AgentService --> DocGeneration
    
    AgentService --> DB
    
    style Router fill:#3b82f6,stroke:#1e40af,color:#fff
    style AgentService fill:#8b5cf6,stroke:#6d28d9,color:#fff
    style DB fill:#10b981,stroke:#047857,color:#fff
```

## 数据库 Schema

```mermaid
erDiagram
    USERS ||--o{ REVIEW_TASKS : creates
    REVIEW_TASKS ||--o{ REVIEW_ISSUES : contains
    REVIEW_TASKS ||--o{ REVIEW_STATISTICS : updates
    
    USERS {
        int id PK
        string openId UK
        string name
        string email
        enum role
        timestamp createdAt
    }
    
    REVIEW_TASKS {
        int id PK
        int userId FK
        string code
        string language
        string title
        int issuesCount
        timestamp createdAt
    }
    
    REVIEW_ISSUES {
        int id PK
        int taskId FK
        string agentType
        enum severity
        string title
        string description
        int lineNumber
        string suggestion
        timestamp createdAt
    }
    
    REVIEW_STATISTICS {
        int id PK
        int userId FK
        int totalReviews
        int totalIssuesFound
        int errorCount
        int warningCount
        int suggestionCount
        int fixedIssuesCount
        timestamp updatedAt
    }
```

## 执行流程时序图

```mermaid
sequenceDiagram
    participant User as 👤 用户
    participant UI as 🎨 前端
    participant API as 🔌 API
    participant Agents as 🤖 Agents
    participant DB as 💾 数据库
    
    User->>UI: 1. 提交代码
    UI->>API: 2. 调用 review.submit
    API->>Agents: 3. 分发给四个 Agent
    
    par 并行执行
        Agents->>Agents: 代码分析 Agent
        Agents->>Agents: 安全检测 Agent
        Agents->>Agents: 性能优化 Agent
        Agents->>Agents: 文档生成 Agent
    end
    
    Agents->>API: 4. 返回检测结果
    API->>DB: 5. 存储结果
    API->>UI: 6. 推送结果
    UI->>User: 7. 展示结果
```

## 技术栈层次

```
┌─────────────────────────────────────────────────────┐
│              前端展示层 (React 19)                   │
│  - 代码编辑器 | Agent 面板 | 结果卡片 | 统计图表    │
└────────────────────┬────────────────────────────────┘
                     │ tRPC
┌────────────────────▼────────────────────────────────┐
│           API 层 (Express.js + tRPC)                │
│  - 路由定义 | 请求处理 | 业务逻辑编排              │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│         Agent 服务层 (agentService.ts)             │
│  - 代码分析 | 安全检测 | 性能优化 | 文档生成       │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│         数据持久化层 (Drizzle ORM)                  │
│  - 任务存储 | 问题记录 | 统计数据                   │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│         数据库层 (MySQL/TiDB)                       │
│  - 关系型数据存储 | 事务管理 | 索引优化            │
└─────────────────────────────────────────────────────┘
```

## 当前实现状态

### ✅ 已实现的组件
- React 19 前端应用
- Express.js + tRPC 后端 API
- Drizzle ORM 数据库层
- MySQL/TiDB 数据库
- 四个 Agent 服务（模拟实现）
- 完整的用户界面与交互流程

### 🔄 规划中的功能
- 真实 LLM 集成（GPT-4/Claude）
- 历史记录对比功能
- 导出审查报告（PDF/Excel）
- IDE 插件（VS Code/JetBrains）
- 团队协作功能
- 缓存层优化
- 负载均衡与多实例部署
